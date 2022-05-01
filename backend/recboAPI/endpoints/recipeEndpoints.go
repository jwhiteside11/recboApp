package endpoints

import (
	"net/http"
	"recbo/backend/recboAPI/awsutils"
	"recbo/backend/recboAPI/rbtypes"
	"recbo/backend/recboAPI/search"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Split string into []string by specified delimiter
func splitString(s string, delimiter rune) []string {
	arr := make([]string, 0)
	j := 0
	for i, ch := range s {
		if ch == delimiter {
			arr = append(arr, s[j:i])
			j = i + 1
		}
	}
	if j < len(s) {
		arr = append(arr, s[j:])
	}
	return arr
}

// GET /recipes - get recipes specified by ids query param
func getRecipe(c *gin.Context) {
	var input rbtypes.GetRecipeAPIInput
	if err := c.ShouldBindQuery(&input); err != nil {
		inputNotValid(c)
		return
	}

	recipe, err := awsutils.GetRecipe(input.RecipeID)
	if err != nil {
		reportError(c, err)
		return
	}

	c.IndentedJSON(http.StatusOK, recipe)
}

// POST /recipes - add recipe to data store
func putRecipe(c *gin.Context) {
	var input rbtypes.PutRecipeAPIInput
	if err := c.ShouldBindJSON(&input); err != nil {
		inputNotValid(c)
		return
	}

	// generate unique recipeID
	recipeID := uuid.NewString()
	// check for id in typesense, generate new if found
	match, err := search.GetRecipesByID([]string{recipeID})
	if err != nil {
		reportError(c, err)
		return
	}
	if len(match) > 0 {
		recipeID = uuid.NewString()
	}
	// Index data in typesense
	recipe, err := search.AddRecipe(&input)
	if err != nil {
		reportError(c, err)
		return
	}
	// Add the new recipe to the s3 bucket
	_, err = awsutils.AddRecipe(&input)
	if err != nil {
		// unsuccessful, remove from typesense
		search.DeleteRecipe(recipeID)
		reportError(c, err)
		return
	}

	c.IndentedJSON(http.StatusCreated, recipe)
}

// PATCH /recipes - update recipe in data store
func updateRecipe(c *gin.Context) {
	var input rbtypes.UpdateRecipeAPIInput
	if err := c.ShouldBindJSON(&input); err != nil {
		inputNotValid(c)
		return
	}
	// read metadata from typesense to determine its genuine author
	recipeMeta, err := search.GetRecipeByID(input.RecipeID)
	if err != nil {
		reportError(c, err)
		return
	}

	genuineAuthor, recipeName := recipeMeta["authorUsername"].(string), recipeMeta["recipeName"].(string)
	// ensure author matches credential claims
	userAuthID := c.Request.Header.Get("recbo-credential-id")
	if err != nil {
		reportError(c, err)
		return
	}

	if userAuthID != genuineAuthor {
		reportErrorStr(c, "user does not have permission to update this resource")
		return
	}
	// Update metadata in typesense index, if necessary
	if input.Metadata.Name != recipeName {
		_, err := search.UpdateRecipe(&input)
		if err != nil {
			reportError(c, err)
			return
		}
	}
	// Add the new recipe to the s3 bucket, will become newest version
	recipe, err := awsutils.UpdateRecipe(&input)

	if err != nil {
		input.Metadata.Name = recipeName
		search.UpdateRecipe(&input)
		reportError(c, err)
		return
	}

	c.IndentedJSON(http.StatusCreated, recipe)
}

// GET /recipes/meta - get recipes specified by ids query param
func getRecipeMetadata(c *gin.Context) {
	var metaIDs rbtypes.GetRecipeMetadataIDAPIInput
	var metaUsername rbtypes.GetRecipeMetadataAuthorAPIInput
	isByAuthor := false

	if err := c.ShouldBindJSON(&metaIDs); err != nil {
		if err := c.ShouldBindJSON(&metaUsername); err != nil {
			inputNotValid(c)
			return
		}
		isByAuthor = true
	}

	if isByAuthor {
		res, err := search.QueryRecipeByAuthor(metaUsername.AuthorUsername)
		if err != nil {
			reportError(c, err)
			return
		}
		documents := make([]map[string]interface{}, *res.Found)

		for i, hit := range *res.Hits {
			documents[i] = *hit.Document
		}

		c.IndentedJSON(http.StatusOK, documents)
		return
	}

	recipesStr, err := search.GetRecipesByID(metaIDs.RecipeIDs)
	if err != nil {
		reportError(c, err)
		return
	}

	c.IndentedJSON(http.StatusOK, recipesStr)
}

// Map endpoints to fns
func ConfigureRecipeEndpoints(router *gin.Engine) {
	router.GET("/recipe", getRecipe)
	router.POST("/recipe", putRecipe)
	router.PATCH("/recipe", updateRecipe)
	router.GET("/recipe/meta", getRecipeMetadata)
}

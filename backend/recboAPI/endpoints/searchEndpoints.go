package endpoints

import (
	"fmt"
	"net/http"
	"recbo/backend/recboAPI/rbtypes"
	"recbo/backend/recboAPI/search"

	"github.com/gin-gonic/gin"
)

func requestSearch(c *gin.Context) {
	var input rbtypes.SearchAPIInput
	if err := c.ShouldBindJSON(&input); err != nil {
		inputNotValid(c)
		return
	}

	switch input.For {
	case "recipesByName":
		searchRecipesByName(input.Search, c)
	case "usersByUsername":
		searchUsersByUsername(input.Search, c)
	default:
		reportErrorStr(c, "'for' field invalid")
		return
	}
}

func searchRecipesByName(searchStr string, c *gin.Context) {
	res, err := search.QueryRecipeByName(searchStr)
	if err != nil {
		reportErrorStr(c, "request could not be completed")
		return
	}

	recipeData := make([]rbtypes.SearchRecipeDataOutput, 0, *res.Found)
	for _, hit := range *res.Hits {
		doc := *hit.Document
		id, name, authorName := doc["id"], doc["recipeName"], doc["authorUsername"]
		if id == nil || name == nil || authorName == nil {
			fmt.Println("field nil", doc)
			continue
		}
		r := rbtypes.SearchRecipeDataOutput{id.(string), name.(string), authorName.(string)}
		recipeData = append(recipeData, r)
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "search completed", "results": recipeData})
}

func searchUsersByUsername(searchStr string, c *gin.Context) {

}

// Map endpoints to fns
func ConfigureSearchEndpoints(router *gin.Engine) {
	router.POST("/search", requestSearch)
}

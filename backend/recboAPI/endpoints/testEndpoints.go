package endpoints

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"recbo/backend/recboAPI/auth"
	"recbo/backend/recboAPI/awsutils"
	"recbo/backend/recboAPI/dummydata"
	"recbo/backend/recboAPI/rbtypes"
	"recbo/backend/recboAPI/search"

	"github.com/gin-gonic/gin"
)

// Test auth utils
func testAuth(c *gin.Context) {
	refreshKey := "xyz"
	userInfo := rbtypes.UserAuthInfo{"jw123", "basic"}
	credentials, err := auth.AwardAuthCredentials(userInfo, refreshKey)
	// Verify/decode token from link; if token is verified, check for email/username to match password
	// Return 200 if JWT success and credential success, else 401
	// Create and return auth token for user to use in subsequent requests
	if err != nil {
		c.IndentedJSON(http.StatusOK, gin.H{"message": "jwt encoding failed"})
		return
	}

	decodedRequest, err1 := auth.VerifyRequestToken(credentials.RequestToken)
	if err1 != nil {
		c.IndentedJSON(http.StatusOK, gin.H{"message": err1})
		return
	}

	decodedRefresh, err2 := auth.VerifyRefreshToken(credentials.RefreshToken)
	if err2 != nil {
		c.IndentedJSON(http.StatusOK, gin.H{"message": err2})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "auth test success", "request decoded": decodedRequest, "refresh decoded": decodedRefresh, "request encoded": credentials.RequestToken, "refresh encoded": credentials.RefreshToken})
}

func testAuthUtils(c *gin.Context) {
	cred, err := auth.RefreshCredentials("boogetyboo")
	if err != nil {
		reportError(c, err)
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "auth test success", "credentials": cred})
}

/* Test AWS utils */

// GET /recipes - get recipes specified by ids query param
func testTypesenseEndpoints(c *gin.Context) {
	search.TestTypeSense()

	c.IndentedJSON(http.StatusOK, "test run")
}

// GET /recipes - get recipes specified by ids query param
func testS3Endpoints(c *gin.Context) {
	awsutils.TestS3()
	// awsutils.SelectFromRecipes([]string{"AAAA-0000-0000"})
	c.IndentedJSON(http.StatusOK, "test run")
}

// GET /recipes - get recipes specified by ids query param
func testDynamoDBEndpoints(c *gin.Context) {
	//s3.TestS3()
	awsutils.TestDynamoDB()
	c.IndentedJSON(http.StatusOK, "test run")
}

// GET /recipes - get recipes specified by ids query param
func testSearch(c *gin.Context) {
	//s3.TestS3()
	err := search.BuildCollectionsFromDummyData()
	c.IndentedJSON(http.StatusOK, err)
}

/* LOCAL DUMMY RECIPE DATA */

// GET /recipes - get recipes specified by ids query param
func getDummyRecipes(c *gin.Context) {
	recipes := make([]rbtypes.Recipe, 0)

	params := c.Request.URL.Query()
	idStringArr, ok := params["ids"]

	if ok && len(idStringArr) >= 1 {
		idString := idStringArr[0]
		ids := splitString(idString, ',')
		for _, id := range ids {
			if val, found := dummydata.RecipeMap[id]; found {
				recipes = append(recipes, val)
			}
		}
	}

	c.IndentedJSON(http.StatusOK, recipes)
}

// GET /recipes/meta - get recipes specified by ids query param
func getDummyRecipeMetaInfo(c *gin.Context) {
	recipes := make([]rbtypes.RecipeMetaInfo, 0)

	params := c.Request.URL.Query()
	idStringArr, ok := params["ids"]
	fmt.Println("INIT meta", idStringArr)
	if ok && len(idStringArr) >= 1 {
		idString := idStringArr[0]
		fmt.Println("PRESPLIT", idString)
		ids := splitString(idString, ',')
		fmt.Println("SPLIT", ids)
		for _, id := range ids {
			fmt.Println("TRYING", id)
			if val, found := dummydata.RecipeMetaInfoMap[id]; found {
				recipes = append(recipes, val)
			}
		}
	}

	c.IndentedJSON(http.StatusOK, recipes)
}

// POST /recipes - add recipe to data store
func postDummyRecipe(c *gin.Context) {
	var newRecipe rbtypes.Recipe

	if err := c.BindJSON(&newRecipe); err != nil {
		return
	}

	// Add the new recipe to the map.
	dummydata.RecipeMap[newRecipe.ID] = newRecipe
	c.IndentedJSON(http.StatusCreated, newRecipe)
}

// PATCH /recipes - update recipe in data store
func updateDummyRecipe(c *gin.Context) {
	var updatedRecipe rbtypes.Recipe

	if err := c.BindJSON(&updatedRecipe); err != nil {
		return
	}

	if _, found := dummydata.RecipeMap[updatedRecipe.ID]; found {
		dummydata.RecipeMap[updatedRecipe.ID] = updatedRecipe
		c.IndentedJSON(http.StatusOK, updatedRecipe)
	} else {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "recipe not found"})
	}
}

func testForwardProxy(c *gin.Context) {
	url_proxy, err := url.Parse("http://forwardproxy:8800/")
	if err != nil {
		reportError(c, err)
		return
	}

	transport := http.Transport{Proxy: http.ProxyURL(url_proxy)}
	client := &http.Client{Transport: &transport}
	resp, err := client.Get("https://www.google.com/")
	if err != nil {
		reportError(c, err)
		return
	}
	fmt.Println("RESPONSE RECEIVED", resp.Status)
	website, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		reportError(c, err)
		return
	}

	resp.Body.Close()

	c.IndentedJSON(http.StatusOK, &gin.H{"content": string(website)})
}

// Map endpoints to fns
func ConfigureTestEndpoints(router *gin.Engine) {
	router.GET("/testauth", testAuthUtils)
	router.GET("/testtypesense", testTypesenseEndpoints)
	router.GET("/tests3", testS3Endpoints)
	router.GET("/testdb", testDynamoDBEndpoints)
	router.GET("/testsearch", testSearch)
	router.GET("/testforward", testForwardProxy)
	// Dummy endpoints (local dev data)
	router.GET("/dummyrecipes", getDummyRecipes)
	router.POST("/dummyrecipes", postDummyRecipe)
	router.PATCH("/dummyrecipes", updateDummyRecipe)
	router.GET("/dummyrecipes/meta", getDummyRecipeMetaInfo)
}

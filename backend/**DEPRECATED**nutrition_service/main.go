package main

import (
	"net/http"
	"recbo/backend/nutrition_service/parser"

	"github.com/gin-gonic/gin"
)

/*
 * The nutrition service performs analysis on ingredient lists and returns detailed nutritional information
 * From each ingredient (starting as a string), the following relevant info must be extracted:
 *  - Quantity, unit, and nutritional synonym
 * Using this info, we can compile accurate nutirional info to link to recipes
 */

type IngredientInput struct {
	List []string `json:"ingredients"`
}

func parseIngredientEndpoint(c *gin.Context) {
	var ll IngredientInput

	if c.BindJSON(&ll) != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "list input format not accepted"})
		return
	}

	res := parser.ParseIngredientList(ll.List)
	c.IndentedJSON(http.StatusOK, res)
}

func main() {
	router := gin.Default()

	router.POST("/parse-list", parseIngredientEndpoint)

	router.Run("localhost:8080")
}

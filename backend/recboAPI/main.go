package main

import (
	"recbo/backend/recboAPI/auth"
	"recbo/backend/recboAPI/awsutils"
	"recbo/backend/recboAPI/endpoints"
	"recbo/backend/recboAPI/middleware"
	"recbo/backend/recboAPI/search"

	"github.com/gin-gonic/gin"
)

func runTests() {
	// mailer.SendVerificationEmail("jwhitesidecollege@gmail.com", "abc")
	configureUtils()
	search.TestTypeSense()
}

func configureUtils() {
	// Configure auth utils with keys and secrets
	auth.ConfigureAuthUtils()
	// Configure TypeSense search client
	search.ConfigureTypeSense()
	// Configure AWS clients/credentials
	awsutils.ConfigureAWSUtils()
}

func configureMiddleware(router *gin.Engine) {
	// TODO
	router.Use(middleware.CORSMiddleware(), middleware.CheckCredentials())
}

func configureEndpoints(router *gin.Engine) {
	endpoints.ConfigureAuthEndpoints(router)
	endpoints.ConfigureUserEndpoints(router)
	endpoints.ConfigureRecipeEndpoints(router)
	endpoints.ConfigureSearchEndpoints(router)
	endpoints.ConfigureTestEndpoints(router)
}

func runApp() {
	// Call util config fns
	configureUtils()
	// Create instance of gin engine
	router := gin.Default()
	// Call middleware
	configureMiddleware(router)
	// Configure REST API Endpoints
	configureEndpoints(router)
	// Serve on port 8080
	router.Run("0.0.0.0:8080")
}

func main() {
	// runTests()
	runApp()
}

package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize private key variable from .pem
	ConfigureAuthUtils()
	// Create typesense client
	ConfigureTypeSense()
	// Create instance of gin engine
	router := gin.Default()
	//router.SetTrustedProxies([]string{"127.0.0.1", "localhost", "0.0.0.0"})
	router.Use(CORSMiddleware())
	ConfigureEndpoints(router)
	// Serve on port 8120
	router.Run("0.0.0.0:8120")
}

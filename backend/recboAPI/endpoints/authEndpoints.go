package endpoints

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST /auth/check-credentials - check cookies for valid credentials, refresh if valid
func checkCredentials(c *gin.Context) {
	fmt.Println("HEADER OUT", c.Request.Header.Get("recbo-credential-id"))
	fmt.Println("HEADER OUT", c.Request.Header.Get("recbo-auth-type"))
	fmt.Println(c.Request.Cookie("recbo-request-token"))
	fmt.Println(c.Request.Cookie("recbo-refresh-token"))
	// if it makes it through the middleware the credentials are valid
	c.IndentedJSON(http.StatusOK, gin.H{"message": "credentials valid"})
}

func inputNotValid(c *gin.Context) {
	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "input format not valid, please check inputs"})
}

func reportError(c *gin.Context, err error) {
	fmt.Println(err)
	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err})
}

func reportErrorStr(c *gin.Context, s string) {
	fmt.Println(s)
	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": s})
}

// Map endpoints to fns
func ConfigureAuthEndpoints(router *gin.Engine) {
	// Serve endpoints
	router.GET("/auth/check-credentials", checkCredentials)
}

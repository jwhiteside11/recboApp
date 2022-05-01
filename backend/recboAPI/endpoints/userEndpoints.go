package endpoints

import (
	"net/http"
	"recbo/backend/recboAPI/auth"
	"recbo/backend/recboAPI/awsutils"

	"github.com/gin-gonic/gin"
)

type GetUserProfileAPIInput struct {
	Username string `form:"username" binding:"required,min=4,max=30"`
}

// GET /user/profile - get user by specified id
func getUserProfileByUsername(c *gin.Context) {
	var input GetUserProfileAPIInput
	if err := c.ShouldBindQuery(&input); err != nil {
		inputNotValid(c)
		return
	}

	// Check if user has proper credentials
	claims, err := auth.GetCredentialClaims(c)
	if err != nil {
		reportError(c, err)
		return
	}

	tokenUsername := claims["username"].(string)

	if tokenUsername != input.Username {
		reportErrorStr(c, "user does not have permission to access this resource")
		return
	}

	user, err := awsutils.GetUserProfile(input.Username)
	if err != nil {
		reportError(c, err)
		return
	}

	c.IndentedJSON(http.StatusOK, user)
}

// Map endpoints to fns
func ConfigureUserEndpoints(router *gin.Engine) {
	router.GET("/user/profile", getUserProfileByUsername)
}

package main

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GET /auth/verify?token - authorize JWT token
func requestValidationEmail(c *gin.Context) {
	var input RequestValidationAPIInput
	if err := c.ShouldBindJSON(&input); err != nil {
		inputNotValid(c)
		return
	}
	email := input.Email
	// Check for email in typesense
	_, credErr := GetUserCredentialsByEmail(email)
	if credErr == nil { // email found, already being used
		reportErrorStr(c, "user already exists")
		return
	}

	dbEmailData, verErr := AddToUnverifiedEmailCount(email)
	if verErr == nil {
		if dbEmailData["emailCount"].(int) >= 3 {
			reportErrorStr(c, "already sent multiple emails to this address")
			return
		}
	}

	emailKey := uuid.NewString()
	// Create jwt with email encoded as subject
	token, err := CreateSignUpToken(emailKey)
	if err != nil {
		reportErrorStr(c, "could not create email token")
		return
	}
	// save email key to typesense
	if dbEmailData == nil {
		res, err := AddUnverifiedEmailKey(email, emailKey)
		if err != nil {
			fmt.Println("RES", res)
			reportError(c, err)
			return
		}
	}
	// send verification email with token
	if err := SendVerificationEmail(email, token); err != nil {
		reportErrorStr(c, "could not send verification email")
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "verification email sent", "token": token})
}

// POST /auth/verify - validates token containing new user's email, then attempts to write credentials to database (will not overwrite existing users)
func attemptSignUp(c *gin.Context) {
	var input SignUpAPIInput
	if err := c.ShouldBindJSON(&input); err != nil {
		inputNotValid(c)
		return
	}
	// Verify email token
	emailToken := input.EmailToken
	claims, err := VerifySignUpToken(emailToken)
	tokenType, emailKey := interfaceToString(claims["tokenType"]), interfaceToString(claims["emailKey"])

	if err != nil || tokenType != "sign_up" {
		reportErrorStr(c, "invalid email token")
		return
	}
	// Get email from emailKey in typesense
	emailRes, err := GetUnverifiedEmailUsingKey(emailKey)
	if err != nil {
		reportError(c, err)
		return
	}

	// check store for username
	_, credErr := GetUserCredentialsByUsername(input.Username)
	if credErr == nil {
		reportErrorStr(c, "user already exists")
		return
	}

	email := interfaceToString(emailRes["id"])
	refreshKey := uuid.NewString()
	// Token valid, write credentials to db
	_, err = AddUserCredentials(email, input.Username, input.Password, refreshKey)
	if err != nil {
		reportError(c, err)
		return
	}
	// Create token credentials for new user
	createAndReturnTokens(c, UserAuthInfo{input.Username, "basic"}, refreshKey)
}

// POST /auth/login - validates username/email matches pw given, then award tokens if valid
func attemptLogin(c *gin.Context) {
	var usernameInput LoginAPIInputUsername
	var emailInput LoginAPIInputEmail
	usingEmail := false
	if err := c.ShouldBindJSON(&usernameInput); err != nil {
		if err := c.ShouldBindJSON(&emailInput); err != nil {
			inputNotValid(c)
			return
		}
		usingEmail = true
	}
	fmt.Println("got login info", emailInput.Email, usernameInput.Username, usernameInput.Password, usingEmail)
	// Check for email/username to match password
	var dbCreds map[string]interface{}
	var err error

	if usingEmail {
		reportErrorStr(c, "must log in using username")
		return
		// dbCreds, err = awsutils.GetUserCredentialsByEmail(loginEmailInfo.Email)
		// if err != nil {
		// 	reportError(c, err)
		// 	return
		// }
	} else {
		dbCreds, err = GetUserCredentialsByUsername(usernameInput.Username)
		if err != nil {
			reportErrorStr(c, "username or password invalid")
			return
		}
	}

	pw := interfaceToString(dbCreds["password"])

	fmt.Println("got pw", pw)

	if usingEmail {
		if !PasswordsMatch(emailInput.Password, pw) {
			reportErrorStr(c, "username or password invalid")
			return
		}
	} else {
		if !PasswordsMatch(pw, usernameInput.Password) {
			reportErrorStr(c, "username or password invalid")
			return
		}
	}

	// Check db for refresh key, update if necessary
	username, refreshKey := interfaceToString(dbCreds["id"]), interfaceToString(dbCreds["refreshKey"])
	// Create tokens and return to users for subsequent requests
	createAndReturnTokens(c, UserAuthInfo{username, "basic"}, refreshKey)
}

// Helper fn for creating JWT and returning them in JSON
func createAndReturnTokens(c *gin.Context, userInfo UserAuthInfo, refreshKey string) {
	// If valid, create new tokens for user and return
	newCreds, err := AwardAuthCredentials(userInfo, refreshKey)
	if err != nil {
		reportError(c, err)
		return
	}

	setCookie(c, "recbo-request-token", newCreds.RequestToken, REQUEST_TOKEN_LIFESPAN)
	setCookie(c, "recbo-refresh-token", newCreds.RefreshToken, REFRESH_TOKEN_LIFESPAN)

	c.IndentedJSON(http.StatusOK, gin.H{"message": "credentials awarded"})
}

func attemptLogout(c *gin.Context) {
	// clear user credential cookies
	createAndReturnEmptyTokens(c)
}

// Helper fn for creating JWT and returning them in JSON
func createAndReturnEmptyTokens(c *gin.Context) {
	// set cookies to empty string with Max-age = -1
	setCookie(c, "recbo-request-token", "", -1)
	setCookie(c, "recbo-refresh-token", "", -1)

	c.IndentedJSON(http.StatusOK, gin.H{"message": "credentials cleared"})
}

// GET /refresh - verifies refresh token. if valid, awards new tokens
func refreshCredentials(c *gin.Context) {
	var input RefreshCredentialAPIInput
	if err := c.ShouldBindQuery(&input); err != nil {
		reportError(c, err)
		return
	}
	claims, err := VerifyRefreshToken(input.RefreshToken)
	if err != nil {
		reportError(c, err)
		return
	}
	// check refresh key against value in typesense
	username, refreshKey := claims["username"], claims["refreshKey"]
	if username == nil || refreshKey == nil {
		reportErrorStr(c, "token claims invalid")
		return
	}
	fmt.Println("***HELLO***", username, refreshKey)
	usernameStr, refreshKeyStr := interfaceToString(username), interfaceToString(refreshKey)
	creds, err := GetUserCredentialsByUsername(usernameStr)
	if err != nil {
		reportError(c, err)
		return
	}

	dbKey := interfaceToString(creds["refreshKey"])
	if dbKey != refreshKey {
		reportErrorStr(c, "token is not valid")
		return
	}

	newCreds, err := AwardAuthCredentials(UserAuthInfo{usernameStr, "basic"}, refreshKeyStr)
	if err != nil {
		reportError(c, err)
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"credentials": newCreds})
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

func setCookie(c *gin.Context, name, value string, maxAge int) {
	cookie := http.Cookie{
		Name:     url.QueryEscape(name),
		Value:    url.QueryEscape(value),
		MaxAge:   maxAge,
		Path:     "/",
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
		HttpOnly: true,
	}

	fmt.Println("setting cookie", cookie.String())
	http.SetCookie(c.Writer, &cookie)
}

func testEndpoint(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"message": "test complete! :)"})
}

func TestTypesense(c *gin.Context) {
	testTypeSense()
	c.IndentedJSON(http.StatusOK, gin.H{"message": "typesense test complete! :)"})
}

// Map endpoints to fns
func ConfigureEndpoints(router *gin.Engine) {
	// Serve endpoints
	router.GET("/test", testEndpoint)
	router.GET("/test-search", TestTypesense)

	router.POST("/request-validation", requestValidationEmail)
	router.POST("/sign-up", attemptSignUp)
	router.POST("/login", attemptLogin)
	router.GET("/logout", attemptLogout)
	router.GET("/refresh", refreshCredentials)
}

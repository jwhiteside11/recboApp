package middleware

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"recbo/backend/recboAPI/auth"

	"github.com/gin-gonic/gin"
)

type RefreshCredentialResponseData struct {
	RequestToken string `json:"requestToken"`
	RefreshToken string `json:"refreshToken"`
}

type RefreshCredentialResponse struct {
	Credentials RefreshCredentialResponseData `json:"credentials"`
}

func respondWithError(c *gin.Context, code int, message interface{}) {
	fmt.Println(message)
	c.AbortWithStatusJSON(code, gin.H{"error": message})
}

func setCookie(c *gin.Context, name, value string, maxAge int) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     name,
		Value:    url.QueryEscape(value),
		MaxAge:   maxAge,
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
		HttpOnly: true,
	})
}

func setPermissionHeaders(c *gin.Context, username, authType string) {
	c.Request.Header.Set("recbo-credential-id", username)
	c.Request.Header.Set("recbo-auth-type", authType)
}

func setCredentialCookies(c *gin.Context, requestToken, refreshToken string) {
	setCookie(c, "recbo-request-token", requestToken, auth.REQUEST_TOKEN_LIFESPAN)
	setCookie(c, "recbo-refresh-token", refreshToken, auth.REFRESH_TOKEN_LIFESPAN)
}

func CheckCredentials() gin.HandlerFunc {
	return func(c *gin.Context) { // DEV
		c.Next()
	}
	return func(c *gin.Context) {
		requestCookie, err1 := c.Request.Cookie("recbo-request-token")
		refreshCookie, err2 := c.Request.Cookie("recbo-refresh-token")
		if err1 != nil && err2 != nil {
			respondWithError(c, http.StatusBadRequest, "must provide credentials")
			return
		}

		if err1 == nil {
			requestToken := requestCookie.Value
			// verify request token
			claims, vErr := auth.VerifyRequestToken(requestToken)
			if vErr == nil { // request token valid
				setPermissionHeaders(c, interfaceToString(claims["username"]), interfaceToString(claims["userAuthType"]))
				c.Next()
				return
			}
		}
		// request token invalid, check refresh
		claims, err := auth.VerifyRefreshToken(refreshCookie.Value)
		if err != nil { // refresh token invalid, user cannot proceed
			respondWithError(c, http.StatusBadRequest, err)
			return
		}
		// refresh token valid, send for creds from auth server
		res, err := auth.RefreshCredentials(refreshCookie.Value)
		if err != nil {
			respondWithError(c, http.StatusBadRequest, err)
			return
		}
		if res.StatusCode != 200 {
			respondWithError(c, res.StatusCode, res.Body)
			return
		}

		bodyBytes, err := io.ReadAll(res.Body)
		if err != nil {
			respondWithError(c, http.StatusBadRequest, err)
			return
		}
		bodyStr := string(bodyBytes)
		fmt.Println(bodyStr)
		var credRes RefreshCredentialResponse
		if err := json.Unmarshal(bodyBytes, &credRes); err != nil {
			respondWithError(c, http.StatusBadRequest, err)
			return
		}
		fmt.Println("CREDRES", credRes.Credentials.RequestToken, credRes.Credentials.RefreshToken)

		setPermissionHeaders(c, interfaceToString(claims["username"]), interfaceToString(claims["userAuthType"]))
		setCredentialCookies(c, credRes.Credentials.RequestToken, credRes.Credentials.RefreshToken)
		// request token valid
		fmt.Println("valid credentials")
		c.Next()
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func interfaceToString(val interface{}) string {
	return fmt.Sprintf("%v", val)
}

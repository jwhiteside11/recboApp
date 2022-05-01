package auth

import (
	"crypto/rsa"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"recbo/backend/recboAPI/rbtypes"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

const (
	PRIVATE_KEY_PATH       = "./private.pem" // openssl genrsa -out app.rsa keysize
	PUBLIC_KEY_PATH        = "./public.pem"  // openssl rsa -in app.rsa -pubout > app.rsa.pub
	RSA_PW                 = "JW0921recbo"   // rsa private key pem pw
	REQUEST_TOKEN_LIFESPAN = 100             // lifespan of basic request token in seconds (1 hour)
	REFRESH_TOKEN_LIFESPAN = 172800          // lifespan of basic refresh token in seconds (2 days)
	EMAIL_TOKEN_LIFESPAN   = 3600            // lifespan of email token in seconds (1 hour)
)

type TokenData struct {
	Token string `form:"token" json:"token"`
}

type EmailTokenClaims struct {
	Email     string `json:"email"`
	TokenType string `json:"tokenType"`
	jwt.StandardClaims
}

type RequestTokenClaims struct {
	Username     string `json:"username"`
	UserAuthType string `json:"userAuthType"` // auth-types: basic, vip, admin
	TokenType    string `json:"tokenType"`
	jwt.StandardClaims
}

type RefreshTokenClaims struct {
	Username     string `json:"username"`
	UserAuthType string `json:"userAuthType"` // auth-types: basic, vip, admin
	RefreshKey   string `json:"refreshKey"`
	TokenType    string `json:"tokenType"`
	jwt.StandardClaims
}

type AuthCredentials struct {
	RequestToken string `json:"requestToken"`
	RefreshToken string `json:"refreshToken"`
}

var (
	verifyKey *rsa.PublicKey
	signKey   *rsa.PrivateKey
)

// Initialize keys (env vars/.pem files)
func ConfigureAuthUtils() {
	signBytes, err := ioutil.ReadFile(PRIVATE_KEY_PATH)
	fatal(err)

	signKey, err = jwt.ParseRSAPrivateKeyFromPEMWithPassword(signBytes, "JDW0921recbo")
	fatal(err)

	verifyBytes, err := ioutil.ReadFile(PUBLIC_KEY_PATH)
	fatal(err)

	verifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
	fatal(err)
}

// Create and sign tokens given user id and permissions
func AwardAuthCredentials(authInfo rbtypes.UserAuthInfo, refreshKey string) (AuthCredentials, error) {
	// Form JWT claims for both tokens
	timeNow := time.Now().Unix()
	jtiReq, jtiRef := uuid.NewString(), uuid.NewString()
	reqExp, refExp := (timeNow + REQUEST_TOKEN_LIFESPAN), (timeNow + REFRESH_TOKEN_LIFESPAN)

	standardReq := jwt.StandardClaims{
		Issuer:    "recbo.co",
		Subject:   authInfo.Username,
		Audience:  "recbo.co",
		IssuedAt:  timeNow,
		ExpiresAt: reqExp,
		NotBefore: timeNow,
		Id:        jtiReq,
	}

	standardRef := standardReq
	standardRef.Id = jtiRef
	standardRef.ExpiresAt = refExp

	claims := RequestTokenClaims{
		authInfo.Username,
		authInfo.UserAuthType,
		"request",
		standardReq,
	}
	refreshClaims := RefreshTokenClaims{
		authInfo.Username,
		authInfo.UserAuthType,
		refreshKey,
		"refresh",
		standardRef,
	}
	// Encode payload and header
	requestToken := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodRS256, refreshClaims)

	// Sign and return tokens
	creds := AuthCredentials{}
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := requestToken.SignedString(signKey)
	if err != nil {
		return creds, err
	}
	refreshString, err := refreshToken.SignedString(signKey)
	if err != nil {
		return creds, err
	}

	creds.RequestToken = tokenString
	creds.RefreshToken = refreshString

	return creds, nil
}

// Verify token input, return claims if valid
func DecodeAuthToken(tokenString string) (jwt.MapClaims, error) {
	// Decode jwt
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Verify token is signed w/ rsa
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return verifyKey, nil
	})

	if err != nil {
		return nil, fmt.Errorf("unable to verify jwt")
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return nil, fmt.Errorf("error parsing jwt claims invalid")
	}

	if !token.Valid {
		return nil, fmt.Errorf("jwt claims invalid")
	}

	return claims, nil
}

func VerifyAuthToken(tokenString, tokenType string) (jwt.MapClaims, error) {
	// Decode jwt
	mapClaims, err := DecodeAuthToken(tokenString)
	if err != nil {
		return nil, err
	}

	claimTokenType := mapClaims["tokenType"]
	if claimTokenType != tokenType {
		return nil, errors.New("token must be of " + tokenType + " token type")
	}

	return mapClaims, nil
}

// Verify token input, return claims if valid
func VerifyRequestToken(tokenString string) (jwt.MapClaims, error) {
	return VerifyAuthToken(tokenString, "request")
}

// Verify token input, return claims if valid
func VerifyRefreshToken(tokenString string) (jwt.MapClaims, error) {
	return VerifyAuthToken(tokenString, "refresh")
}

// Verify token input, return claims if valid
func VerifyEmailToken(tokenString string) (jwt.MapClaims, error) {
	return VerifyAuthToken(tokenString, "unverified_email")
}

// Verify token input, return claims if valid
func VerifySignUpToken(tokenString string) (jwt.MapClaims, error) {
	return VerifyAuthToken(tokenString, "verified_email")
}

// TODO
func RetrieveRefreshKey(authInfo rbtypes.UserAuthInfo) (string, error) {
	// Retrieve refresh key from db
	refreshKey := "xyz"
	// If empty, overwrite with new key. If error, return 401

	return refreshKey, nil
}

func GetCredentialClaims(c *gin.Context) (jwt.MapClaims, error) {
	requestToken, err := c.Request.Cookie("recboRequestToken")
	if err != nil {
		return nil, err
	}
	return VerifyRequestToken(requestToken.Value)
}

func CreateUnverifiedEmailToken(email string) (string, error) {
	return createEmailToken(email, "unverified_email")
}

func CreateSignUpToken(email string) (string, error) {
	return createEmailToken(email, "verified_email")
}

func VerifyTokenAuthenticity(c *gin.Context) bool {
	token := c.GetHeader("auth-token")

	_, err := VerifyAuthToken(token, "request")
	if err != nil {
		c.IndentedJSON(http.StatusForbidden, gin.H{"message": "auth token invalid"})
		return false
	}
	return true
}

func RetrieveRequestTokenClaims(c *gin.Context) (jwt.MapClaims, error) {
	cookies := c.Request.Cookies()
	var requestToken string
	for _, c := range cookies {
		fmt.Println("cookie", *c)
		if c.Name == "recbo-request-token" {
			requestToken = c.Value
			break
		}
	}
	if len(requestToken) == 0 {
		return nil, errors.New("must provide valid request token")
	}

	claims, err := VerifyRequestToken(requestToken)
	if err != nil {
		return nil, err
	}

	return claims, nil
}

func PasswordsMatch(pw1, pw2 string) (bool, error) {
	return false, nil
}

func createEmailToken(email, tokenType string) (string, error) {
	// Form JWT claims for both tokens
	timeNow := time.Now().Unix()
	jti := uuid.NewString()

	standard := jwt.StandardClaims{
		Issuer:    "recbo.co",
		Subject:   email,
		Audience:  "recbo.co",
		IssuedAt:  timeNow,
		ExpiresAt: timeNow + EMAIL_TOKEN_LIFESPAN,
		NotBefore: timeNow,
		Id:        jti,
	}

	claims := EmailTokenClaims{
		email,
		tokenType,
		standard,
	}
	// Encode payload and header
	emailToken := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := emailToken.SignedString(signKey)

	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func RefreshCredentials(refreshToken string) (resp *http.Response, err error) {
	fmt.Println("validating refresh", refreshToken)
	return http.Get("http://authservice:8120/refresh?token=" + refreshToken)
}

func fatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

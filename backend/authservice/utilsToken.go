package main

import (
	"crypto/rsa"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

const (
	PRIVATE_KEY_PATH       = "./private.pem" // openssl genrsa -out app.rsa keysize
	PUBLIC_KEY_PATH        = "./public.pem"  // openssl rsa -in app.rsa -pubout > app.rsa.pub
	RSA_PW                 = "JW0921recbo"   // rsa private key pem pw
	REQUEST_TOKEN_LIFESPAN = 30              // lifespan of basic request token in seconds (1 hour)
	REFRESH_TOKEN_LIFESPAN = 172800          // lifespan of basic refresh token in seconds (2 days)
	EMAIL_TOKEN_LIFESPAN   = 3600            // lifespan of email token in seconds (1 hour)
)

type EmailTokenClaims struct {
	EmailKey  string `json:"emailKey"`
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
func AwardAuthCredentials(authInfo UserAuthInfo, refreshKey string) (AuthCredentials, error) {
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
	var creds AuthCredentials
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

func CreateSignUpToken(emailKey string) (string, error) {
	// Form JWT claims for both tokens
	timeNow := time.Now().Unix()
	jti := uuid.NewString()

	standard := jwt.StandardClaims{
		Issuer:    "recbo.co",
		Subject:   emailKey,
		Audience:  "recbo.co",
		IssuedAt:  timeNow,
		ExpiresAt: timeNow + EMAIL_TOKEN_LIFESPAN,
		NotBefore: timeNow,
		Id:        jti,
	}

	claims := EmailTokenClaims{
		emailKey,
		"sign_up",
		standard,
	}
	// Encode payload and header
	signUpToken := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := signUpToken.SignedString(signKey)

	if err != nil {
		return "", err
	}
	return tokenString, nil
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
func VerifySignUpToken(tokenString string) (jwt.MapClaims, error) {
	return VerifyAuthToken(tokenString, "sign_up")
}

func HashAndSaltPW(pwd string) string {
	// Use GenerateFromPassword to hash & salt pwd
	// MinCost is just an integer constant provided by the bcrypt
	// package along with DefaultCost & MaxCost.
	// The cost can be any value you want provided it isn't lower
	// than the MinCost (4)
	hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	// GenerateFromPassword returns a byte slice so we need to
	// convert the bytes to a string and return it
	return string(hash)
}

func PasswordsMatch(hashedPwd string, plainPwd string) bool {
	// Since we'll be getting the hashed password from the DB it
	// will be a string so we'll need to convert it to a byte slice
	byteHash, bytePlain := []byte(hashedPwd), []byte(plainPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, bytePlain)
	if err != nil {
		log.Println(err)
		return false
	}

	return true
}

func fatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

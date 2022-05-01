package main

import (
	"errors"
	"fmt"
	"time"

	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)

const (
	USER_CREDENTIALS_COLLECTION     = "user_credentials"
	UNVERIFIED_EMAIL_KEY_COLLECTION = "unverified_email_keys"
	TYPESENSE_SERVER_URL            = "http://usercredentials:8108"
	TYPESENSE_API_KEY               = "banana"
)

type RecipeMetadataDocument struct {
	RecipeID       string `json:"id"`
	RecipeName     string `json:"recipeName"`
	AuthorUsername string `json:"authorUsername"`
}

type UserProfileDocument struct {
	Username string `json:"username"`
}

var client *typesense.Client

func ConfigureTypeSense() {
	// TO DO
	// key := os.Getenv("TYPESENSE_API_KEY")
	client = typesense.NewClient(
		typesense.WithServer(TYPESENSE_SERVER_URL),
		typesense.WithAPIKey(TYPESENSE_API_KEY),
	)
	// go BuildForAuthService()
}

func BuildForAuthService() {
	for {
		fmt.Println("BUILD EFFORT")
		_, err := NewUserCredentialsCollection()
		if err != nil {
			fmt.Println(err.Error())
			time.Sleep(5 * time.Second)
			continue
		}
		_, err = NewEmailKeyCollection()
		if err != nil {
			fmt.Println(err.Error())
			time.Sleep(5 * time.Second)
			continue
		}
		break
	}
}

func NewUserCredentialsCollection() (*api.CollectionResponse, error) {
	client.Collection(USER_CREDENTIALS_COLLECTION).Delete()
	emailIsFacet := true
	credentialsSchema := &api.CollectionSchema{
		Name: USER_CREDENTIALS_COLLECTION,
		Fields: []api.Field{
			{
				Name:  "email",
				Type:  "string",
				Facet: &emailIsFacet,
			},
			{
				Name: "password",
				Type: "string",
			},
			{
				Name: "refreshKey",
				Type: "string",
			},
		},
	}

	return client.Collections().Create(credentialsSchema)
}

func NewEmailKeyCollection() (*api.CollectionResponse, error) {
	client.Collection(UNVERIFIED_EMAIL_KEY_COLLECTION).Delete()
	keyIsFacet := true
	emailSchema := &api.CollectionSchema{
		Name: UNVERIFIED_EMAIL_KEY_COLLECTION,
		Fields: []api.Field{
			{
				Name:  "emailKey",
				Type:  "string",
				Facet: &keyIsFacet,
			},
			{
				Name: "emailCount",
				Type: "int32",
			},
		},
	}

	res, err := client.Collections().Create(emailSchema)
	fmt.Println(res, err)
	return res, err
}

func AddUserCredentials(email, username, password, refreshKey string) (map[string]interface{}, error) {
	document := UserCredentialDocument{
		email,
		username,
		HashAndSaltPW(password),
		refreshKey,
	}
	return client.Collection(USER_CREDENTIALS_COLLECTION).Documents().Create(document)
}

func UpdateUserCredentials(email, username, password, refreshKey string) (map[string]interface{}, error) {
	document := UserCredentialDocument{
		email,
		username,
		HashAndSaltPW(password),
		refreshKey,
	}
	return client.Collection(USER_CREDENTIALS_COLLECTION).Document(username).Update(document)
}

func RetrieveRefreshKey(username string) (string, error) {
	// Retrieve refresh key from data store
	creds, err := GetUserCredentialsByUsername(username)
	if err != nil {
		return "", err
	}
	refreshKey := interfaceToString(creds["refreshKey"])
	return refreshKey, nil
}

func GetUserCredentialsByUsername(username string) (map[string]interface{}, error) {
	return client.Collection(USER_CREDENTIALS_COLLECTION).Document(username).Retrieve()
}

func GetUserCredentialsByEmail(email string) (map[string]interface{}, error) {
	exhaustive, prioritizeExact := true, true
	groupBy := "email"
	groupLimit := 1
	searchParameters := &api.SearchCollectionParams{
		Q:                    email,
		QueryBy:              "email",
		ExhaustiveSearch:     &exhaustive,
		PrioritizeExactMatch: &prioritizeExact,
		GroupBy:              &groupBy,
		GroupLimit:           &groupLimit,
	}

	resp, err := client.Collection(USER_CREDENTIALS_COLLECTION).Documents().Search(searchParameters)

	if err != nil {
		fmt.Println("query err", err)
		return nil, err
	}

	if len(*resp.GroupedHits) == 0 || len((*resp.GroupedHits)[0].Hits) == 0 {
		return nil, errors.New("user not found")
	}

	return *((*resp.GroupedHits)[0].Hits[0].Document), nil
}

func AddUnverifiedEmailKey(email, emailKey string) (map[string]interface{}, error) {
	fmt.Println("ADDING EMAIL KEY")
	document := UnverifiedEmailKeyDocument{
		email,
		emailKey,
		0,
	}
	return client.Collection(UNVERIFIED_EMAIL_KEY_COLLECTION).Documents().Create(document)
}

func AddToUnverifiedEmailCount(email string) (map[string]interface{}, error) {
	fmt.Println("ADDING TO EMAIL COUNT")
	doc, err := GetUnverifiedEmailKey(email)
	if err != nil {
		return nil, err
	}
	nextCount := doc["emailCount"].(int64) + 1

	document := UnverifiedEmailKeyDocument{
		email,
		interfaceToString(doc["emailKey"]),
		int8(nextCount),
	}
	return client.Collection(UNVERIFIED_EMAIL_KEY_COLLECTION).Document(email).Update(document)
}

func GetUnverifiedEmailKey(email string) (map[string]interface{}, error) {
	return client.Collection(UNVERIFIED_EMAIL_KEY_COLLECTION).Document(email).Retrieve()
}

func GetUnverifiedEmailUsingKey(emailKey string) (map[string]interface{}, error) {
	exhaustive, prioritizeExact := true, true
	groupBy := "emailKey"
	groupLimit := 1
	searchParameters := &api.SearchCollectionParams{
		Q:                    emailKey,
		QueryBy:              "emailKey",
		ExhaustiveSearch:     &exhaustive,
		PrioritizeExactMatch: &prioritizeExact,
		GroupBy:              &groupBy,
		GroupLimit:           &groupLimit,
	}

	resp, err := client.Collection(UNVERIFIED_EMAIL_KEY_COLLECTION).Documents().Search(searchParameters)

	if err != nil {
		fmt.Println("query err", err)
		return nil, err
	}

	hits := resp.GroupedHits

	fmt.Println("HITS")
	for _, h := range *hits {
		fmt.Println(h.Hits)
	}

	if len(*resp.GroupedHits) == 0 || len((*resp.GroupedHits)[0].Hits) == 0 {
		return nil, errors.New("user not found")
	}

	return *((*resp.GroupedHits)[0].Hits[0].Document), nil
}

func viewCollections() ([]*api.CollectionResponse, error) {
	return client.Collections().Retrieve()
}

func interfaceToString(val interface{}) string {
	return fmt.Sprintf("%v", val)
}

func testTypeSense() {
	// CreateCollection()
	// ListCollections()
	// CreateDocument()
	// SearchCollection()
	// BuildCollections()
	// clearCollections()
	// BuildCollectionsFromDummyData()
	// fmt.Println(QueryRecipeByName("chicken"))
	//QueryRecipeByName("rice")
	// col, _ := viewCollections()

	// fmt.Println("COLLECTIONS", col)
	// for _, c := range col {
	// 	fmt.Println(c.Name, c.Fields)
	// }
	// fmt.Println()
	// results, _ := GetRecipesByID([]string{"2", "4", "0", "7", "20"})
	// fmt.Println(results)
	// resp, err := client.Collection(RECIPE_METADATA_COLLECTION).Retrieve()
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// fmt.Println(resp.Fields)
	// fmt.Println(resp, err, resp.NumDocuments)
}

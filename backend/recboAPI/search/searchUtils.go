package search

import (
	"fmt"
	"recbo/backend/recboAPI/awsutils"
	"recbo/backend/recboAPI/dummydata"
	"recbo/backend/recboAPI/rbtypes"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)

const (
	RECIPE_METADATA_COLLECTION = "recipe_metadata"
	USER_PROFILES_COLLECTION   = "user_profiles"
	TYPESENSE_SERVER_URL       = "http://recipesearch:8108"
	TYPESENSE_API_KEY          = "banana"
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

	BuildCollectionsFromDummyData()
}

func CreateRecipeMetadataDocumentsFromAWS(recipeData []map[string]*dynamodb.AttributeValue) {
	for _, r := range recipeData {
		document := struct {
			RecipeID       string `json:"recipeID"`
			RecipeName     string `json:"recipeName"`
			AuthorUsername string `json:"authorUsername"`
		}{
			RecipeID:       *r["recipeID"].S,
			RecipeName:     *r["recipeName"].S,
			AuthorUsername: *r["authorUsername"].S,
		}

		res, err := client.Collection(RECIPE_METADATA_COLLECTION).Documents().Create(document)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(res)
	}
}

func CreateUserProfileDocumentsFromAWS(profileData []map[string]*dynamodb.AttributeValue) {
	for _, p := range profileData {
		document := struct {
			Username string `json:"username"`
		}{
			Username: *p["username"].S,
		}

		res, err := client.Collection(USER_PROFILES_COLLECTION).Documents().Create(document)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(res)
	}
}

func CreateRecipeMetadataDocumentsFromDummyData(recipeData map[string]rbtypes.Recipe) error {
	for _, recipe := range recipeData {
		document := struct {
			RecipeID       string `json:"id"`
			RecipeName     string `json:"recipeName"`
			AuthorUsername string `json:"authorUsername"`
		}{
			RecipeID:       recipe.ID,
			RecipeName:     recipe.MetaInfo.Name,
			AuthorUsername: recipe.MetaInfo.Author.Username,
		}

		res, err := client.Collection(RECIPE_METADATA_COLLECTION).Documents().Create(document)
		if err != nil {
			return err
			fmt.Println(err)
		}
		fmt.Println(res)
	}
	return nil
}

func CreateUserProfileDocumentsFromDummyData(profileData map[string]rbtypes.UserLoginInfo) error {
	for _, p := range profileData {
		document := UserProfileDocument{
			Username: p.Username,
		}

		res, err := client.Collection(USER_PROFILES_COLLECTION).Documents().Create(document)
		if err != nil {
			return err
			fmt.Println(err)
		}
		fmt.Println(res)
	}
	return nil
}

func CreateRecipeMetadataCollection() (*api.CollectionResponse, error) {
	metadataSchema := &api.CollectionSchema{
		Name: RECIPE_METADATA_COLLECTION,
		Fields: []api.Field{
			{
				Name: "id",
				Type: "string",
			},
			{
				Name: "recipeName",
				Type: "string",
			},
			{
				Name: "authorUsername",
				Type: "string",
			},
		},
	}

	return client.Collections().Create(metadataSchema)
}

func CreateUserProfileCollection() (*api.CollectionResponse, error) {
	profileSchema := &api.CollectionSchema{
		Name: USER_PROFILES_COLLECTION,
		Fields: []api.Field{
			{
				Name: "username",
				Type: "string",
			},
		},
	}

	return client.Collections().Create(profileSchema)
}

func BuildCollectionsFromAWS() {
	profileOut, err := awsutils.GetAllUserProfiles()

	if err != nil {
		fmt.Println(err)
		return
	}

	profileData := profileOut.Items

	fmt.Println("retrieved data")

	clearCollections()

	CreateUserProfileCollection()
	fmt.Println("created collections")

	CreateUserProfileDocumentsFromAWS(profileData)

}

func BuildCollectionsFromDummyData() error {

	recipeMap := dummydata.RecipeMap
	profileMap := dummydata.RegisteredUserMap

	clearCollections()

	_, err1 := CreateRecipeMetadataCollection()
	_, err2 := CreateUserProfileCollection()
	fmt.Println("created collections")
	if err1 != nil {
		return err1
	}
	if err2 != nil {
		return err2
	}

	err3 := CreateRecipeMetadataDocumentsFromDummyData(recipeMap)
	if err3 != nil {
		return err3
	}
	return CreateUserProfileDocumentsFromDummyData(profileMap)

}

func AddRecipe(recipe *rbtypes.PutRecipeAPIInput) (map[string]interface{}, error) {
	document := RecipeMetadataDocument{
		RecipeID:       recipe.RecipeID,
		RecipeName:     recipe.Metadata.Name,
		AuthorUsername: recipe.Metadata.Author,
	}

	res, err := client.Collection(RECIPE_METADATA_COLLECTION).Documents().Create(document)
	if err != nil {
		return nil, err
	}
	fmt.Println(res)
	return res, nil
}

func GetRecipeByID(recipeID string) (map[string]interface{}, error) {
	return client.Collection(RECIPE_METADATA_COLLECTION).Document(recipeID).Retrieve()
}

func GetRecipesByID(recipeIDs []string) ([]map[string]interface{}, error) {

	n := len(recipeIDs)
	k := 0
	limit, lCnt := 4, 0 // limit concurrent requests
	docInfo, results := make(chan map[string]interface{}), make([]map[string]interface{}, n)

	for i := 0; i < n; i++ {
		if lCnt == limit {
			results[k] = <-docInfo
			k++
			lCnt--
		}

		lCnt++

		go func(j int) {
			resp, err := GetRecipeByID(recipeIDs[j])
			if err == nil {
				docInfo <- resp
			} else {
				docInfo <- map[string]interface{}{"error": err}
			}
		}(i)
	}

	for ; k < n; k++ {
		results[k] = <-docInfo
	}

	return results, nil
}

func UpdateRecipe(recipe *rbtypes.UpdateRecipeAPIInput) (map[string]interface{}, error) {
	updatedRecipe := RecipeMetadataDocument{recipe.RecipeID, recipe.Metadata.Name, recipe.Metadata.Author}
	return client.Collection(RECIPE_METADATA_COLLECTION).Document(recipe.RecipeID).Update(updatedRecipe)
}

func DeleteRecipe(recipeID string) (map[string]interface{}, error) {
	return client.Collection(RECIPE_METADATA_COLLECTION).Document(recipeID).Delete()
}

func QueryRecipe(search, by string) (*api.SearchResult, error) {
	exhaustive := true
	searchParameters := &api.SearchCollectionParams{
		Q:                search,
		QueryBy:          by,
		ExhaustiveSearch: &exhaustive,
	}

	resp, err := client.Collection(RECIPE_METADATA_COLLECTION).Documents().Search(searchParameters)

	if err != nil {
		fmt.Println("query err", err)
		return nil, err
	}

	hits := resp.Hits

	fmt.Println("HITS")
	for _, h := range *hits {
		fmt.Println(h.Document)
	}

	return resp, nil
}

func QueryRecipeByName(search string) (*api.SearchResult, error) {
	return QueryRecipe(search, "recipeName")
}

func QueryRecipeByAuthor(search string) (*api.SearchResult, error) {
	return QueryRecipe(search, "authorUsername")
}

func clearCollections() {
	client.Collection(USER_PROFILES_COLLECTION).Delete()
}

func TestTypeSense() {
	// CreateCollection()
	// ListCollections()
	// CreateDocument()
	// SearchCollection()
	// BuildCollections()
	// clearCollections()
	//BuildCollectionsFromDummyData()
	//QueryRecipeByName("chicken")
	//QueryRecipeByName("rice")

	fmt.Println()
	results, _ := GetRecipesByID([]string{"2", "4", "0", "7", "20"})
	fmt.Println(results)
	// resp, err := client.Collection(RECIPE_METADATA_COLLECTION).Retrieve()
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// fmt.Println(resp.Fields)
	// fmt.Println(resp, err, resp.NumDocuments)
}

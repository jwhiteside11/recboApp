package awsutils

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"recbo/backend/recboAPI/rbtypes"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
)

const (
	DEMO_BUCKET         = "recbo-demo-data"          // Bucket
	RECIPE_IMAGE_BUCKET = "recbo-recipe-images-demo" // Bucket
	RECIPE_JSON_BUCKET  = "recbo-recipes-demo"       // Bucket
)

func TestS3() {
	// AddImageToBucket()
	GetImageFile("recipe_img_b26c6ef8-6f48-4b26-b2c5-46ef0a846f44.png")
	// AddTextFileToBucket("test body", "test1234.txt")
	// GetRecipe()
	// demoRecipe := dummydata.RecipeDemoMap["1"]
	// recipe, err := AddRecipe(&demoRecipe)
	// if err != nil {
	// 	fmt.Println(err)
	// 	return
	// }
	// fmt.Println("success!")
	// fmt.Println(recipe.ID, recipe.MetaInfo, recipe.Instructions)
}

func AddTextFileToBucket(textBody, fileKey string) {
	input := &s3.PutObjectInput{
		Body:   bytes.NewReader([]byte(textBody)),
		Bucket: aws.String(DEMO_BUCKET),
		Key:    aws.String(fileKey),
	}
	AddFileToBucket(input)
}

func AddImageToBucket() {
	// load image
	pwd, _ := os.Getwd()
	fmt.Println(pwd)
	file, err := os.Open(pwd + "/android-chrome-192x192.png")
	if err != nil {
		// handle error
		fmt.Println("error loading image")
		return
	}

	defer file.Close()
	fileInfo, _ := file.Stat()
	var size int64 = fileInfo.Size()

	if size == 0 {
		fmt.Println("image not loaded")
	}
	buffer := make([]byte, size)
	file.Read(buffer)
	fileBytes := bytes.NewReader(buffer)
	fileType := http.DetectContentType(buffer)
	fileExtension := strings.Split(fileInfo.Name(), ".")[1]

	imageID := uuid.New()
	imageKey := fmt.Sprintf("recipe_img_%s.%s", imageID.String(), fileExtension)
	input := &s3.PutObjectInput{
		Bucket:        aws.String(RECIPE_IMAGE_BUCKET),
		Key:           aws.String(imageKey),
		Body:          fileBytes,
		ContentLength: aws.Int64(size),
		ContentType:   aws.String(fileType),
	}
	fmt.Println(imageKey, fileType)

	AddFileToBucket(input)
}

func AddFileToBucket(input *s3.PutObjectInput) error {

	result, err := s3Service.PutObject(input)

	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			default:
				fmt.Println(aerr.Error())
			}
		} else {
			// Print the error, cast err to awserr.Error to get the Code and
			// Message from an error.
			fmt.Println(err.Error())
		}
		return throwDBError("")
	}

	fmt.Println(result)
	return nil
}

func SelectFromBucket(fileName, query string) string {
	jsonType := "LINES"
	// Make the Select Object Content API request using the object uploaded.
	resp, err := s3Service.SelectObjectContent(&s3.SelectObjectContentInput{
		Bucket:         aws.String(DEMO_BUCKET),
		Key:            aws.String(fileName),
		Expression:     aws.String(query),
		ExpressionType: aws.String(s3.ExpressionTypeSql),
		InputSerialization: &s3.InputSerialization{
			JSON: &s3.JSONInput{Type: &jsonType},
		},
		OutputSerialization: &s3.OutputSerialization{
			JSON: &s3.JSONOutput{},
		},
	})
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed making API request, %v\n", err)
		return ""
	}
	defer resp.EventStream.Close()

	results, resultWriter := io.Pipe()

	go func() {
		defer resultWriter.Close()

		for event := range resp.EventStream.Events() {
			switch e := event.(type) {
			case *s3.RecordsEvent:
				resultWriter.Write(e.Payload)
			case *s3.StatsEvent:
				fmt.Printf("Processed %d bytes\n", *e.Details.BytesProcessed)
			}
		}
	}()

	// Creating a buffer
	buffer := new(bytes.Buffer)

	// Calling ReadFrom method and writing
	// data into buffer
	buffer.ReadFrom(results)

	finalRes := buffer.String()

	fmt.Println("RESULT", finalRes)

	if err := resp.EventStream.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "reading from event stream failed, %v\n", err)
	}

	return finalRes
}

func GetFromBucket(bucketName, fileName string) string {
	// Make the Select Object Content API request using the object uploaded.
	resp, err := s3Service.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(fileName),
	})

	if err != nil {
		fmt.Fprintf(os.Stderr, "failed making API request, %v\n", err)
		return ""
	}
	defer resp.Body.Close()

	blob := make([]byte, *resp.ContentLength)
	resp.Body.Read(blob)

	fmt.Println("RESULT", blob)
	return string(blob)
}

func GetImageFile(fileKey string) {
	input := &s3.GetObjectInput{
		Bucket: aws.String(RECIPE_IMAGE_BUCKET),
		Key:    aws.String(fileKey),
	}

	result, err := s3Service.GetObject(input)
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case s3.ErrCodeNoSuchKey:
				fmt.Println(s3.ErrCodeNoSuchKey, aerr.Error())
			case s3.ErrCodeInvalidObjectState:
				fmt.Println(s3.ErrCodeInvalidObjectState, aerr.Error())
			default:
				fmt.Println(aerr.Error())
			}
		} else {
			// Print the error, cast err to awserr.Error to get the Code and
			// Message from an error.
			fmt.Println(err.Error())
		}
		return
	}

	fmt.Println(result)

	pwd, _ := os.Getwd()
	fmt.Println(pwd)
	file, _ := os.Create(fmt.Sprintf("%s/%s", pwd, fileKey))
	io.Copy(file, result.Body)
	defer file.Close()
}

func PutRecipeInBucket(recipe *rbtypes.UpdateRecipeAPIInput) (*rbtypes.UpdateRecipeAPIInput, error) {
	fileKey := fmt.Sprintf("recipe_%s.json", recipe.RecipeID)

	data, err := json.Marshal(recipe)

	if err != nil {
		return nil, err
	}

	input := &s3.PutObjectInput{
		Body:   bytes.NewReader(data),
		Bucket: aws.String(RECIPE_JSON_BUCKET),
		Key:    aws.String(fileKey),
	}

	err = AddFileToBucket(input)

	if err != nil {
		return nil, err
	}
	return recipe, nil

}

func AddRecipe(recipe *rbtypes.PutRecipeAPIInput) (*rbtypes.UpdateRecipeAPIInput, error) {
	recipeID := recipe.RecipeID
	if len(recipeID) == 0 {
		recipeID = uuid.New().String()
	}
	newRecipe := rbtypes.UpdateRecipeAPIInput{
		recipeID,
		recipe.RecipeAPIInput,
	}
	return PutRecipeInBucket(&newRecipe)
}

func UpdateRecipe(recipe *rbtypes.UpdateRecipeAPIInput) (*rbtypes.UpdateRecipeAPIInput, error) {
	return PutRecipeInBucket(recipe)
}

func GetRecipe(recipeID string) (*rbtypes.GetRecipeAPIInput, error) {
	if len(recipeID) == 0 {
		return nil, errors.New("recipeID must be included")
	}

	fileName := fmt.Sprintf("recipe_%s.json", recipeID)
	response := GetFromBucket(RECIPE_JSON_BUCKET, fileName)

	var retrievedRecipe rbtypes.GetRecipeAPIInput

	if err := json.Unmarshal([]byte(response), &retrievedRecipe); err != nil {
		return nil, errors.New("error decoding recipe string")
	}

	return &retrievedRecipe, nil
}

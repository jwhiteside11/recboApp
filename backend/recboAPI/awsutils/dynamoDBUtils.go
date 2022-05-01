package awsutils

import (
	"errors"
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
)

const (
	RECIPE_METADATA_TABLE     = "recbo_recipe_metadata"
	USER_CREDENTIALS_TABLE_UN = "recbo_user_credentials_un"
	USER_PROFILE_TABLE_UN     = "recbo_user_profiles_un"
)

func NewUser(email, username, password, re string) error {
	// check for email in db
	res, err := GetUserProfile(username)
	if err != nil {
		return err
	}
	if len(res) > 0 {
		return errors.New("email already belongs to an account")
	}

	err = NewUserProfile(username)
	if err != nil {
		return err
	}

	return nil
}

func NewUserProfile(username string) error {
	input := &dynamodb.PutItemInput{
		ConditionExpression:    aws.String("attribute_not_exists(username)"),
		Item:                   formUserProfile(username),
		ReturnConsumedCapacity: aws.String("TOTAL"),
		TableName:              aws.String(USER_PROFILE_TABLE_UN),
	}

	result, err := dbService.PutItem(input)
	if err != nil {
		catchDBError(err)
		return err
	}

	fmt.Println(result)
	return nil
}

func UpdateUserTableString(username, tableName, attributeName, newValue string) error {
	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":x": {
				S: aws.String(newValue),
			},
		},
		Key: map[string]*dynamodb.AttributeValue{
			"username": {
				S: aws.String(username),
			},
		},
		ReturnValues:        aws.String("UPDATED_NEW"),
		TableName:           aws.String(tableName),
		UpdateExpression:    aws.String(fmt.Sprintf("SET %s :x", attributeName)),
		ConditionExpression: aws.String("attribute_exists(username)"),
	}

	result, err := dbService.UpdateItem(input)
	if err != nil {
		catchDBError(err)
		return err
	}

	fmt.Println(result)
	return nil
}

func UpdateUserProfileString(username, attributeName, newValue string) error {
	editOptions := map[string]bool{"profilePictureID": true, "email": true}
	if _, found := editOptions[attributeName]; !found {
		return throwDBError("attribute name not updatable")
	}

	UpdateUserTableString(username, USER_PROFILE_TABLE_UN, attributeName, newValue)
	return nil
}

func UpdateUserProfileSet(action, username, attributeName string, changes []string) error {
	if action != "ADD" && action != "DELETE" {
		return throwDBError("action not recognized")
	}

	editOptions := map[string]bool{"allergies": true, "recipes": true, "bookmarks": true}
	if _, found := editOptions[attributeName]; !found {
		return throwDBError("attribute name not updatable")
	}

	ss := make([]*string, 0)
	for _, c := range changes {
		ss = append(ss, aws.String(c))
	}

	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":x": {
				SS: ss,
			},
		},
		Key: map[string]*dynamodb.AttributeValue{
			"username": {
				S: aws.String(username),
			},
		},
		ReturnValues:        aws.String("UPDATED_NEW"),
		TableName:           aws.String(USER_PROFILE_TABLE_UN),
		UpdateExpression:    aws.String(fmt.Sprintf("%s %s :x", action, attributeName)),
		ConditionExpression: aws.String("attribute_exists(username)"),
	}

	result, err := dbService.UpdateItem(input)
	if err != nil {
		catchDBError(err)
		return err
	}

	fmt.Println(result)
	return nil
}

func GetItemFromUserTable(tableName, username string) (*dynamodb.QueryOutput, error) {
	key := expression.KeyEqual(expression.Key("username"), expression.Value(username))
	expr, err := expression.NewBuilder().WithKeyCondition(key).Build()
	if err != nil {
		return nil, err
	}
	input := &dynamodb.QueryInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		KeyConditionExpression:    expr.KeyCondition(),
		TableName:                 aws.String(tableName),
	}
	result, err := dbService.Query(input)
	if err != nil {
		catchDBError(err)
		return nil, err
	}

	fmt.Println(result)
	return result, nil
}

func ScanItemFromUserTable(tableName, keyName, keyValue string) (*dynamodb.ScanOutput, error) {
	filter := expression.Equal(expression.Name(keyName), expression.Value(keyValue))
	expr, err := expression.NewBuilder().WithFilter(filter).Build()
	if err != nil {
		return nil, err
	}
	input := &dynamodb.ScanInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		FilterExpression:          expr.Filter(),
		TableName:                 aws.String(tableName),
	}
	result, err := dbService.Scan(input)
	if err != nil {
		catchDBError(err)
		return nil, err
	}

	fmt.Println(result)
	return result, nil
}

func GetAllFromTable(tableName string) (*dynamodb.ScanOutput, error) {
	input := &dynamodb.ScanInput{
		TableName: aws.String(tableName),
	}
	result, err := dbService.Scan(input)
	if err != nil {
		catchDBError(err)
		return nil, err
	}

	fmt.Println(result)
	return result, nil
}

func GetAllUserProfiles() (*dynamodb.ScanOutput, error) {
	return GetAllFromTable(USER_PROFILE_TABLE_UN)
}

func GetUserProfile(username string) ([]map[string]*dynamodb.AttributeValue, error) {
	output, err := GetItemFromUserTable(USER_PROFILE_TABLE_UN, username)
	if err != nil {
		return nil, err
	}
	return output.Items, nil
}

func UpdateUserEmail(username, newEmail string) {
	UpdateUserProfileString(username, "email", newEmail)
}
func UpdateUserProfilePicture(username, newPictureID string) {
	UpdateUserProfileString(username, "profilePictureID", newPictureID)
}

func AddUserBookmarks(username string, recipeIDs []string) {
	UpdateUserProfileSet("bookmarks", "ADD", username, recipeIDs)
}

func RemoveUserBookmarks(username string, recipeIDs []string) {
	UpdateUserProfileSet("bookmarks", "DELETE", username, recipeIDs)
}

func AddUserRecipes(username string, recipeIDs []string) {
	UpdateUserProfileSet("recipes", "ADD", username, recipeIDs)
}

func RemoveUserRecipes(username string, recipeIDs []string) {
	UpdateUserProfileSet("recipes", "DELETE", username, recipeIDs)
}

func AddUserAllergies(username string, allergies []string) {
	UpdateUserProfileSet("allergies", "ADD", username, allergies)
}

func RemoveUserAllergies(username string, allergies []string) {
	UpdateUserProfileSet("allergies", "DELETE", username, allergies)
}

// Utils

func TestDynamoDB() {
	// NewUserProfile("joeshmoe@gmail.com")
	// NewUser("joeshmoe2@gmail.com", "password123")
	// AddUserBookmarks("86086d08-b21e-4df8-b55b-4ca495e7223b", []string{"0000AB"})
	// RemoveUserBookmarks("86086d08-b21e-4df8-b55b-4ca495e7223b", []string{"0000AA"})
	// AddUserAllergies("86086d08-b21e-4df8-b55b-4ca495e7223b", []string{"Peanuts", "Legumes"})
	// RemoveUserAllergies("86086d08-b21e-4df8-b55b-4ca495e7223b", []string{"Peanuts"})
	// AddUserRecipes("86086d08-b21e-4df8-b55b-4ca495e7223b", []string{"AA0005"})
}

func formUserProfile(username string) map[string]*dynamodb.AttributeValue {
	return map[string]*dynamodb.AttributeValue{
		"username": {
			S: aws.String(username),
		},
		"profilePictureID": {
			S: aws.String(""),
		},
		"allergies": {
			SS: []*string{aws.String("")},
		},
		"authoredRecipes": {
			SS: []*string{aws.String("")},
		},
		"bookmarks": {
			SS: []*string{aws.String("")},
		},
	}
}

func throwDBError(message string) error {
	err := errors.New("error encountered")
	if len(message) != 0 {
		err = errors.New(message)
	}
	fmt.Println(err)
	return err
}

func catchDBError(err error) {
	if aerr, ok := err.(awserr.Error); ok {
		switch aerr.Code() {
		case dynamodb.ErrCodeConditionalCheckFailedException:
			// Handle ConditionExpression
			fmt.Println(dynamodb.ErrCodeConditionalCheckFailedException, aerr.Error())
		case dynamodb.ErrCodeProvisionedThroughputExceededException:
			fmt.Println(dynamodb.ErrCodeProvisionedThroughputExceededException, aerr.Error())
		case dynamodb.ErrCodeResourceNotFoundException:
			fmt.Println(dynamodb.ErrCodeResourceNotFoundException, aerr.Error())
		case dynamodb.ErrCodeItemCollectionSizeLimitExceededException:
			fmt.Println(dynamodb.ErrCodeItemCollectionSizeLimitExceededException, aerr.Error())
		case dynamodb.ErrCodeTransactionConflictException:
			fmt.Println(dynamodb.ErrCodeTransactionConflictException, aerr.Error())
		case dynamodb.ErrCodeRequestLimitExceeded:
			fmt.Println(dynamodb.ErrCodeRequestLimitExceeded, aerr.Error())
		case dynamodb.ErrCodeInternalServerError:
			fmt.Println(dynamodb.ErrCodeInternalServerError, aerr.Error())
		default:
			fmt.Println(aerr.Error())
		}
	} else {
		// Print the error, cast err to awserr.Error to get the Code and
		// Message from an error.
		fmt.Println(err.Error())
	}
}

package awsutils

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/s3"
)

const (
	AWS_S3_REGION = "us-east-1" // Region
)

var dbService *dynamodb.DynamoDB
var s3Service *s3.S3

func ConfigureAWSUtils() {
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String(AWS_S3_REGION)},
	)

	// Create S3 service client
	s3Service = s3.New(sess)
	// Create DynamoDB service client
	dbService = dynamodb.New(sess)
}

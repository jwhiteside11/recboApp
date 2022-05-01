package rbtypes

type Setting struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RecipeInfoChunk struct {
	DataType string `json:"dataType"`
	Data     string `json:"data"`
}

type Allergy = Setting
type FavoriteFood = Setting

type Ingredient = RecipeInfoChunk
type Instruction = RecipeInfoChunk

type UserAuthInfo struct {
	Username     string `json:"username"`     // user identifier
	UserAuthType string `json:"userAuthType"` // user permissions
}

type UserLoginInfo struct {
	Email    string `json:"email"`    // subject to change
	Username string `json:"username"` // subject to change
	Password string `json:"password"` // subject to change
}

type UserBlip struct {
	Username    string `json:"username"`
	Image       string `json:"image"`
	DisplayName string `json:"displayName"`
}

type User struct {
	ID            string         `json:"id"`
	Email         string         `json:"email"`
	Blip          UserBlip       `json:"blip"`
	Occupation    string         `json:"occupation"`
	Allergies     []Allergy      `json:"allergies"`
	FavoriteFoods []FavoriteFood `json:"favoriteFoods"`
}

type RecipeMetaInfo struct {
	RecipeID      string   `json:"id"`
	Name          string   `json:"name"`
	Author        UserBlip `json:"author"`
	Banner        string   `json:"banner"`
	DatePublished string   `json:"datePublished"`
	TimeEstimate  string   `json:"timeEstimate"`
	Difficulty    string   `json:"difficulty"`
	CookCount     int8     `json:"cookCount"`
}

type RecipeDemoMetaInput struct {
	Name   string `json:"recipeName"`
	Author string `json:"authorUsername"`
	Banner string `json:"bannerImageID"`
}

type RecipeDemo struct {
	ID           string              `json:"recipeID"`
	MetaInfo     RecipeDemoMetaInput `json:"metadata"`
	Ingredients  []Ingredient        `json:"ingredients"`
	Instructions []Instruction       `json:"instructions"`
}

type Recipe struct {
	ID           string         `json:"id"`
	MetaInfo     RecipeMetaInfo `json:"metaInfo"`
	Images       []string       `json:"images"`
	Ingredients  []Ingredient   `json:"ingredients"`
	Instructions []Instruction  `json:"instructions"`
}

type ExampleList []string
type ExampleData [][]string

// API Inputs

type RequestValidationAPIInput struct {
	Email string `form:"email" json:"email" binding:"required,email,min=6"`
}

type SignUpAPIInput struct {
	EmailToken string `form:"token" json:"token" binding:"required"`
	Username   string `form:"username" json:"username" binding:"required,alphanum,min=4,max=30"`
	Password   string `form:"password" json:"password" binding:"required,min=8,max=20"`
}

type LoginAPIInputEmail struct {
	Email    string `form:"email" json:"email" binding:"required,email,min=6"`
	Password string `form:"password" json:"password" binding:"required,min=8,max=20"`
}

type LoginAPIInputUsername struct {
	Username string `form:"username" json:"username" binding:"required,alphanum,min=4,max=30"`
	Password string `form:"password" json:"password" binding:"required,min=8,max=20"`
}

type RefreshAPIInput struct {
	RefreshToken string `form:"refreshToken" json:"refreshToken"`
}

type GetRecipeAPIInput struct {
	RecipeID string `form:"recipeID" binding:"required,min=10,max=100"`
}

type MetadataAPIInput struct {
	Name   string `json:"recipeName" binding:"required,min=6,max=100"`
	Author string `json:"authorUsername" binding:"required,alphanum,min=3,max=30"`
	Banner string `json:"bannerImageID" binding:"max=100"`
}

type RecipeIngredientAPIInput struct {
	Data     string `form:"data" binding:"required,min=2,max=100"`
	DataType string `form:"dataType" binding:"required,min=4,max=5"`
}

type RecipeInstructionAPIInput struct {
	Data     string `form:"data" binding:"required,min=5,max=250"`
	DataType string `form:"dataType" binding:"required,alpha,min=4,max=5"`
}

type RecipeAPIInput struct {
	Metadata     MetadataAPIInput            `json:"metadata" binding:"required"`
	Ingredients  []RecipeIngredientAPIInput  `json:"ingredients" binding:"required"`
	Instructions []RecipeInstructionAPIInput `json:"instructions" binding:"required"`
}

type PutRecipeAPIInput struct {
	RecipeID string `json:"recipeID" binding:"required,len=0"`
	RecipeAPIInput
}

type UpdateRecipeAPIInput struct {
	RecipeID string `json:"recipeID" binding:"required,min=10,max=100"`
	RecipeAPIInput
}

type GetRecipeMetadataIDAPIInput struct {
	RecipeIDs []string `json:"recipeIDs" binding:"required,min=1,max=10"`
}

type GetRecipeMetadataAuthorAPIInput struct {
	AuthorUsername string `json:"authorUsername" binding:"required,alphanum,min=4,max=30"`
}

type SearchAPIInput struct {
	For    string `json:"for" binding:"required,alpha,min=10,max=30"`
	Search string `json:"search" binding:"required,min=1,max=30"`
}

type SearchRecipeDataOutput struct {
	RecipeID       string `json:"recipeID"`
	Name           string `json:"recipeName"`
	AuthorUsername string `json:"authorUsername"`
}

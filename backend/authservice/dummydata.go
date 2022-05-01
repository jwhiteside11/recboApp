package main

import (
	"strconv"
)

func exampleRecipeInfo(dataType string, data string) RecipeInfoChunk {
	return RecipeInfoChunk{
		DataType: dataType,
		Data:     data,
	}
}

func ingredientList(listData ExampleData, recipeID string) []Ingredient {
	list := make([]Ingredient, len(listData))
	for i, data := range listData {
		list[i] = exampleRecipeInfo(data[1], data[0])
	}
	return list
}

func instructionList(listData ExampleData, recipeID string) []Instruction {
	list := make([]Instruction, len(listData))
	for i, data := range listData {
		list[i] = exampleRecipeInfo(data[1], data[0])
	}
	return list
}

func exampleRecipe(name string, i int) Recipe {
	user := UserJDWblip
	recipeID := strconv.Itoa(i)
	images := make([]string, 0)
	ingredients := ingredientList(exampleIngredientData, recipeID)
	instructions := instructionList(exampleInstructionData, recipeID)
	meta := RecipeMetaInfo{
		RecipeID:      recipeID,
		Name:          name,
		Author:        user,
		Banner:        "",
		DatePublished: "Oct 09, 2021",
		TimeEstimate:  "2hr 40min",
		Difficulty:    "med",
		CookCount:     101,
	}
	return Recipe{
		ID:           recipeID,
		MetaInfo:     meta,
		Images:       images,
		Ingredients:  ingredients,
		Instructions: instructions,
	}
}

func exampleDemoRecipe(name string, i int) RecipeDemo {
	user := UserJDWblip
	recipeID := strconv.Itoa(i)
	ingredients := ingredientList(exampleIngredientData, recipeID)
	instructions := instructionList(exampleInstructionData, recipeID)
	meta := RecipeDemoMetaInput{
		Name:   name,
		Author: user.Username,
		Banner: "",
	}

	return RecipeDemo{
		ID:           recipeID,
		MetaInfo:     meta,
		Ingredients:  ingredients,
		Instructions: instructions,
	}
}

var exampleIngredientData ExampleData = ExampleData{
	{"Fried Chicken", "title"},
	{"400g chicken breast", "listItem"},
	{"15g soy sauce", "listItem"},
	{"100g all-purpose flour", "listItem"},
	{"100g cornstarch", "listItem"},
	{"5g salt", "listItem"},
	{"White pepper, to taste", "listItem"},
	{"1 liter peanut/vegetable oil", "listItem"},
	{"Sauce", "title"},
	{"75g white sugar", "listItem"},
	{"15g soy sauce", "listItem"},
	{"10g cornstarch", "listItem"},
	{"30g rice vinegar", "listItem"},
	{"Fried Rice", "title"},
}

var exampleInstructionData ExampleData = ExampleData{
	{"Preheat the peanut oil for in a heavy, deep pot, appropriate for deep-frying.", "step"},
	{"Cut chicken breast into 1” chunks, then add to medium bowl with soy sauce, salt, and white pepper. Let sit for 20 min.", "step"},
	{"Stir the flour and cornstarch into the chicken, and then deep fry in batches, being sure not to overcrowd the pot.", "step"},
	{"In a medium saucepan over medium heat, combine all sauce ingredients except the cornstarch and 2 Tbsp water. Bring to a simmer.", "step"},
	{"Combine corn starch and remaining water, stir until well mixed. Add mixture to saucepan and heat while stirring until thick.", "step"},
	{"Turn the fry oil up to medium heat, and wait for the oil to come up to 375ºF. When at temperature, fry the chicken in batches, about 30 seconds each, or until golden brown.", "step"},
	{"Drain oil from chicken for 30 seconds, then add the chicken to the pan to combine with the sauce. Stir well until combined.", "step"},
	{"Garnish with sesame seeds or chopped chives. Serve over rice immediately.", "step"},
	{"Preheat the peanut oil for in a heavy, deep pot, appropriate for deep-frying.", "step"},
	{"Cut chicken breast into 1” chunks, then add to medium bowl with soy sauce, salt, and white pepper. Let sit for 20 min.", "step"},
	{"Stir the flour and cornstarch into the chicken, and then deep fry in batches, being sure not to overcrowd the pot.", "step"},
	{"In a medium saucepan over medium heat, combine all sauce ingredients except the cornstarch and 2 Tbsp water. Bring to a simmer.", "step"},
	{"Combine corn starch and remaining water, stir until well mixed. Add mixture to saucepan and heat while stirring until thick.", "listItem"},
	{"Turn the fry oil up to medium heat, and wait for the oil to come up to 375ºF. When at temperature, fry the chicken in batches, about 30 seconds each, or until golden brown.", "step"},
	{"Drain oil from chicken for 30 seconds, then add the chicken to the pan to combine with the sauce. Stir well until combined.", "step"},
	{"Garnish with sesame seeds or chopped chives. Serve over rice immediately.", "step"},
}

var UserJDWblip = UserBlip{
	Image:       "",
	DisplayName: "John Whiteside",
	Username:    "jwhiteside11",
}

var UserJDWlogin = UserLoginInfo{
	Email:    "jwhiteside11@yahoo.com",
	Username: "jwhiteside11",
	Password: "password123",
}

var RegisteredUserMap = map[string]UserLoginInfo{
	"0": UserJDWlogin,
}

var VerifiedUserLoginMap = map[string]UserLoginInfo{}

var VerifiedUserMap = map[string]User{
	"0": {
		ID:            "0",
		Email:         "jwhiteside11@yahoo.com",
		Blip:          UserJDWblip,
		Occupation:    "Home cook",
		Allergies:     make([]Setting, 0),
		FavoriteFoods: make([]Setting, 0),
	},
}

var RecipeMap = map[string]Recipe{
	"0": exampleRecipe("General Tso's Chicken w/ Vegetable Fried Rice", 0),
	"1": exampleRecipe("Apple crumble pie with dutch crisp topping", 1),
	"2": exampleRecipe("Tomato Pie with Mozarella and romano cheese", 2),
	"3": exampleRecipe("Smoked Halibut with Rice Pilaf and Spring Olives", 3),
	"4": exampleRecipe("bhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjew", 4),
	"5": exampleRecipe("bhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpe", 5),
	"6": exampleRecipe("Smoked Halibut with Rice bhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjew", 6),
	"7": exampleRecipe("Example title with example sides and example toppings with example", 7),
	"8": exampleRecipe("Short example title", 8),
}

var RecipeDemoMap = map[string]RecipeDemo{
	"0": exampleDemoRecipe("General Tso's Chicken w/ Vegetable Fried Rice", 0),
	"1": exampleDemoRecipe("Apple crumble pie with dutch crisp topping", 1),
	"2": exampleDemoRecipe("Tomato Pie with Mozarella and romano cheese", 2),
	"3": exampleDemoRecipe("Smoked Halibut with Rice Pilaf and Spring Olives", 3),
	"4": exampleDemoRecipe("bhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjew", 4),
	"5": exampleDemoRecipe("bhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpe", 5),
	"6": exampleDemoRecipe("Smoked Halibut with Rice bhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjew", 6),
	"7": exampleDemoRecipe("Example title with example sides and example toppings with example", 7),
	"8": exampleDemoRecipe("Short example title", 8),
}

var RecipeMetaInfoMap = map[string]RecipeMetaInfo{
	"0": RecipeMap["0"].MetaInfo,
	"1": RecipeMap["1"].MetaInfo,
	"2": RecipeMap["2"].MetaInfo,
	"3": RecipeMap["3"].MetaInfo,
	"4": RecipeMap["4"].MetaInfo,
	"5": RecipeMap["5"].MetaInfo,
	"6": RecipeMap["6"].MetaInfo,
	"7": RecipeMap["7"].MetaInfo,
	"8": RecipeMap["8"].MetaInfo,
}

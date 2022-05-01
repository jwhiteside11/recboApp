package parser

import (
	"fmt"
	"strconv"
	"strings"
)

type NutritionalInfo struct {
	NutritionalSynonym string
	Quantity           float32
	Unit               string
}

var unitOptionsMap map[string]string = map[string]string{
	"g":           "g",
	"gram":        "g",
	"grams":       "g",
	"kg":          "kg",
	"kilogram":    "kg",
	"kilograms":   "kg",
	"ml":          "mL",
	"milliliter":  "mL",
	"l":           "L",
	"liter":       "L",
	"c":           "c",
	"cup":         "c",
	"cups":        "c",
	"tsp":         "tsp",
	"teaspoon":    "tsp",
	"teaspoons":   "tsp",
	"tbsp":        "tbsp",
	"tablespoon":  "tbsp",
	"tablespoons": "tbsp",
	"q":           "Q",
	"quart":       "Q",
	"quarts":      "Q",
	"gal":         "G",
	"gallon":      "G",
	"gallons":     "G",
	"lb":          "lb",
	"pound":       "lb",
	"lbs":         "lbs",
	"pounds":      "lbs",
}

var unitAdjectivesMap map[string]bool = map[string]bool{
	"scant":   true,
	"heaping": true,
}

var decimalMap map[rune]bool = map[rune]bool{
	'0': true,
	'1': true,
	'2': true,
	'3': true,
	'4': true,
	'5': true,
	'6': true,
	'7': true,
	'8': true,
	'9': true,
}

func ParseIngredientList(ll []string) []NutritionalInfo {
	l := len(ll)
	ingList := make([]NutritionalInfo, l)

	for i, s := range ll {
		ingList[i] = parseIngredient(s)
	}

	return ingList
}

func parseIngredient(s string) NutritionalInfo {
	q, qS, start := getQuantity(s)
	u, nS := getUnitAndNutritionalSynonym(qS, start)
	return NutritionalInfo{nS, q, u}
}

func getQuantity(s string) (float32, string, int) { // first
	// Naive: loop through string, take first consecutive string of decimal numbers as quantity
	// ** Better: finding not only a number, but a unit as well is more relevant
	// quantity and unit should be found together in the following formats:
	//  - Qu nS, Q u nS, Q nS, `nS, Q`
	// First, locate q, then make decisions about units
	//  - if q not found, q and u default to db value
	// Once q is found, take u according to the above formats.
	// The remainder of the string is nS. Do fuzzy search, take most relevant result

	// Check for number quantity

	// If not found, check for numberless
	// - pinch, to taste
	start, end := findFirstNumberSequenceInString(s, 0)

	if start < 0 {
		// No number found in string
		return 0, s, -1
	}
	// Number sequence exists
	var num float32
	numStr := s[start:end]

	if numInt, err := strconv.Atoi(numStr); err == nil {
		num = float32(numInt)
	} else {
		if index := strings.IndexRune(numStr, '/'); index < 0 {
			return 0, s, -1
		} else {
			numA, errA := strconv.Atoi(numStr[:index])
			numB, errB := strconv.Atoi(numStr[index+1:])
			if errA == nil && errB == nil && numB != 0 {
				num = float32(numA) / float32(numB)
			} else {
				return 0, s, -1
			}
		}
	}
	fmt.Println("RESULTS", num, strings.TrimSpace(s[:start]+s[end:]), end-len(numStr))
	return num, strings.TrimSpace(s[:start] + s[end:]), end - len(numStr)
}

func getUnitAndNutritionalSynonym(s string, start int) (string, string) { // second
	// Naive: do string match for all unit options, take the most specific one found
	// ** Better: we know the indices of the Q, look after it for units
	// Starting at right, traverse until the character is not whitespace or '-' (or at length)
	// Mark the index, then traverse to next whitespace, '-', or length; take s[first:last] as word
	// Check word against unit options
	s = strings.ToLower(s)
	if start < 0 {
		// Quantity not found - unit is irrelevant
		return "", s
	}

	i := findNextWordStartInString(s, start)
	j := findNextSpaceInString(s, i)

	if i != j {
		word := s[i:j]
		if clean, found := unitOptionsMap[word]; found {
			return clean, strings.TrimSpace(s[start:i] + s[j:])
		} else if _, isAdj := unitAdjectivesMap[word]; isAdj {
			// Leading adjective found; recursive call to analyze next word
			return getUnitAndNutritionalSynonym(s, j)
		}
	}
	// Unit not found, return original string
	return "", s
}

func findNextWordStartInString(s string, start int) int {
	l := len(s)
	for i := start; i < l; i++ {
		if s[i] == ' ' {
			continue
		}
		return i
	}
	return l
}

func findNextSpaceInString(s string, start int) int {
	l := len(s)
	for i := start; i < l; i++ {
		if s[i] == ' ' {
			return i
		}
	}
	return l
}

func findFirstNumberSequenceInString(s string, start int) (int, int) {
	u, v := -1, -1
	for i, c := range s {
		if charIsDecimal(c) {
			if u < 0 {
				u = i
			}
			v = i + 1
		} else if c == ' ' {
			if u >= 0 {
				break
			}
		}
	}
	return u, v
}

func charIsDecimal(c rune) bool {
	if _, found := decimalMap[c]; found {
		return true
	}
	return false
}

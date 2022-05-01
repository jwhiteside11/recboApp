

export type IngredientMetrics = {
	quantity: number;
	unit: string;
    template: string;
}

const unitOptionsMap:  Map<string, string> = new Map(Object.entries({
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
}))

const unitAdjectivesMap:  Map<string, boolean> = new Map(Object.entries({
	"scant":   true,
	"heaping": true,
}))

const findNextWordStartInString: (s: string, start: number) => number = (s, start) => {
	const l = s.length
	for (let i = start; i < l; i++) {
		if (s.charAt(i) === ' ') {
            continue
        }
        return i
	}
	return l
}

const findNextSpaceInString: (s: string, start: number) => number = (s, start) => {
	const l = s.length
	for (let i = start; i < l; i++) {
		if (s.charAt(i) === ' ') {
			return i
		}
	}
	return l
}

const findFirstNumberSequenceInString: (s: string, start: number) => {start: number, end: number} = (s, start) => {
	let u, v
    u = v = -1
	for (let i = 0; i < s.length; i++) {
        const c = s.charAt(i)
        if (charIsDecimal(c)) {
            if (u < 0) u = i;
            v = i + 1
        } else if (c === ' ') {
            if (u >= 0) break;
        }
    }
    return { start: u, end: v }
}

const charIsDecimal: (c: string) => boolean = (c) => {
	if (c >= '0' && c <= '9') {
		return true
	}
	return false
}

export const templateToString: (t: string, varMap: {[key: string]: string}) => string = (t, varMap) => {
    // Search for template values surrounded by brackets - ex {u}
    // Replace brackets and inner var name with corresponding value
    let start = t.indexOf('{')
    let end = t.indexOf('}')

    while (start >= 0 && end >= 0 && end > start) {
        const varName = t.substring(start + 1, end)
        t = t.substring(0, start) + varMap[varName] + t.substring(end + 1)

        start = t.indexOf('{')
        end = t.indexOf('}')
    }
    return t
}

export const stringToTemplate: (s: string, replacements: {[key: string]: {start: number, end: number}}) => string = (s, replacements) => {
    // Parse ingredient string for quantity and unit, create template for dynamic data injection
    // Needed: quantity (start, end), unit (start, end)
    // Example formats: `{q}{u} chicken breast`, `{q} {u} chicken breast`, `{q} chicken breast`
    const replaceEntries = Object.entries(replacements)
    replaceEntries.sort((a, b) => a[1].end - b[1].end)
    
    let offset = 0
    replaceEntries.forEach(([key, inds]) => {
        const tmp = s
        if (inds.start >= 0 && inds.end >= 0) {
            s = `${s.substring(0, inds.start + offset)}{${key}}${s.substring(inds.end + offset)}`
            offset += s.length - tmp.length
        }
    })
    return s
}

const getQuantity: (s: string) => {quantity: number, startQ: number, endQ: number, next: string} = (s) => { // first
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
	const { start, end } = findFirstNumberSequenceInString(s, 0)

	if (start < 0) {
		// No number found in string
		return { quantity: 0, startQ: -1, endQ: -1, next: s }
	}
	// Number sequence exists
	let num: number
	const numStr: string = s.substring(start, end)
    const numInt: number = parseInt(numStr)

    if (!isNaN(numInt)) {
        num = numInt
    } else {
        const idx: number = numStr.indexOf('/')
        if (idx < 0) {
            return { quantity: 0, startQ: -1, endQ: -1, next: s }
        } else {
            const numA = parseInt(numStr.substring(0, idx))
            const numB = parseInt(numStr.substring(idx + 1))
            if (!isNaN(numA) && !isNaN(numB) && numB !== 0) {
                num = numA / numB
            } else {
                return { quantity: 0, startQ: -1, endQ: -1, next: s }
            }
        }
    }

    return { quantity: num, startQ: start, endQ: end, next: s.substring(0, start) + s.substring(end) }
}

const getUnit: (s: string, start: number) => {unit: string, startU: number, endU: number} = (s, start) => { // second
	// Naive: do string match for all unit options, take the most specific one found
	// ** Better: we know the indices of the Q, look after it for units
	// Starting at right, traverse until the character is not whitespace or '-' (or at length)
	// Mark the index, then traverse to next whitespace, '-', or length; take s[first:last] as word
	// Check word against unit options
	s = s.toLowerCase()
	if (start < 0) {
		// Quantity not found - unit is irrelevant
		return {unit: "", startU: -1, endU: -1}
	}

	const i = findNextWordStartInString(s, start)
	const j = findNextSpaceInString(s, i)

	if (i !== j) {
		const word = s.substring(i, j)
        const unit = unitOptionsMap.get(word)
        if (unit) {
            return { unit, startU: i, endU: j }
        } else if (unitAdjectivesMap.has(word)) {
            return getUnit(s, j)
        }
	}
	// Unit not found, return original string
		return {unit: "", startU: -1, endU: -1}
}

export const parseIngredient: (s: string) => IngredientMetrics = (s) => {
    const { quantity, startQ, endQ, next } = getQuantity(s)
    const diff = s.length - next.length
    const { unit, startU, endU } = getUnit(next, endQ - diff)
    const replacements = {
        'u': {
            start: startU + diff,
            end: endU + diff
        },
        'q': {
            start: startQ,
            end: endQ
        }
    }
    const template = stringToTemplate(s, replacements)
    return { quantity, unit, template }
}

export const parseIngredientList: (ll: string[]) => IngredientMetrics[] = (ll) => {
	const l = ll.length
	const ingList: IngredientMetrics[] = Array(l)

    for (let i = 0; i < l; i++) {
        ingList[i] = parseIngredient(ll[i])
    }

	return ingList
}

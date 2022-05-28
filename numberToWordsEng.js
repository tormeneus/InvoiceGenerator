//Array with words for the number
const words = [
  [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ],
  [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ],
  [
    '',
    'one hundred',
    'two hundred',
    'three hundred',
    'four hundred',
    'five hundred',
    'six hundred',
    'seven hundred',
    'eight hundred',
    'nine hundred',
  ],
]

const numberScale = ['thousand ', 'million ', 'billion ', 'trillion ']

const parseNumber = (number, count, currency) => {
  let firstDigit
  let secondDigit
  let numeral = '' //string to convert number into words

  //Checking if number has 3 digits
  if (number.length === 3) {
    firstDigit = number.substr(0, 1)
    number = number.substr(1, 3) //Deleting the first digit of the number after the check
    numeral = '' + words[2][firstDigit] + ' '
  }

  if (number < 20) {
    numeral = numeral + words[0][parseFloat(number)] + ' '
  } else {
    firstDigit = number.substr(0, 1)
    secondDigit = number.substr(1, 2)
    numeral = numeral + words[1][firstDigit] + ' ' + words[0][secondDigit] + ' ' //Adding text for number of dozens and units
  }

  if (count === 0) {
    switch (currency) {
      case 'Dollar': {
        numeral = numeral + ' dollars'
        break
      }
      case 'Euro': {
        numeral = numeral + 'euros'
        break
      }
      case 'Hryvna':
      default: {
        numeral = numeral + 'hryvnias'
      }
    }
  } else if (count === 1) {
    //Checking if the number is less than 999999 but more than 999
    if (numeral !== '  ') {
      numeral = numeral + numberScale[0] //0 in the numberScale array is for thousands
    }
  } else if (count > 1) {
    if (numeral !== '  ') {
      numeral = numeral + numberScale[count - 1] //numberScale for millions and so on
    }
  }

  return numeral
}

// Function for adding text for decimals

const parseDecimals = (number, currency) => {
  let text = ''

  if (currency == 'Hryvna') {
    text = 'kopiykas'
  }

  if (currency == 'Dollar' || currency == 'Euro') {
    text = 'cents'
  }

  if (number === 0) {
    number = '00'
  } else if (number < 10) {
    number = '0' + number
  }

  return ' and ' + number + ' ' + text
}

export function numberToWordsEng(number, currency) {
  if (!number || number < 0) {
    return false
  }

  //Checking if number is actually a Number or String
  if (typeof number !== 'number' && typeof number !== 'string') {
    return false
  }

  if (typeof number === 'string') {
    number = parseFloat(number.replace(',', '.')) //Checking if comma is used to separate decimals and changing it to period

    if (isNaN(number)) {
      //Checking if nothing is broken during conversions:)
      return false
    }
  }

  let splittedNumber
  let decimals = 0

  number = number.toFixed(2)
  if (number.indexOf('.') !== -1) {
    //Checking if the number has decimals
    splittedNumber = number.split('.')
    number = splittedNumber[0]
    decimals = splittedNumber[1]
  }

  let numeral = '' //This variable will store actual text of the number
  let length = number.length - 1
  let parts = '' //These are 3-digit parts in the number that are parsed by parseNumber function
  let count = 0 //This variable is for counting 3-digit parts (defines thousands, millions, etc).
  let digit

  while (length >= 0) {
    digit = number.substr(length, 1) //removes one digit with every iteration
    parts = digit + parts //adding digit to the 3-digit part

    //Parsing 3-digit part once it has 3 digits
    if ((parts.length === 3 || length === 0) && !isNaN(parseFloat(parts))) {
      //just in case checking if "parts" variable is not a NaN
      numeral = parseNumber(parts, count, currency) + numeral
      parts = ''
      count++
    }

    length--
  }

  numeral = numeral.replace(/\s+/g, ' ') //In case of double spaces replace it with one space

  if (decimals) {
    numeral = numeral + parseDecimals(parseFloat(decimals), currency)
  }

  return numeral
}

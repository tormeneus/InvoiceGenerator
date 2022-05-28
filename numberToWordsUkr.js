const words = [
  [
    '',
    'один',
    'два',
    'три',
    'чотири',
    'п’ять',
    'шість',
    'сім',
    'вісім',
    'дев’ять',
    'десять',
    'одинадцять',
    'дванадцять',
    'тринадцять',
    'чотирнадцять',
    'п’ятнадцять',
    'шістнадцять',
    'сімнадцять',
    'вісімнадцять',
    'дев’ятнадцять',
  ],
  [
    '',
    '',
    'двадцять',
    'тридцять',
    'сорок',
    'п’ятдесят',
    'шістдесят',
    'сімдесят',
    'вісімдесят',
    'дев’яносто',
  ],
  [
    '',
    'сто',
    'двісті',
    'триста',
    'чотириста',
    'п’ятсот',
    'шістсот',
    'сімсот',
    'вісімсот',
    'дев’ятсот',
  ],
]

const numberScale = [
  ['тисяча ', 'тисячі ', 'тисяч '],
  ['мільйон ', 'мільйони ', 'мільйонів '],
  ['мільярд ', 'мільярди ', 'мільярдів '],
  ['трильйон ', 'трильйони ', 'трильйонів '],
]

const hryvna = ['гривня', 'гривні', 'гривень']

const dollar = ['долар', 'долари', 'доларів']

const euro = ['євро', 'євро', 'євро']

//Function that defines the case of the word for the numbers scale (thousand, million, billion, etc.) and currency

const caseVariant = (count, variants) => {
  //Find last 2 digits and the last digit of the number and change the case accordingly
  let lastTwoDigits = Math.abs(count) % 100
  let lastDigit = count % 10

  if (lastTwoDigits > 10 && lastTwoDigits < 20) {
    return variants[2]
  }

  if (lastDigit > 1 && lastDigit < 5) {
    return variants[1]
  }

  if (lastDigit === 1) {
    return variants[0]
  }

  return variants[2]
}

const parseNumber = (number, count, currency) => {
  let firstDigit
  let secondDigit
  let numeral = ''

  //Checking if number has 3 digits
  if (number.length === 3) {
    firstDigit = number.substr(0, 1)
    number = number.substr(1, 3) //Deleting the first digit of the number after the check
    numeral = '' + words[2][firstDigit] + ' ' //Adding hundreds text
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
        numeral = numeral + caseVariant(number, dollar)
        break
      }
      case 'Euro': {
        numeral = numeral + caseVariant(number, euro)
        break
      }
      case 'Hryvna':
      default: {
        numeral =
          numeral.replace('один ', 'одна ') + caseVariant(number, hryvna)
      }
    } //Checking if the number is less than 999999 but more than 999
  } else if (count === 1) {
    if (numeral !== '  ') {
      numeral = numeral + caseVariant(number, numberScale[0]) //0 in the numberScale array is for thousands
      numeral = numeral.replace('один ', 'одна ').replace('два ', 'дві ') //Changing grammatical gender of the numeral
    }
  } else if (count > 1) {
    if (numeral !== '  ') {
      numeral = numeral + caseVariant(number, numberScale[count - 1]) //numberScale for millions and so on
    }
  }

  return numeral
}

const parseDecimals = (number, currency) => {
  let text = ''

  if (currency == 'Hryvna') {
    text = caseVariant(number, ['копійка', 'копійки', 'копійок'])
  }

  if (currency == 'Dollar') {
    text = caseVariant(number, ['цент', 'центи', 'центів'])
  }

  if (currency == 'Euro') {
    text = caseVariant(number, ['євроцент', 'євроценти', 'євроцентів'])
  }

  if (number === 0) {
    number = '00'
  } else if (number < 10) {
    number = '0' + number
  }

  return ' і ' + number + ' ' + text
}

export function numberToWordsUkr(number, currency) {
  if (!number || number < 0) {
    return false
  }

  //Checking if number is actually a Number or String
  if (typeof number !== 'number' && typeof number !== 'string') {
    return false
  }

  if (typeof number === 'string') {
    number = parseFloat(number.replace(',', '.')) //Checking if comma is used to separate decimals and changing it to period

    //Checking if nothing is broken during conversions:)
    if (isNaN(number)) {
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
  let parts = '' //These are parts of up to 3 digits in the number that are parsed by parseNumber function
  let count = 0 //This variable is for counting 3-digit parts (defines thousands, millions, etc).
  let digit

  while (length >= 0) {
    digit = number.substr(length, 1) //removes one digit with every iteration
    parts = digit + parts

    //Parsing 3-digit part once it has 3 digits
    if ((parts.length === 3 || length === 0) && !isNaN(parseFloat(parts))) {
      //just in case checking if "parts" variable is not a NaN
      numeral = parseNumber(parts, count, currency) + numeral
      parts = ''
      count++
    }

    length--
  }

  numeral = numeral.replace(/\s+/g, ' ') //In case of double spaces replaces them with one space

  if (decimals) {
    numeral = numeral + parseDecimals(parseFloat(decimals), currency)
  }

  return numeral
}

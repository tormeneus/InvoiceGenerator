import { numberToWordsUkr } from './numberToWordsUkr.js'
import { numberToWordsEng } from './numberToWordsEng.js'
import { parseDate } from './parseDate.js'

const template = document.getElementById('template')
const amount = document.getElementById('amount')
const currency = document.getElementById('currency')
const invoiceNumber = document.getElementById('invoice_number')
const button = document.getElementById('button')
const alertDiv = document.getElementById('alert-div')
const date = document.getElementById('date')

let ukrCurrency = 'Default'

const showAlert = (text) => {
  alertDiv.innerText = text
  setTimeout(() => (alertDiv.innerText = ''), 3000)
}

button.addEventListener('click', (e) => {
  e.preventDefault()

  if (!template.value) {
    showAlert('Виберіть шаблон інвойсу')
    return
  }

  if (!amount.value) {
    showAlert('Вкажіть суму')
    return
  }

  if (amount.value <= 0) {
    showAlert('Сума має бути більше 0')
    return
  }

  if (amount.value > 999999999999999) {
    showAlert('Нашо тобі ця програма з такими сумами?')
    return
  }

  if (!invoiceNumber.value) {
    showAlert('Вкажіть номер інвойсу')
    return
  }

  if (!date.value) {
    showAlert('Зазначте дату інвойсу')
    return
  }

  switch (currency.value) {
    case 'Dollar': {
      ukrCurrency = 'Долар'
    }
    case 'Euro': {
      ukrCurrency = 'Євро'
    }
    case 'Hryvna': {
      ukrCurrency = 'Гривня'
    }
  }

  generateFile()
})

//Function that replaces strings in the uploaded Word file. Docx format is supported only
function generateFile() {
  let reader = new FileReader()
  if (template.files.length === 0) {
    alert('No files selected')
  }
  reader.readAsBinaryString(template.files.item(0))

  reader.onerror = function (evt) {
    console.log('error reading file', evt)
    alert('error reading file' + evt)
  }

  reader.onload = function (evt) {
    const content = evt.target.result
    let zip = new PizZip(content)
    let doc = new window.docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    // Render the document

    let totalamount = parseFloat(amount.value)
      .toFixed(2)
      .toString()
      .replace('.', ',')

    doc.render({
      amount: totalamount,
      invoice_number: invoiceNumber.value,
      eng_number_to_word: numberToWordsEng(amount.value, currency.value),
      ukr_number_to_word: numberToWordsUkr(amount.value, currency.value),
      currency_eng: currency.value.toLowerCase(),
      currency_ukr: ukrCurrency.toLowerCase(),
      date: parseDate(date.value),
    })

    let out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    })
    // Output the document using Data-URI
    saveAs(out, 'output.docx')
  }
}

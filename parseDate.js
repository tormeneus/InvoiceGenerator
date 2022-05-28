export function parseDate(date) {
  console.log(date)
  const dateArray = date.split('-')
  let yyyy = dateArray[0]
  let mm = dateArray[1]
  let dd = dateArray[2]
  return dd + '.' + mm + '.' + yyyy
}

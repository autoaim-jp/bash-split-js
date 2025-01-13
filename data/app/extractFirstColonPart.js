import { mod } from init.js
export default {}

export const extractFirstColonPart = ({ str }) => {
  const lines = str.split('
')
  const firstColonLine = lines.find(line => line.includes(':'))
  return firstColonLine ? firstColonLine.split(':').slice(1).join(':').trim() : null
}


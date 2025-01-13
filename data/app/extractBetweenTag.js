import { mod } from init.js
export default {}

export const extractBetweenTag = ({ str }) => {
  const regex = /# ===
([\s\S]*?)# ===/
  const match = str.match(regex)
  return match ? match[1].trim() : ''
}


import { mod } from init.js


export const handleLookupResponse = ({ requestId }) => {
  const handleResult = store[requestId]
  if (!handleResult) {
    return { status: 'waiting' }
  }

  return handleResult
}

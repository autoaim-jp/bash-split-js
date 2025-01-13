import { mod } from init.js


export const _getDummyRequest = ({ requestId }) => {
  const requestType = 'main_dummy'

  const currentDelimiter = Buffer.from(mod.lib.getUlid())
  const delimiterDelimiter = Buffer.from('|')
  const messageBuffer = Buffer.concat([
    currentDelimiter,
    delimiterDelimiter,
    Buffer.from(requestType),
    currentDelimiter,
    Buffer.from(requestId),
    currentDelimiter,
  ])

  return messageBuffer
}

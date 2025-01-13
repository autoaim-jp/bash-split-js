import { mod, store } from './init.js'
export default {}

export const handleRegisterPingPrompt = async ({ fileBuffer, rightTopText, leftTopText, rightBottomText }) => {
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const messageBuffer = _getPingRequest({ requestId, fileBuffer, rightTopText, leftTopText, rightBottomText })
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}


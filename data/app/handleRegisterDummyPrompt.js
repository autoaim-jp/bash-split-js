import { mod, store } from './init.js'
export default {}

export const handleRegisterDummyPrompt = async ({}) => {
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const messageBuffer = _getDummyRequest({ requestId })
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}


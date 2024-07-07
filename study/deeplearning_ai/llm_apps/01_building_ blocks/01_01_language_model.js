import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

// Creating model
export const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo-1106',
})

export const modelInvoke = async (command = 'Tell me a joke.') =>
  await model.invoke([new HumanMessage(command)])

await modelInvoke()

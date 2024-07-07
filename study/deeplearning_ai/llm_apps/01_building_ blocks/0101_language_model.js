import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

// Creating model
export const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo-1106',
})

await model.invoke([new HumanMessage('Tell me a joke.')])

// const modelInvoke = async (command = 'Tell me a joke.') =>
//   model.invoke([new HumanMessage(command)])

// const res = await modelInvoke()
// console.log(res)

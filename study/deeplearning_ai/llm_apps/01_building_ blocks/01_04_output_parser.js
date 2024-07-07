import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { model } from './01_01_language_model'
import { prompt } from './01_02_prompt_template'

const outputParser = new StringOutputParser()

// Piping prompt, model and outputparser
let nameGenerationChain = prompt.pipe(model).pipe(outputParser)

let res = await nameGenerationChain.invoke({
  product: 'fancy cookies',
})
console.log(res)

nameGenerationChain = RunnableSequence.from([prompt, model, outputParser])
res = await nameGenerationChain.invoke({
  product: 'hipster pants',
})
console.log(res)

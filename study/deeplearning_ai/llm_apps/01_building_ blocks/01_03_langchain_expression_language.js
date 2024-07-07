import { model } from './01_01_language_model'
import { prompt } from './01_02_prompt_template'

// creating chain by piping prompt (template) and model
const chain = prompt.pipe(model)

export const invokeChain = async (product = 'colorful socks') =>
  await chain.invoke({
    product,
  })

// await invokeChain()
// -> AIMessage { lc_serializable: true,
//      lc_kwargs:
//       { content: '1. Rainbow Threads\n2. Happy Hues Socks Co.\n3. Vibrant Sole Designs',
//         additional_kwargs: { function_call: undefined, tool_calls: undefined } },
//      lc_namespace: [ 'langchain_core', 'messages' ],
//      content: '1. Rainbow Threads\n2. Happy Hues Socks Co.\n3. Vibrant Sole Designs',
//      name: undefined,
//      additional_kwargs: { function_call: undefined, tool_calls: undefined }
// }

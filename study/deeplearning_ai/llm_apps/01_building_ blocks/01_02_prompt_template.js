import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts'

// 1. creating template
export const prompt = ChatPromptTemplate.fromTemplate(
  `What are three good names for a company that makes {product}?`
)

// 2. formatting template -> replacing template {key}, prefixed with human (default)
export const formatPrompt = async (product = 'colorful socks') =>
  await prompt.format({
    product,
  })

// await formatPrompt()
// -> Human: What are three good names for a company that makes colorful socks?

// 3. returns a HumanMessage instead (default)
export const formatPromptMessages = async (product = 'cozy socks') =>
  await prompt.formatMessages({
    product,
  })

// await formatPromptMessages()
// -> [ HumanMessage { lc_serializable: true,
//     lc_kwargs:
//      { content: 'What are three good names for a company that makes colorful socks?',
//        additional_kwargs: {} },
//     lc_namespace: [ 'langchain_core', 'messages' ],
//     content: 'What are three good names for a company that makes colorful socks?',
//     name: undefined,
//     additional_kwargs: {} }
// ]

// 4. Specifying message types
const promptFromMessages1 = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    'You are an expert at picking company names.'
  ),
  HumanMessagePromptTemplate.fromTemplate(
    'What are three good names for a company that makes {product}?'
  ),
])

export const getPromptFromMessages1 = async (product = 'shiny objects') =>
  await promptFromMessages1.formatMessages({
    product,
  })
// await getPromptFromMessages1()
// -> [ SystemMessage { lc_serializable: true,
//     lc_kwargs:
//      { content: 'You are an expert at picking company names.',
//        additional_kwargs: {} },
//     lc_namespace: [ 'langchain_core', 'messages' ],
//     content: 'You are an expert at picking company names.',
//     name: undefined,
//     additional_kwargs: {} },
//   HumanMessage { lc_serializable: true,
//     lc_kwargs:
//      { content: 'What are three good names for a company that makes shiny objects?',
//        additional_kwargs: {} },
//     lc_namespace: [ 'langchain_core', 'messages' ],
//     content: 'What are three good names for a company that makes shiny objects?',
//     name: undefined,
//     additional_kwargs: {} }
// ]

// 5. or shorthanded
const promptFromMessages2 = ChatPromptTemplate.fromMessages([
  ['system', 'You are an expert at picking company names.'],
  ['human', 'What are three good names for a company that makes {product}?'],
])

export const getPromptFromMessages2 = async (product = 'shiny objects') =>
  await promptFromMessages2.formatMessages({
    product,
  })

// await promptFromMessages2()
// -> [ SystemMessage { lc_serializable: true,
//     lc_kwargs:
//      { content: 'You are an expert at picking company names.',
//        additional_kwargs: {} },
//     lc_namespace: [ 'langchain_core', 'messages' ],
//     content: 'You are an expert at picking company names.',
//     name: undefined,
//     additional_kwargs: {} },
//   HumanMessage { lc_serializable: true,
//     lc_kwargs:
//      { content: 'What are three good names for a company that makes shiny objects?',
//        additional_kwargs: {} },
//     lc_namespace: [ 'langchain_core', 'messages' ],
//     content: 'What are three good names for a company that makes shiny objects?',
//     name: undefined,
//     additional_kwargs: {} }
// ]

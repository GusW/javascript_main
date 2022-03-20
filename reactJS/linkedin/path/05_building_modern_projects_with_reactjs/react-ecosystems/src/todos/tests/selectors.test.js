import { expect } from 'chai'
import { getCompleteTodos } from '../selectors'

describe('The getCompletedTodos selector', () => {
  it('Returns only completed todos', () => {
    const fakeTodos = [
      {
        text: 'Say Hello',
        isCompleted: true,
      },
      {
        text: 'Say Goodbye',
        isCompleted: false,
      },
      {
        text: 'Climb Mount Everest',
        isCompleted: false,
      },
    ]
    const expected = [
      {
        text: 'Say Hello',
        isCompleted: true,
      },
    ]
    const actual = getCompleteTodos.resultFunc(fakeTodos)

    expect(actual).to.deep.equal(expected)
  })
})

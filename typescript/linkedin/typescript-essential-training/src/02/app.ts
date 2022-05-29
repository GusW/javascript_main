enum TodoStatus {
  DONE = 'done',
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
}

interface Todo {
  id: number
  title: string
  status: TodoStatus
  completedOn?: Date
}

const todoItems: Todo[] = [
  {
    id: 1,
    title: 'Learn HTML',
    status: TodoStatus.DONE,
    completedOn: new Date('2021-09-11'),
  },
  { id: 2, title: 'Learn TypeScript', status: TodoStatus.IN_PROGRESS },
  { id: 3, title: 'Write the best app in the world', status: TodoStatus.TODO },
]

const addTodoItem = (todo: string): Todo => {
  const id = getNextId<Todo>(todoItems)

  const newTodo = {
    id,
    title: todo,
    status: TodoStatus.TODO,
  }

  todoItems.push(newTodo)

  return newTodo
}

const getNextId = <T extends { id: number }>(items: T[]): number =>
  items.reduce((accum, x) => (x.id > accum ? accum : x.id), 0) + 1

const newTodo = addTodoItem(
  'Buy lots of stuff with all the money we make from the app'
)

console.log(JSON.stringify(newTodo))

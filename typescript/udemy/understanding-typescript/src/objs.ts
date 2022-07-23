enum MyRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  READ_ONLY = 'read_only',
}

const person: {
  name: string // redundant
  age: number // redundant
  hobbies: string[]
  role: [number, string] // Tuple
  myRole: MyRole
} = {
  name: 'Maximilian',
  age: 30,
  hobbies: ['foo', 'bar', 'ever'],
  role: [2, 'author'],
  myRole: MyRole.AUTHOR,
}

console.log(person.name)

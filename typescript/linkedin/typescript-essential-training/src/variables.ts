let x: number
let y: string
let z: boolean
let a: Date
let b: string[]

b = 'Hello!' as any
b = 1234 as any

// Record: type flexibility
let w: Record<string, string | number | boolean | Function> = {
  name: 'Joe Doe',
}
w.number = 1234
w.active = true
w.log = () => console.log('awesome!')

import logo from './logo.svg';
import Message from './Message';
import './App.css';

// const initialState = {
//   name: "Foo",
//   message: "my message #2"
// }

// type State = Readonly<typeof initialState>

const App = () => {
  // basic types
  const type1: string = "Some string"
  const type2: number = 34
  const type3: number = 34.67
  const type4: boolean = false
  const type5: Array<number> = [1, 2, 3, 4, 5]
  const type6: string[] = ["1", "2", "3", "4", "5"]

  const basicTypes: any[] = [type1, type2, type3, type4, type5, type6]

  // complex types
  const aTuple: [number, string, boolean] = [1.11, "a", true]
  enum Codes { first = 1, second = 2 }
  const logMe = (something: string): void => console.log(something)

  const complexTypes: any[] = [aTuple, Codes, logMe]

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {basicTypes?.map((t, idx) => (<p key={`${idx}_basic`}>
          type of {t} is {typeof t}
        </p>))}
        <br />
        {complexTypes?.map((t, idx) => (<p key={`${idx}_complex`}>
          {typeof t}
        </p>))}
        <Message />
      </header>
    </div>
  );
}

export default App;

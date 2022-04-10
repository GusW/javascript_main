import { RecoilRoot } from 'recoil'
import { Provider } from 'react-redux'
import { CounterButton } from './1-useState/CounterButton'
import { CounterProvider } from './2-Context/CounterProvider'
import { CounterContextButton } from './2-Context/CounterContextButton'
import { CounterRecoilButton } from './3-Recoil/CounterRecoilButton'
import { CounterDisplay } from './3-Recoil/CounterDisplay'
import { store } from './4-Redux/store'
import { CounterReducerButton } from './4-Redux/CounterReducerButton'
import { CounterMobXButton } from './5-MobX/CounterMobXButton'
import { Counter } from './5-MobX/Counter'
import './App.css'

const App = () => {
  return (
    <>
      <h1>State Management Example</h1>
      <>
        <h2>useState</h2>
        <CounterButton />
      </>
      <>
        <h2>Context</h2>
        <CounterProvider>
          <CounterContextButton />
        </CounterProvider>
      </>
      <>
        <h2>Recoil</h2>
        <RecoilRoot>
          <CounterDisplay />
          <CounterRecoilButton />
        </RecoilRoot>
      </>
      <>
        <h2>Redux</h2>
        <Provider store={store}>
          <CounterReducerButton />
        </Provider>
      </>
      <>
        <h2>MobX</h2>
        <CounterMobXButton counter={new Counter()} />
      </>
    </>
  )
}

export default App

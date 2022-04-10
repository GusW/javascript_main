import { useRecoilValue } from 'recoil'
import { numberOfClicksSelector } from './numberOfClicksSelector'

export const CounterDisplay = () => {
  const numberOfClicks = useRecoilValue(numberOfClicksSelector)

  return <h3>Number Of Clicks: {numberOfClicks}</h3>
}

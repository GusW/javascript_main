import { Button } from './composition.js'

export const partiallyApply = (Component, partialProps) => (props) =>
  <Component {...partialProps} {...props} />

export const DangerButtonPartial = partiallyApply(Button, { color: 'red' })
export const BigSuccessButtonPartial = partiallyApply(Button, {
  color: 'green',
  size: 'large',
})

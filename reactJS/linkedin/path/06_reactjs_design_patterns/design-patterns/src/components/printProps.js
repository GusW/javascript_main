export const printProps = (Component) => (props) => {
  console.log(props)

  return <Component {...props} />
}

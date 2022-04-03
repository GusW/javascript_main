export const Button = ({ size, color, text, ...props }) => (
  <button
    style={{
      padding: size === 'large' ? '32px' : '8px',
      fontSize: size === 'large' ? '32px' : '16px',
      backgroundColor: color,
    }}
    {...props}
  >
    {text}
  </button>
)

export const DangerButton = (props) => <Button {...props} color="red" />

export const BigSuccessButton = (props) => (
  <Button {...props} size="large" color="green" />
)

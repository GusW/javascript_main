export const COUNTER_BUTTON_CLICKED = 'COUNTER_BUTTON_CLICKED'

export const counterButtonClicked = (amount) => ({
  type: COUNTER_BUTTON_CLICKED,
  payload: { amount },
})

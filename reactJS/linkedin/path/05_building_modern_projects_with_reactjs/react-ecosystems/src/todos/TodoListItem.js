import React from 'react'
import styled from 'styled-components'

const TodoItemContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 8px grey;
`

export const getBorderStyleForDate = (startingDate, currentDate) =>
  new Date(startingDate) > new Date(currentDate - 86400000 * 5)
    ? 'none'
    : '0.5rem solid red'

const TodoItemContainerWithWarning = styled(TodoItemContainer)`
  border-bottom: ${(props) =>
    getBorderStyleForDate(props.createdAt, Date.now())};
`

const ButtonsContainer = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
`
const Button = styled.button`
  font-size: 16px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  display: inline-block;
`

const CompletedButton = styled(Button)`
  background-color: #22ee22;
`

const RemoveButton = styled(Button)`
  background-color: #ee2222;
  margin-left: 8px;
`

const ThunkButton = styled(Button)`
  background-color: #eeb822;
  margin-left: 8px;
`

const TodoListItem = ({
  todo,
  onRemovePressed,
  onCompletedPressed,
  onDisplayAlertClicked,
}) => {
  const Container = todo.isCompleted
    ? TodoItemContainer
    : TodoItemContainerWithWarning

  return (
    <Container createdAt={todo.createdAt}>
      <h3>{todo.text}</h3>
      <p>
        Created at:&nbsp;
        {new Date(todo.createdAt).toLocaleDateString()}
      </p>
      <ButtonsContainer>
        {!todo.isCompleted && (
          <CompletedButton onClick={() => onCompletedPressed(todo.id)}>
            Mark As Completed
          </CompletedButton>
        )}
        <RemoveButton onClick={() => onRemovePressed(todo.id)}>
          Remove
        </RemoveButton>
        <ThunkButton onClick={() => onDisplayAlertClicked(todo.text)}>
          Sync Thunk
        </ThunkButton>
      </ButtonsContainer>
    </Container>
  )
}

export default TodoListItem

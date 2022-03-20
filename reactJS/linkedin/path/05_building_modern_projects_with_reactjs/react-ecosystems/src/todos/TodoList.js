import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import NewTodoForm from './NewTodoForm'
import TodoListItem from './TodoListItem'
import {
  getCompleteTodos,
  getIncompleteTodos,
  getTodosLoading,
} from './selectors'
import {
  displayAlert,
  loadTodos,
  removeTodoRequest,
  setTodoCompletedRequest,
} from './thunks'

const ListWrapper = styled.div`
  max-width: 700px;
  margin: auto;
`

const TodoList = ({
  completedTodos,
  incompleteTodos,
  isLoading,
  onCompletedPressed,
  onDisplayAlertClicked,
  onRemovePressed,
  startLoadingTodos,
}) => {
  useEffect(() => {
    startLoadingTodos()
  }, [])

  if (isLoading) return <div>Loading todos...</div>

  return (
    <ListWrapper>
      <NewTodoForm />
      <h3>Incomplete</h3>
      {incompleteTodos.map((todo, idx) => (
        <TodoListItem
          key={idx}
          onCompletedPressed={onCompletedPressed}
          onDisplayAlertClicked={onDisplayAlertClicked}
          onRemovePressed={onRemovePressed}
          todo={todo}
        />
      ))}
      <h3>Complete</h3>
      {completedTodos.map((todo, idx) => (
        <TodoListItem
          key={idx}
          onCompletedPressed={onCompletedPressed}
          onDisplayAlertClicked={onDisplayAlertClicked}
          onRemovePressed={onRemovePressed}
          todo={todo}
        />
      ))}
    </ListWrapper>
  )
}

const mapStateToProps = (state) => ({
  completedTodos: getCompleteTodos(state),
  isLoading: getTodosLoading(state),
  incompleteTodos: getIncompleteTodos(state),
})

const mapDispatchToProps = (dispatch) => ({
  onCompletedPressed: (id) => dispatch(setTodoCompletedRequest(id)),
  onDisplayAlertClicked: (text) => dispatch(displayAlert(text)),
  onRemovePressed: (id) => dispatch(removeTodoRequest(id)),
  startLoadingTodos: () => dispatch(loadTodos()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)

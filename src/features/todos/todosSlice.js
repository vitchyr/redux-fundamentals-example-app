import { client } from '../../api/client'
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = []


export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
            return [...state, action.payload]
        }
        case 'todos/todoToggled': {
            return state.map(todo => {
                if (todo.id !== action.payload) {
                    return todo
                }

                return {
                    ...todo,
                    completed: !todo.completed
                }
            })
        }
        case 'todos/colorSelected': {
            const { color, todoId } = action.payload
            return state.map((todo) => {
                if (todo.id !== todoId) {
                    return todo
                }
                return {
                    ...todo,
                    color
                }
            })
        }
        case 'todos/todoDeleted': {
            return state.filter((todo) => todo.id !== action.payload)
        }
        case 'todos/allCompleted': {
            return state.map((todo) => {
                return { ...todo, completed: true }
            })
        }
        case 'todos/completedCleared': {
            return state.filter((todo) => !todo.completed)
        }
        case 'todos/todosLoaded': {
          // Replace the existing state entirely by returning the new value
          return action.payload
        }
        default:
            return state
    }
}

export const todoAdded = todo => {
  return {
    type: 'todos/todoAdded',
    payload: todo
  }
}

export const todosLoaded = todos => {
    return {
        type: 'todos/todosLoaded',
        payload: todos
    }
}


export const fetchTodos = () => async dispatch => {
    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
}


// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  // And then creates and returns the async thunk function:
  return async function saveNewTodoThunk(dispatch, getState) {
    // ✅ Now we can use the text value and send it to the server
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todoAdded(response.todo))
  }
}

export const selectTodoIds = createSelector(
    state => state.todos,
    todo => todo.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
    state => state.todos,
    state => state.filters,
    (todo, filters) => {
        const { status, colors } = filters
        const showAllCompletions = status === StatusFilters.All
        if (showAllCompletions && colors.length === 0) {
            return todo
        }
        const desiredCompletedStatus = status === StatusFilters.Completed
        return todo.filter(todo => {
            const statusMatches = showAllCompletions ||  todo.completed === desiredCompletedStatus
            const colorMatches = todo.color === 0 || colors.includes(todo.color)
            return statusMatches && colorMatches
        })
    }
)

export const selectFilteredTodoIds = createSelector(
    selectFilteredTodos,
    todo => todo.map(todo => todo.id)
)

export const selectTodos = state => state.todos

export const selectTodosById = (state, todoId) => {
    return selectTodos(state).find(todo => todo.id === todoId)
}

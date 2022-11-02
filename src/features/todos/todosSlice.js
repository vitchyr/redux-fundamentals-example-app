import { client } from '../../api/client'
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'
import {
    createSlice, createAsyncThunk, createEntityAdapter
} from '@reduxjs/toolkit'

const todosAdapter = createEntityAdapter()

const initialState = todosAdapter.getInitialState({
  status: 'idle'
})

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await client.get('/fakeApi/todos')
    return response.todos
})

export const saveNewTodo = createAsyncThunk('todos/saveNewtodo', async (text) => {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    return response.todo
})


const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        todoAdded(state, action) {
            const todo = action.payload
            state.entities[todo.id] = todo
        },
        todoToggled(state, action) {
            const todoId = action.payload
            const todo = state.entities[todoId]
            todo.completed = !todo.completed
        },
        todoColorSelected: {
            reducer(state, action) {
                const { color, todoId } = action.payload
                state.entities[todoId].color = color
            },
            prepare(todoId, color) {
                return {
                    payload: { todoId, color }
                }
            }
        },
        todoDeleted: todosAdapter.removeOne,
        allTodosCompleted(state, action) {
            Object.values(state.entities).forEach(todo => {
                todo.completed = true
            })
        },
        completedTodosCleared(state, action) {
            const completedIds = Object.values(state.entities)
                .filter(todo => todo.completed)
                .map(todo => todo.id)
            todosAdapter.removeMany(state, completedIds)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                todosAdapter.setAll(state, action.payload)
                state.status = 'idle'
            })
            .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
    }
})


export const {
  allTodosCompleted,
  completedTodosCleared,
  todoAdded,
  todoColorSelected,
  todoDeleted,
  todoToggled
} = todosSlice.actions
export default todosSlice.reducer

// Selectors
export const {
    selectAll: selectTodos,
    selectById: selectTodoById 
} = todosAdapter.getSelectors(state => state.todos)

export const selectTodoEntities = state => state.todos.entities

export const selectTodoIds = createSelector(
    selectTodos,
    todo => todo.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
    selectTodos,
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
            const colorMatches = colors.length === 0 || colors.includes(todo.color)
            return statusMatches && colorMatches
        })
    }
)

export const selectFilteredTodoIds = createSelector(
    selectFilteredTodos,
    todo => todo.map(todo => todo.id)
)

export const selectStatus = state => state.todos.status

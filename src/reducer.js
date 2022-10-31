import { combineReducers } from 'redux'
import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const rootReducer = combineReducers({
    todos: todosReducer,
    filters: filtersReducer,
})
export default rootReducer

//export default function rootReducer(state = {}, action) {
    //return {
        //todos: todosReducer(state.todos, action),
        //filters: filtersReducer(state.filters, action),
    //}
//}

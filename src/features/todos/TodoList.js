import React from 'react'
import { useSelector } from 'react-redux'

import { selectFilteredTodoIds, selectStatus } from './todosSlice'
import TodoListItem from './TodoListItem'


const TodoList = () => {
    const todoIds = useSelector(selectFilteredTodoIds)
    const loadingStatus = useSelector(selectStatus)

    if (loadingStatus === 'loading') {
        console.log("loading todos")
        return (
            <div className="todo-list">
                <div className="loader" />
            </div>
        )
    }

    const renderedListItems = todoIds.map((todoId) => {
        return <TodoListItem key={todoId} id={todoId} />
    })

    return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList


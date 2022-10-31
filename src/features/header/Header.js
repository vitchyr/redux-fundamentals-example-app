import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
    const [text, setText] = useState('')
    const dispatch = useDispatch()

    const handleChange = (e) => setText(e.target.value)

    const handleKeyDown = e => {
        const trimmedText = e.target.value.trim()
        if (e.key === 'Enter' && trimmedText) {
            // Create the thunk function with the text the user wrote
            // Then dispatch the thunk function itself
            dispatch(saveNewTodo(trimmedText))
            setText('')
        }
    }

    return (
      <header className="header">
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </header>
    )
}

export default Header


import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import ToDo from './Pages/ToDo'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ParentComponent from "./Components/ParentComponent"

const App = () => {
  return (
    <HashRouter>
      <ParentComponent>
        <Routes>
          <Route path="/" element={<ToDo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </ParentComponent>
    </HashRouter>
  )
}

export default App
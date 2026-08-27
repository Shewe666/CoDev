import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import JoinRoom from './pages/JoinRoom'
import EditorPage from './pages/EditorPage'



const App = () => {
  return (
  <>
  <Routes>
    <Route path="/" element={<Home />}></Route>
      <Route path="/join" element={<JoinRoom />}></Route>
      <Route path="/editor/:roomId" element={<EditorPage />}></Route>
  </Routes>
  </>
  )
}

export default App

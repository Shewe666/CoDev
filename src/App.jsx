import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import JoinRoom from './pages/JoinRoom'
import EditorPage from './pages/EditorPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './Components/ProtectedRoute'

const App = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - require login */}
        <Route path="/join" element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        } />
        <Route path="/editor/:roomId" element={
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App

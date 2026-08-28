import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import LandingPage from './pages/LandingPage'
import Interview from './pages/Interview'
import About from './pages/About'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/forgot-password" element={<Auth />} />
      <Route path="/interview" element={<Interview/>} />
      <Route path="/about" element={<About/>} />
    </Routes>
  )
}

export default App

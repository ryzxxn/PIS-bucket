import './App.css'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import Signup from './pages/signup'
import Upload from './pages/upload'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload" element={<Upload />} />
            <Route path="signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

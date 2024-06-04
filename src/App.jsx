import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/home.jsx";
import Signup from "./pages/signup.jsx";

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

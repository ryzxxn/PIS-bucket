import './App.css'
import Image from './pages/image'
import Gallery from './pages/gallery';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Image />} />
          <Route path="gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

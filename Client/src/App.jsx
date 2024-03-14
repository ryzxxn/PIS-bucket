import './App.css'
import Upload from './pages/upload'
import Download from './pages/download';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="download" element={<Download />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

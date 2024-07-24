import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Chat from './page/Chat';
import Home from './page/Home.jsx';




function App() {
  return (
    <div>

          <Routes>

  <Route path="/" element={<Home />} />
  <Route path="/chat" element={<Chat />} />
 


  </Routes>
    </div>
  )
}

export default App
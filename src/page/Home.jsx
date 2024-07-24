import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>

    <Link to="/">Home</Link>
    <br />
    <br />
    <Link to="/upload">upload</Link>
    <br />
    <Link to="/chat">Chat</Link>
    <br />
    <Link to="/video">video</Link>
      
    </div>
  )
}

export default Home
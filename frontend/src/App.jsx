import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Seat from './Seat/Seat'
import Seatingplan from './Seatingplan/Seatingplan'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Seatingplan />
      </div>
    </>
  )
}

export default App

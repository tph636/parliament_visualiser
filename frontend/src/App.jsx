import { useState } from 'react'
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

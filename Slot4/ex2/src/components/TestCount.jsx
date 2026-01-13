import { useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

export default function TestCount() {
  const [count, setCount] = useState(0)

  return (
    <div className="mt-3">
      <ButtonGroup>
        <Button variant="secondary" onClick={() => setCount(count - 1)}>-</Button>

        <Button variant="light" disabled>Count: {count}</Button>

        <Button variant="primary" onClick={() => setCount(count + 1)}>+</Button>
      </ButtonGroup> 
    </div>
  )
}

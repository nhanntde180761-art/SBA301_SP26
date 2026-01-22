import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'

function SearchByName({ onSearch }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(text)
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Row>
        <Col md={9}>
          <Form.Control
            type="text"
            placeholder="nhập tên hoa lan..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button type="submit" className="w-100">
            tìm kiếm
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchByName

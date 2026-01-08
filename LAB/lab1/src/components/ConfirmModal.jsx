import React from 'react'
import { Modal, Button } from 'react-bootstrap'

function ConfirmModal({ show, handleClose, title, body, onConfirm }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal

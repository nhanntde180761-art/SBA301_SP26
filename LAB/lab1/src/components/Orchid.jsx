import { Modal, Button, Image } from 'react-bootstrap'

function Orchid({ orchid, show, onHide }) {
  if (!orchid) return null

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{orchid.orchidName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image src={orchid.image} fluid className="mb-3" />
        <p><b>Category:</b> {orchid.category}</p>
        <p>{orchid.description}</p>
        {orchid.isSpecial && (
          <span className="badge bg-danger">special</span>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          đóng
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Orchid

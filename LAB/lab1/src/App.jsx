import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Contact from './components/Contact'
import ListOfCorchid from './components/ListOfCorchid'
import ConfirmModal from './components/ConfirmModal'
import listOfOrchid from './listofOrchid/listofOrchid.js'
import avatar from '/images/Orchid1.jpg'

function App() {
  const [page, setPage] = useState('home')
  const [selectedOrchid, setSelectedOrchid] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewDetail = (o) => {
    setSelectedOrchid(o)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedOrchid(null)
  }

  return (
    <>
      <Header setPage={setPage} />

      <div className="container mt-3">
        {page === 'home' && (
          <ListOfCorchid orchids={listOfOrchid} onViewDetail={handleViewDetail} />
        )}

        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}

        {/* Modal hiển thị chi tiết hoa lan */}
        {selectedOrchid && (
          <ConfirmModal
            show={showModal}
            handleClose={handleCloseModal}
            title={selectedOrchid.orchidName}
            body={
              <div>
                <img
                  src={selectedOrchid.image}
                  alt={selectedOrchid.orchidName}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
                <p><b>Category:</b> {selectedOrchid.category}</p>
                <p>{selectedOrchid.description}</p>
                {selectedOrchid.isSpecial && (
                  <span className="badge bg-danger mt-2">special</span>
                )}
              </div>
            }
            onConfirm={handleCloseModal}
          />
        )}
      </div>

      <Footer
        avatar={avatar}
        name="nhannt"
        email="nhanntde18076@fpt.edu.vn"
      />
    </>
  )
}

export default App

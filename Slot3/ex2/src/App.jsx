import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Contact from './components/Contact'
import Orchid from './components/Orchid'
import ListOfOrchid from './components/ListOfCorchid'
import listOfOrchid from './listofOrchid/listofOrchid.js'
import avatar from '/images/Orchid1.jpg'

function App() {
  const [page, setPage] = useState('home')
  const [selectedOrchid, setSelectedOrchid] = useState(null)

  return (
    <>
      <Header setPage={setPage} />

      <div className="container mt-3">
        {page === 'home' && (
          <ListOfOrchid
            orchid={listOfOrchid}
            onViewDetail={(o) => {
              setSelectedOrchid(o)
              setPage('detail')
            }}
          />
        )}

        {page === 'detail' && (
          <Orchid orchid={selectedOrchid} setPage={setPage} />
        )}

        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
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

import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Contact from './components/Contact'

function App() {
    const [page, setPage] = useState('home') // trang hiện tại

    return (
        <>
            <Header setPage={setPage} /> {/* truyền setPage xuống Header */}

            <div className="container mt-3">
                {page === 'home' && <h2>Trang Home</h2>}
                {page === 'about' && <About />}
                {page === 'contact' && <Contact />}
            </div>

            <Footer />
        </>
    )
}

export default App

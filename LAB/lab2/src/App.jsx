import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Orchids from './components/ListOfCorchid';
import OrchidDetail from './components/OrchidDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import About from './components/About';
import Login from './components/Login'; // 1. Phải import Login

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header-fixed">
          <NavBar />
        </header>

        <main className="main-content">
          <Routes>
            {/* 2. Trang Login xuất hiện đầu tiên khi khởi chạy */}
            <Route path="/" element={<Login />} />

            {/* 3. Trang danh sách hoa sau khi login thành công */}
            <Route 
              path="/orchids" 
              element={
                <div className="container-fluid">
                  <Header />
                  <Orchids />
                </div>
              } 
            />
            
            <Route path="/detail/:id" element={<OrchidDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer className="footer-fixed">
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;
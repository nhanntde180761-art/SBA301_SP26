import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Orchids from './components/ListOfCorchid';
import OrchidDetail from './components/OrchidDetail'; // Thêm Import này
import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import About from './components/About';
import TestCount from './components/TestCount';

function App() {
  return (
    <Router>
      <div className="app-container">
        
        {/* Thanh điều hướng cố định phía trên */}
        <header className="header-fixed">
          <NavBar />
        </header>

        {/* Nội dung chính thay đổi theo URL */}
        <main className="main-content">
          <Routes>
            {/* Trang chủ: Hiển thị Header và Danh sách hoa */}
            <Route 
              path="/" 
              element={
                <div className="container-fluid">
                  <Header />
                  <TestCount />
                  <Orchids />
                </div>
              } 
            />
            
            {/* Route mới: Trang chi tiết hoa lan (thay thế Modal) */}
            <Route path="/detail/:id" element={<OrchidDetail />} />
            
            {/* Các trang khác */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        {/* Chân trang cố định phía dưới */}
        <footer className="footer-fixed">
          <Footer />
        </footer>

      </div>
    </Router>
  );
}

export default App;
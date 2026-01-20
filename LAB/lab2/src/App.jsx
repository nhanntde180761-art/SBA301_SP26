import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// 1. IMPORT AUTH PROVIDER
import { AuthProvider } from "./context/AuthContext"; 

import NavBar from "./components/NavBar";
import Orchids from "./components/ListOfCorchid"; 
import OrchidDetail from "./components/OrchidDetail";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import About from "./components/About";
import Contact from "./components/Contact";
import MainLayout from "./components/MainLayout";

function App() {
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchText, setSearchText] = useState("");

  return (
    // 2. BỌC TOÀN BỘ TRONG AUTHPROVIDER
    <AuthProvider>
      <Router>
        <div className="app-container d-flex flex-column min-vh-100">
          <header className="header-fixed shadow-sm">
            <NavBar />
          </header>

          <main className="main-content flex-grow-1">
            <Routes>
              {/* Trang Login */}
              <Route path="/" element={<Login />} />

              {/* Nhóm trang nội bộ sử dụng MainLayout */}
              <Route
                element={
                  <MainLayout
                    setSearchText={setSearchText}
                    setFilterCategory={setFilterCategory}
                    setSortOption={setSortOption}
                  />
                }
              >
                <Route
                  path="/orchids"
                  element={
                    <Orchids
                      searchText={searchText}
                      filterCategory={filterCategory}
                      sortOption={sortOption}
                    />
                  }
                />
                <Route path="/detail/:id" element={<OrchidDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
            </Routes>
          </main>

          <footer className="footer-fixed mt-auto">
            <Footer /> 
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
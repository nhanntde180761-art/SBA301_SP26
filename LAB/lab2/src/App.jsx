import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import NavBar from "./components/NavBar";
import Orchids from "./components/ListOfCorchid"; // Sửa lại tên file nếu cần
import OrchidDetail from "./components/OrchidDetail";
import Footer from "./components/Footer";
import Login from "./components/Login";
import About from "./components/About";
import Contact from "./components/Contact";
import MainLayout from "./components/MainLayout"; // Import component vừa tách

function App() {
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchText, setSearchText] = useState("");

  return (
    <Router>
      <div className="app-container d-flex flex-column min-vh-100">
        <header className="header-fixed shadow-sm">
          <NavBar />
        </header>

        <main className="main-content flex-grow-1">
          <Routes>
            {/* Trang Login không nằm trong MainLayout nên không có Banner/Search */}
            <Route path="/" element={<Login />} />

            {/* Sử dụng MainLayout cho nhóm trang nội bộ */}
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
  );
}

export default App;

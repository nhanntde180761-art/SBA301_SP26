import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router';
import ListOfOrchids from './components/ListOfOrchids.jsx';
import EditOrchid from './components/EditOrchid.jsx';
import NavBar from './components/NavBar';

function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' element={<ListOfOrchids/>}/>
        <Route path='edit/:id' element={<EditOrchid/>}/>
      </Routes>
    </>
  )
}

export default App

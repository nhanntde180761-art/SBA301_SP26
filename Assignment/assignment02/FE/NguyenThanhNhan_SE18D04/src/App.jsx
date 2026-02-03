import { useState } from 'react'
import './App.css'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import NewsManagement from './pages/NewsManagement';
import CategoryManagement from "./pages/CategoryManagement";
import TagManagement from './pages/TagManagement';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="tag" element={<TagManagement />} />
          <Route path="category" element={<CategoryManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<Profile />} />
        </Route>
        <Route path="/staff" element={<AdminLayout />}> 
          {/* Staff có thể dùng chung AdminLayout hoặc tạo StaffLayout riêng */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="tag" element={<TagManagement />} />
          <Route path="settings" element={<Profile />} />
          {/* Staff thường không có quyền quản lý User hoặc Category nên ta không để ở đây */}
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
export default App;
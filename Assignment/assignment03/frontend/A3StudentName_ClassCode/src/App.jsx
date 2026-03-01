import { Routes, Route, Navigate } from 'react-router-dom';
import StaffDashboard from './component/StaffDashboard';
import RoomManagement from './page/RoomManagement';
import CustomerManagement from './page/CustomerManagement';
import BookingManagement from './page/BookingManagement';
import Register from './page/Register';
import CustomerNavbar from './component/CustomerNavbar';
import Home from './page/Home';
import Login from './page/Login';
import CreateBooking from './page/CreateBooking';
import BookingHistory from './page/BookingHistory';
import CustomerProfile from './page/CustomerProfile';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Cấu hình Route lồng nhau cho Dashboard */}
            <Route path="/dashboard" element={<StaffDashboard />}>
                {/* Mặc định khi vào /dashboard sẽ chuyển đến /dashboard/rooms */}
                <Route index element={<Navigate to="rooms" />} />

                {/* Các trang con: khi vào /dashboard/rooms thì Sidebar vẫn giữ nguyên */}
                <Route path="rooms" element={<RoomManagement />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="bookings" element={<BookingManagement />} />
            </Route>

            {/* Các trang khác cho Customer */}
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<><CustomerNavbar /><Home /></>} />
            <Route path="/booking/create" element={<><CustomerNavbar /><CreateBooking /></>} />
            <Route path="/booking/history" element={<><CustomerNavbar /><BookingHistory /></>} />
            <Route path="/customer/profile" element={<><CustomerNavbar /><CustomerProfile /></>} />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
}
export default App;
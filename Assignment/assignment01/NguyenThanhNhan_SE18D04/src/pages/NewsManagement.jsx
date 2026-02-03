import React, { useState } from 'react'; // Đảm bảo import đúng
import { Table, Button } from 'react-bootstrap';
import NewsModal from '../components/NewsModal';

const NewsManagement = () => {
    // 1. Khai báo Hook LUÔN nằm ở đầu hàm Component
    const [show, setShow] = useState(false);
    const [news, setNews] = useState([
        { id: 1, title: 'Khai giảng kỳ Spring 2026', categoryId: 1, status: 1 }
    ]);
    const [selectedNews, setSelectedNews] = useState(null);

    const handleClose = () => setShow(false);
    
    const handleShowAdd = () => {
        setSelectedNews(null);
        setShow(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            setNews(news.filter(n => n.id !== id));
        }
    };

    // 2. Phần Return render giao diện
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>News Management</h3>
                <Button variant="success" onClick={handleShowAdd}>+ Add News</Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {news.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Gọi Component Modal */}
            <NewsModal 
                show={show} 
                handleClose={handleClose} 
                selectedNews={selectedNews}
                categories={[{id: 1, name: 'Education'}]}
            />
        </div>
    );
};

export default NewsManagement;
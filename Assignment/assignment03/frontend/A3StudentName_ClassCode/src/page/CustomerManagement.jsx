import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Spinner, Card, Badge, Modal } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // Trạng thái đã xong

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error("Lỗi fetch:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Mở form xác nhận
    const handleOpenConfirm = (customer) => {
        setSelectedCustomer(customer);
        setIsSuccess(false); // Reset lại trạng thái thành công
        setShowModal(true);
    };

    // Thực hiện khóa/mở khóa
    const handleConfirmAction = async () => {
        if (!selectedCustomer) return;
        const newStatus = selectedCustomer.customerStatus === 1 ? 2 : 1;
        
        setIsProcessing(true);
        try {
            await axiosClient.post(`/customers/setStatus/${selectedCustomer.id}`, null, {
                params: { status: newStatus }
            });
            
            setCustomers(prev => prev.map(c => 
                c.id === selectedCustomer.id ? { ...c, customerStatus: newStatus } : c
            ));

            // Thay vì alert, mình đánh dấu là đã thành công
            setIsSuccess(true); 
        } catch (err) {
            console.error(err);
            // Có thể thêm state isError nếu muốn báo lỗi trên Modal luôn
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return (
        <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p>Đang tải dữ liệu...</p>
        </div>
    );

    return (
        <div className="p-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Quản lý Khách hàng</h5>
                </Card.Header>
                <Card.Body>
                    <Table striped hover responsive className="align-middle">
                        <thead>
                            <tr>
                                <th>Mã số</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c) => (
                                <tr key={c.id}>
                                    <td>#{c.id}</td>
                                    <td className="fw-bold">{c.customerFullName}</td>
                                    <td>{c.emailAddress}</td>
                                    <td>
                                        <Badge bg={c.customerStatus === 1 ? "success" : "danger"}>
                                            {c.customerStatus === 1 ? "Hoạt động" : "Đã khóa"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button 
                                            variant={c.customerStatus === 1 ? "outline-danger" : "outline-success"} 
                                            size="sm"
                                            onClick={() => handleOpenConfirm(c)}
                                        >
                                            {c.customerStatus === 1 ? "Khóa" : "Mở khóa"}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* MODAL ĐA NĂNG: XÁC NHẬN -> ĐANG CHẠY -> THÀNH CÔNG */}
            <Modal show={showModal} onHide={() => !isProcessing && setShowModal(false)} centered border="none">
                <Modal.Header closeButton={!isProcessing}>
                    <Modal.Title>{isSuccess ? "Thông báo" : "Xác nhận"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    {isProcessing ? (
                        <div>
                            <Spinner animation="border" variant="primary" className="mb-2" />
                            <p className="mb-0">Hệ thống đang xử lý...</p>
                        </div>
                    ) : isSuccess ? (
                        <div>
                            <div className="text-success mb-2" style={{fontSize: '2rem'}}>
                                <i className="bi bi-check-circle-fill">✅</i> 
                            </div>
                            <h5>Thao tác thành công!</h5>
                            <p className="text-muted">Trạng thái tài khoản đã được cập nhật.</p>
                        </div>
                    ) : (
                        <p className="mb-0">
                            Bạn có chắc chắn muốn <b>{selectedCustomer?.customerStatus === 1 ? "KHÓA" : "MỞ KHÓA"}</b> tài khoản của <b>{selectedCustomer?.customerFullName}</b>?
                        </p>
                    )}
                </Modal.Body>
                
                {!isProcessing && (
                    <Modal.Footer className="justify-content-center border-0 pb-4">
                        {isSuccess ? (
                            <Button variant="dark" className="px-5" onClick={() => setShowModal(false)}>
                                Đóng
                            </Button>
                        ) : (
                            <>
                                <Button variant="light" onClick={() => setShowModal(false)}>Hủy</Button>
                                <Button variant="primary" className="px-4" onClick={handleConfirmAction}>Đồng ý</Button>
                            </>
                        )}
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
};

export default CustomerManagement;
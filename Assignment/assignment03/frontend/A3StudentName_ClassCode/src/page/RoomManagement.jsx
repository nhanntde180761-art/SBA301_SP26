import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Badge, Alert, Spinner, Modal, Form, ListGroup } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState({ content: '', type: '' });
    const [roomTypes, setRoomTypes] = useState([]);

    const [showAdd, setShowAdd] = useState(false);
    const [newData, setNewData] = useState({
        roomNumber: '',
        roomTypeId: '', // Lưu ID loại phòng được chọn
        roomPrice: '',
        roomCapacity: '',
        roomDescription: '',
        status: 1 // Mặc định là Trống
    });

    const loadRoomTypes = useCallback(async () => {
        try {
            const res = await axiosClient.get('/roomtypes');
            setRoomTypes(res.data);
        } catch (err) {
            console.error("Lỗi tải loại phòng", err);
        }
    }, []);

    // State cho Modal Xem chi tiết
    const [showDetail, setShowDetail] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // State cho Modal Sửa
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState({});

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);


    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi dữ liệu về endpoint /rooms/add (hoặc tùy bạn đặt ở Controller)
            await axiosClient.post('/rooms/add', newData);
            setMsg({ content: 'Thêm phòng mới thành công!', type: 'success' });
            setShowAdd(false);
            setNewData({ roomNumber: '', roomTypeId: '', roomPrice: '', roomCapacity: '', roomDescription: '', status: 1 });
            loadRooms();
        } catch (err) {
            setMsg({ content: 'Lỗi khi thêm phòng mới', type: 'danger' });
        }
    };

    // 1. Load danh sách phòng
    const loadRooms = useCallback(async () => {
        try {
            const res = await axiosClient.get('/rooms');
            setRooms(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setMsg({ content: 'Lỗi tải danh sách phòng', type: 'danger' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadRooms(); }, [loadRooms]);
    useEffect(() => {
        loadRooms();
        loadRoomTypes();
    }, [loadRooms, loadRoomTypes]);


    // 2. Xử lý mở Modal Sửa
    const handleEditClick = (room) => {
        setEditData({ ...room });
        setShowEdit(true);
    };

    // 3. Xử lý thay đổi Input khi sửa
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        // Chuyển status hoặc number về số nguyên
        const finalValue = (name === 'status' || type === 'number') ? (value === '' ? '' : parseInt(value)) : value;
        setEditData({ ...editData, [name]: finalValue });
    };

    // 4. Gửi yêu cầu Cập nhật (POST)
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/rooms/update', editData);
            setMsg({ content: `Cập nhật phòng ${editData.roomNumber} thành công!`, type: 'success' });
            setShowEdit(false);
            loadRooms(); 
        } catch (err) {
            setMsg({ content: 'Lỗi khi cập nhật thông tin phòng', type: 'danger' });
        }
    };

    // 6. Xử lý Xóa phòng (MỚI THÊM)
    // Bước 1: Khi nhấn nút Xóa trên bảng, chỉ mở Modal và nạp dữ liệu
    const handleShowDelete = (room) => {
        setRoomToDelete(room);
        setShowDeleteModal(true);
    };

    // Bước 2: Hàm thực sự gọi API khi nhấn "Xác nhận" trên Modal
    const handleDelete = async () => {
        if (!roomToDelete) return;

        try {
            await axiosClient.delete(`/rooms/${roomToDelete.roomId}`);
            setMsg({
                content: `Đã cập nhật trạng thái phòng: ${roomToDelete.roomNumber} thành công!`,
                type: 'success'
            });
            loadRooms(); // Tải lại danh sách
        } catch (err) {
            setMsg({
                content: `Lỗi: Không thể xử lý phòng ${roomToDelete.roomNumber}.`,
                type: 'danger'
            });
        } finally {
            setShowDeleteModal(false); // Đóng modal
            setRoomToDelete(null);     // Xóa dữ liệu tạm
        }
    };

    // 5. Hàm render Badge trạng thái (1: Trống, 2: Đã đặt, 3: Khóa)
    const renderStatus = (status) => {
        switch (status) {
            case 1: return <Badge bg="success">Trống</Badge>;
            case 2: return <Badge bg="danger">Đã đặt</Badge>;
            case 3: return <Badge bg="secondary">Đã khóa</Badge>;
            default: return <Badge bg="dark">N/A</Badge>;
        }
    };

    if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" variant="primary" />;

    return (
        <div className="mt-3 container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-primary">Quản lý danh mục Phòng</h4>
                <Button variant="success" onClick={() => setShowAdd(true)}>+ Thêm phòng mới</Button>
            </div>

            {msg.content && <Alert variant={msg.type} dismissible onClose={() => setMsg({content:'', type:''})}>{msg.content}</Alert>}

            <Table striped hover responsive className="shadow-sm align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>Số Phòng</th>
                        <th>Loại Phòng</th>
                        <th>Giá ($)</th>
                        <th>Trạng thái</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map(r => (
                        <tr key={r.roomId}>
                            <td className="fw-bold">{r.roomNumber}</td>
                            <td>{r.roomType}</td>
                            <td className="text-primary fw-bold">{r.roomPrice}</td>
                            <td>{renderStatus(r.status)}</td>
                            <td className="text-center">
                                <Button variant="outline-info" size="sm" className="me-2" onClick={() => { setSelectedRoom(r); setShowDetail(true); }}>Chi tiết</Button>
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(r)}>Sửa</Button>
                                {/* CẬP NHẬT NÚT XÓA TẠI ĐÂY */}
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleShowDelete(r)} // Truyền cả object room vào
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* --- MODAL XEM CHI TIẾT --- */}
            <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>Thông tin phòng {selectedRoom?.roomNumber}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRoom && (
                        <ListGroup variant="flush">
                            <ListGroup.Item><strong>Mã phòng:</strong> {selectedRoom.roomId}</ListGroup.Item>
                            <ListGroup.Item><strong>Số phòng:</strong> {selectedRoom.roomNumber}</ListGroup.Item>
                            <ListGroup.Item><strong>Mã loại:</strong> {selectedRoom.roomTypeId}</ListGroup.Item>
                            <ListGroup.Item><strong>Loại:</strong> {selectedRoom.roomType}</ListGroup.Item>
                            <ListGroup.Item><strong>Mô tả loại:</strong> {selectedRoom.typeDescription}</ListGroup.Item>
                            <ListGroup.Item><strong>Mô tả phòng:</strong> {selectedRoom.roomDescription || "Chưa có mô tả"}</ListGroup.Item>
                            <ListGroup.Item><strong>Sức chứa:</strong> {selectedRoom.roomCapacity}</ListGroup.Item>
                            <ListGroup.Item><strong>Ghi chú:</strong> {selectedRoom.roomNote || "Không có"}</ListGroup.Item>
                            <ListGroup.Item><strong>Giá:</strong> {selectedRoom.roomPrice}$ / ngày</ListGroup.Item>
                        </ListGroup>
                    )}
                </Modal.Body>
            </Modal>

            {/* --- MODAL SỬA PHÒNG --- */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)} centered size="lg">
                <Form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chỉnh sửa phòng: {editData.roomNumber}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Mã phòng (Không được sửa)</Form.Label>
                                    <Form.Control type="text" value={editData.roomId || ''} readOnly className="bg-light" />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Số phòng</Form.Label>
                                    <Form.Control name="roomNumber" value={editData.roomNumber || ''} onChange={handleInputChange} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Mã loại (Không được sửa)</Form.Label>
                                    <Form.Control type="text" value={editData.roomTypeId || ''} readOnly className="bg-light" />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Loại phòng (Không được sửa)</Form.Label>
                                    <Form.Control type="text" value={editData.roomType || ''} readOnly className="bg-light" />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Mô tả loại (Không được sửa)</Form.Label>
                                    <Form.Control type="text" value={editData.typeDescription || ''} readOnly className="bg-light" />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Sức chứa (Người)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="roomCapacity"
                                        value={editData.roomCapacity || ''}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số người tối đa..."
                                        required
                                        min="1"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Giá phòng ($)</Form.Label>
                                    <Form.Control name="roomPrice" type="number" value={editData.roomPrice || ''} onChange={handleInputChange} required />
                                </Form.Group>
                            </div>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả chi tiết phòng</Form.Label>
                            <Form.Control name="roomDescription" as="textarea" rows={2} value={editData.roomDescription || ''} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú (Không được sửa)</Form.Label>
                            <Form.Control name="roomNote" value={editData.roomNote || ''} readOnly className="bg-light" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEdit(false)}>Hủy</Button>
                        <Button variant="primary" type="submit">Lưu thông tin</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* --- MODAL XÁC NHẬN XÓA/CẬP NHẬT TRẠNG THÁI --- */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Xác nhận thay đổi hệ thống</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <p className="text-center fs-5">
                        Bạn có chắc chắn muốn xử lý phòng <strong>{roomToDelete?.roomNumber}</strong>?
                    </p>
                    <Alert variant="warning">
                        <strong>Lưu ý:</strong> Nếu phòng đã có dữ liệu phát sinh (hóa đơn, đặt phòng), hệ thống sẽ tự động
                        <span className="text-danger fw-bold"> Cập nhật trạng thái</span> thay vì xóa khỏi cơ sở dữ liệu.
                    </Alert>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Hủy bỏ
                    </Button>
                    <Button variant="danger" onClick={handleDelete} style={{ minWidth: '120px' }}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* --- MODAL THÊM PHÒNG MỚI --- */}
            <Modal show={showAdd} onHide={() => setShowAdd(false)} centered size="lg">
                <Form onSubmit={handleAddSubmit}>
                    <Modal.Header closeButton className="bg-success text-white">
                        <Modal.Title>Thêm phòng mới vào hệ thống</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Số phòng</Form.Label>
                                    <Form.Control
                                        name="roomNumber"
                                        onChange={(e) => setNewData({ ...newData, roomNumber: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại phòng</Form.Label>
                                    <Form.Select
                                        name="roomTypeId"
                                        required
                                        onChange={(e) => setNewData({ ...newData, roomTypeId: parseInt(e.target.value) })}
                                    >
                                        <option value="">-- Chọn loại phòng --</option>
                                        {roomTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.roomTypeName} (Mã: {type.id})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Sức chứa</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="roomCapacity"
                                        onChange={(e) => setNewData({ ...newData, roomCapacity: parseInt(e.target.value) })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Giá phòng ($)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="roomPrice"
                                        onChange={(e) => setNewData({ ...newData, roomPrice: parseFloat(e.target.value) })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả phòng</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                onChange={(e) => setNewData({ ...newData, roomDescription: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAdd(false)}>Hủy</Button>
                        <Button variant="success" type="submit">Xác nhận thêm</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default RoomManagement;
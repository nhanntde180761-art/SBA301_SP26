import React, { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const NewsModal = ({ show, handleClose, handleSave, selectedNews, categories }) => {
    // selectedNews: nếu có dữ liệu thì là Update, nếu null thì là Create
    const { register, handleSubmit, reset, setValue } = useForm();

    // Cập nhật dữ liệu vào form khi mở Modal để Edit
    useEffect(() => {
        if (selectedNews) {
            setValue('title', selectedNews.title);
            setValue('categoryId', selectedNews.categoryId);
            setValue('content', selectedNews.content);
            setValue('status', selectedNews.status);
        } else {
            reset({ title: '', categoryId: '', content: '', status: 1 });
        }
    }, [selectedNews, setValue, reset]);

    const onSubmit = (data) => {
        handleSave(data); // Gửi dữ liệu về NewsManagement.jsx xử lý
        reset();
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    {selectedNews ? 'Update News Article' : 'Create New News Article'}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>News Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter news title" 
                            {...register('title', { required: true })} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select {...register('categoryId', { required: true })}>
                            <option value="">-- Select Category --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={4} 
                            placeholder="News content..." 
                            {...register('content', { required: true })} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Check 
                            type="switch" 
                            label={selectedNews ? "Active" : "Set as Active"} 
                            defaultChecked={true}
                            {...register('status')}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {selectedNews ? 'Save Changes' : 'Post News'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default NewsModal;
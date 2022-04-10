import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function DeleteModal({ show, id, onClose, onDelete }) {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar comprobante</Modal.Title>
            </Modal.Header>
            <Modal.Body>Desea eliminar el comprobante?</Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>

    );
}

export default DeleteModal;
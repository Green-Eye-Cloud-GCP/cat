import React from 'react';
import { Button, Form, Container } from 'react-bootstrap';

// Considerar multples origenes
const Nuevo = () => {
    return (
        <Container className='bg-light border py-5'>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type="date" placeholder="Enter email" />
                </Form.Group>

                
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Campo origen</Form.Label>
                    <Form.Select
                        aria-label='Default select example'
                    >
                        <option>Open this select menu</option>
                        <option value='1'>One</option>
                        <option value='2'>Two</option>
                        <option value='3'>Three</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Label>CAT destino</Form.Label>
                    <Form.Select
                        aria-label='Default select example'
                    >
                        <option>Open this select menu</option>
                        <option value='1'>One</option>
                        <option value='2'>Two</option>
                        <option value='3'>Three</option>
                    </Form.Select>
                </Form.Group>


                <Form.Group className="mb-3" controlId="cantidad">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control type="number" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formFile">
                    <Form.Label>PDF/Imagen</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
                

                <Button className='float-end' variant="primary">Guardar</Button>
            </Form>
        </Container>
    )
}

export default Nuevo;
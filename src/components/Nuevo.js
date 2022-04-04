import React, { useState } from 'react';
import { Button, Form, Container, Col, Row, ListGroup } from 'react-bootstrap';

const Nuevo = () => {

    const [validated, setValidated] = useState(false);

    const [fecha, setFecha] = useState('');
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [cantidad, setCantidad] = useState('');

    const [origenes, setOrigenes] = useState([]);

    const addOrigen = () => {
        if (!origen) { return }
        setOrigenes([
            ...origenes,
            origen
        ])
    }

    const handleSubmit = (event) => {
        //const form = event.currentTarget;
        //form.checkValidity() === false

        event.preventDefault();
        event.stopPropagation();

        setValidated(true);
      };

    return (
        <Container className='bg-light border py-3'>

            <h1 className='text-center'>Nuevo comprobante</h1>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className='my-3' controlId='formFecha'>
                    <Form.Label><h6>Fecha</h6></Form.Label>
                    <Form.Control
                        type='date'
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </Form.Group>

                <Container className='border py-3'>
                    <h6>Origenes</h6>

                    {
                        origenes.length > 0 &&
                        <ListGroup>
                            {origenes.map((origen) => { return <ListGroup.Item key={origen}>{origen}</ListGroup.Item> })}
                        </ListGroup>
                    }

                    <Form.Group className='my-3' controlId='formOrigenes'>
                        <Form.Label><h6>Campo origen</h6></Form.Label>
                        <Row>
                            <Col>
                                <Form.Select
                                    value={origen}
                                    onChange={(e) => setOrigen(e.target.value)}
                                >
                                    <option value=''>Open this select menu</option>
                                    <option value='1'>One</option>
                                    <option value='2'>Two</option>
                                    <option value='3'>Three</option>
                                </Form.Select>
                            </Col>
                            <Col xs={'auto'}>
                                <Button
                                    className='float-end'
                                    variant='primary'
                                    onClick={addOrigen}
                                >Agregar</Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Container>

                <Form.Group className='my-3' controlId='formBasicCheckbox'>
                    <Form.Label><h6>CAT destino</h6></Form.Label>
                    <Form.Select
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        required
                    >
                        <option value=''>Open this select menu</option>
                        <option value='1'>One</option>
                        <option value='2'>Two</option>
                        <option value='3'>Three</option>
                    </Form.Select>
                </Form.Group>


                <Form.Group className='my-3' controlId='cantidad'>
                    <Form.Label><h6>Cantidad</h6></Form.Label>
                    <Form.Control
                        type='number'
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className='my-3' controlId='formFile'>
                    <Form.Label><h6>PDF/Imagen</h6></Form.Label>
                    <Form.Control
                        type='file'
                        required
                    />
                </Form.Group>


                <Row className='mt-5'>
                    <Col><Button className='float-end' variant='primary' type="submit">Guardar</Button></Col>
                </Row>
            </Form>
        </Container>
    )
}

export default Nuevo;
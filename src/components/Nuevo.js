import React, { useState } from 'react';
import { Button, Form, Container, Col, Row } from 'react-bootstrap';
import { Trash, PlusSquare } from 'react-bootstrap-icons';

const Nuevo = () => {

    const [validated, setValidated] = useState(false);

    const [fecha, setFecha] = useState('');
    const [destino, setDestino] = useState('');
    const [cantidad, setCantidad] = useState('');

    const [origenes, setOrigenes] = useState(['', '']);

    const handleSelectChange = (value, index) => {
        const list = [...origenes];
        list[index] = value;
        setOrigenes(list);
    };

    const delOrigen = (index) => {
        const list = [...origenes];
        list.splice(index, 1);
        setOrigenes(list)
    }

    const addOrigen = () => {
        setOrigenes([
            ...origenes,
            ''
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
                    <Form.Label><h5>Fecha</h5></Form.Label>
                    <Form.Control
                        type='date'
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </Form.Group>

                <Container className='border py-3'>
                    <h5>Origenes</h5>


                    <Form.Group className='my-3' controlId='formOrigenes'>
                        {
                            origenes.map((origen, i) => {
                                return (
                                    <Row key={i} className='my-3'>
                                        <Col>
                                            <Form.Select
                                                value={origen}
                                                onChange={(e) => handleSelectChange(e.target.value, i)}
                                                required
                                            >
                                                <option value=''>Open this select menu</option>
                                                <option value='1'>One</option>
                                                <option value='2'>Two</option>
                                                <option value='3'>Three</option>
                                            </Form.Select>
                                        </Col>
                                        {
                                            i > 0 &&
                                            <Col xs={'auto'}>
                                                <Button className='float-end' variant='danger' onClick={() => delOrigen(i)}>
                                                    <Trash />
                                                </Button>
                                            </Col>
                                        }
                                    </Row>
                                )
                            })
                        }
                    </Form.Group>

                    <Row>
                        <Col>
                            <Button className='float-end' variant='success' onClick={addOrigen}>
                                <PlusSquare />
                            </Button>
                        </Col>
                    </Row>

                </Container>

                <Form.Group className='my-3' controlId='formBasicCheckbox'>
                    <Form.Label><h5>CAT destino</h5></Form.Label>
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
                    <Form.Label><h5>Cantidad</h5></Form.Label>
                    <Form.Control
                        type='number'
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className='my-3' controlId='formFile'>
                    <Form.Label><h5>PDF/Imagen</h5></Form.Label>
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
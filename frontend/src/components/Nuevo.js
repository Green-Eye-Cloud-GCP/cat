import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, Form, Container, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Trash, PlusSquare } from 'react-bootstrap-icons';

const Nuevo = () => {

    const [validated, setValidated] = useState(false);
    const [opcionesOrigenes, setOpcionesOrigenes] = useState([]);
    const [opcionesDestinos, setOpcionesDestinos] = useState([]);

    const [fecha, setFecha] = useState('');
    const [destino, setDestino] = useState('');
    const [cantidad, setCantidad] = useState('');

    const [origenes, setOrigenes] = useState(['', '60dc6cf46f749500154c1d97']);

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

    useEffect(() => {
        Axios.get('http://localhost:3000/back/gps', {
            params: {
                org: 'adblick',
                types: ['Deposito insumos', 'Campo']
            }
        })
            .then((response) => {
                setOpcionesOrigenes(response.data.filter(opcion => opcion.type !== 'CAT'));
                setOpcionesDestinos(response.data.filter(opcion => opcion.type === 'CAT'));
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleSubmit = (event) => {
        //const form = event.currentTarget;
        //form.checkValidity() === false

        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        console.log(origenes);
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
                                                <option value=''>Seleccione un origen</option>
                                                {
                                                    opcionesOrigenes.map((opcion) => {
                                                        return <option key={opcion._id} value={opcion._id}>{opcion.name}</option>
                                                    })
                                                }
                                            </Form.Select>
                                        </Col>
                                        {
                                            i > 0 &&
                                            <Col xs={'auto'}>
                                                <OverlayTrigger
                                                    placement='right'
                                                    overlay={
                                                        <Tooltip>
                                                            Eliminar origen
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button className='float-end' variant='danger' onClick={() => delOrigen(i)}>
                                                        <Trash />
                                                    </Button>
                                                </OverlayTrigger>
                                            </Col>
                                        }
                                    </Row>
                                )
                            })
                        }
                    </Form.Group>

                    <Row>
                        <Col>
                            <OverlayTrigger
                                placement='right'
                                overlay={
                                    <Tooltip>
                                        Agregar origen
                                    </Tooltip>
                                }
                            >
                                <Button className='float-end' variant='success' onClick={addOrigen}>
                                    <PlusSquare />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>

                </Container>

                <Form.Group className='my-3' controlId='formDestinos'>
                    <Form.Label><h5>CAT destino</h5></Form.Label>
                    <Form.Select
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        required
                    >
                        <option value=''>Seleccione un destino</option>
                        {
                            opcionesDestinos.map((opcion) => {
                                return <option key={opcion._id} value={opcion._id}>{opcion.name}</option>
                            })
                        }
                    </Form.Select>
                </Form.Group>


                <Form.Group className='my-3' controlId='formCantidad'>
                    <Form.Label><h5>Cantidad</h5></Form.Label>
                    <Form.Control
                        type='number'
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className='my-3' controlId='formArchivo'>
                    <Form.Label><h5>PDF/Imagen</h5></Form.Label>
                    <Form.Control
                        type='file'
                        required
                    />
                </Form.Group>


                <Row className='mt-5'>
                    <Col><Button className='float-end' variant='primary' type='submit'>Guardar</Button></Col>
                </Row>
            </Form>
        </Container>
    )
}

export default Nuevo;
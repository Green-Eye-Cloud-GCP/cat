import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Row, Col, Pagination, Placeholder } from 'react-bootstrap';
import { Trash, Pencil, Eye } from 'react-bootstrap-icons';

const Home = () => {

    const [comprobantes, setComprobantes] = useState();

    let active = 2;
    const items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}
            </Pagination.Item>,
        );
    }

    function TableContent(props) {
        if (comprobantes) {
            return comprobantes.map((comprobante, i) => {
                return (
                    <tr key={'row' + i}>
                        <td>{comprobante.fecha.toLocaleDateString()}</td>
                        <td>{comprobante.destino.name}</td>
                        <td>{comprobante.cantidad}</td>
                        <td>{comprobante.user.name}</td>
                        <td>
                            <Container>
                                <Row>
                                    <Col className='mb-1'>
                                        <Button variant='success'><Eye /></Button>
                                    </Col>
                                    <Col className='mb-1'>
                                        <Button><Pencil /></Button>
                                    </Col>
                                    <Col className='mb-1' >
                                        <Button variant='danger'><Trash /></Button>
                                    </Col>
                                </Row>
                            </Container>
                        </td>
                    </tr >
                )
            })
        }

        return (
            <tr>
                <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
            </tr>
        )
    }

    useEffect(() => {
        Axios.get('/api/comprobantes', {
            params: {
                token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjIwYTNiYjczMzlhNGY3ZDY1M2FmNTkiLCJvcmciOiJhZGJsaWNrIiwicm9sZXMiOlsiY3Vwb3MuZGVhbGVyIiwiY2F0LmVkaXRvciJdLCJpYXQiOjE2NDk0MTg0NTgsImV4cCI6MTY0OTUwNDg1OH0.IRn3AFdWt4SNMRLpEvBQXhgXCU0p9IXrc9lJHkbSlGhetn_junUckx41NNiBbIcIn_k5K1S-odquQF0CSKdN8g'
            }
        })
            .then((response) => {
                setComprobantes(response.data.data.map(comprobante => {
                    comprobante.fecha = new Date(comprobante.fecha);
                    return comprobante;
                }));
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <Container className='bg-light border pt-5'>
            <Row className='mb-3'>
                <Link to='/nuevo'>
                    <Button className='float-end' variant='primary'>Nuevo</Button>
                </Link>
            </Row>
            <Row>
                <Col>
                    <div className='overflow-auto'>
                        <Table striped bordered hover >
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Destino</th>
                                    <th>Cantidad</th>
                                    <th>Usuario</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableContent />
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        comprobantes && <Pagination className='float-end'>{items}</Pagination>
                    }
                </Col>
            </Row>

        </Container>
    )
}

export default Home;
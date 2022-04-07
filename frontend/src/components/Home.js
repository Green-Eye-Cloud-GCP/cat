import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Container, Table, Button, Row, Col, Pagination } from 'react-bootstrap';

const Home = () => {

    const [comprobantes, setComprobantes] = useState([]);

    let active = 2;
    const items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}
            </Pagination.Item>,
        );
    }

    useEffect(() => {
        Axios.get('/api/comprobantes', {
            params: {
                token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjIwYTNiYjczMzlhNGY3ZDY1M2FmNTkiLCJvcmciOiJhZGJsaWNrIiwicm9sZXMiOlsiY3Vwb3MuZGVhbGVyIiwiY2F0LmVkaXRvciJdLCJpYXQiOjE2NDkyOTgyNTksImV4cCI6MTY0OTM4NDY1OX0.DEdXG743c_cRKtFuhpajf3MW_Pe8lNqYTv9-e8hEhAjHif29tiMfAMD4dfMAZUfDpKlS373sa1U7zEV5mxa63A"
            }
        })
            .then((response) => {
                setComprobantes(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <Container className='bg-light border pt-5'>
            <Row className='mb-3'>
                <Col className='border'>
                    <Button className='float-end' variant='primary'>Nuevo</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Origenes</th>
                                <th>Destino</th>
                                <th>Cantidad</th>
                                <th>Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                        comprobantes.map((comprobante) => {
                            return (
                                <tr>
                                <td>{comprobante.fecha}</td>
                                <td>{comprobante.origenes.length}</td>
                                <td>{comprobante.destino.name}</td>
                                <td>{comprobante.cantidad}</td>
                                <td>{comprobante.user}</td>
                            </tr>
                            )
                        })
                        }
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td colSpan={2}>Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Pagination className='float-end'>{items}</Pagination>
                </Col>
            </Row>

        </Container>
    )
}

export default Home;
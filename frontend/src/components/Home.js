import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Row, Col, Pagination, Placeholder } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Home = () => {

    const [comprobantes, setComprobantes] = useState();
    const [pageCount, setPageCount] = useState();
    const [pages, setPages] = useState();
    const [currentPage, setCurrentPage] = useState();

    const handlePageChange = (pageNumber, pageCount) => {

        const start = pageNumber > 3 ? pageNumber - 2 : 1;
        const end = pageNumber + 2 - pageCount > 0 ? (pageNumber + 2) - (pageNumber + 2 - pageCount) : pageNumber + 2

        const list = [];
        for (let i = start; i <= end; i++) {
            list.push(i);
        }
        setPages(list);

        setCurrentPage(pageNumber);
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
                                    <Col className='mb-1 d-flex justify-content-center' md={12} lg={4}>
                                        <Button variant='success'><FontAwesomeIcon icon={faEye} /></Button>
                                    </Col>
                                    <Col className='mb-1 d-flex justify-content-center' md={12} lg={4}>
                                        <Button disabled><FontAwesomeIcon icon={faPencil} /></Button>
                                    </Col>
                                    <Col className='mb-1 d-flex justify-content-center' md={12} lg={4}>
                                        <Button variant='danger'><FontAwesomeIcon icon={faTrashCan} /></Button>
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
        axios.get('/api/comprobantes', {
            params: {
                //TODO: eliminar
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

        axios.get('/api/comprobantes/pages', {
            params: {
                token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjIwYTNiYjczMzlhNGY3ZDY1M2FmNTkiLCJvcmciOiJhZGJsaWNrIiwicm9sZXMiOlsiY3Vwb3MuZGVhbGVyIiwiY2F0LmVkaXRvciJdLCJpYXQiOjE2NDk0MTg0NTgsImV4cCI6MTY0OTUwNDg1OH0.IRn3AFdWt4SNMRLpEvBQXhgXCU0p9IXrc9lJHkbSlGhetn_junUckx41NNiBbIcIn_k5K1S-odquQF0CSKdN8g'
            }
        })
            .then((response) => {
                const pageCount = response.data.data;
                setPageCount(pageCount);
                handlePageChange(1, pageCount);
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
                    <Table  bordered  responsive>
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
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        pages && <Pagination className='float-end'>
                            <Pagination.Item disabled={currentPage === 1} onClick={() => { handlePageChange(currentPage - 1, pageCount) }}>
                                {'<'}
                            </Pagination.Item>
                            {
                                pages.map((pageNumber) => {
                                    return (
                                        <Pagination.Item key={'currentPage' + pageNumber} active={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber, pageCount)}>
                                            {pageNumber}
                                        </Pagination.Item>
                                    )
                                })
                            }
                            <Pagination.Item disabled={currentPage === pageCount} onClick={() => { handlePageChange(currentPage + 1, pageCount) }}>
                                {'>'}
                            </Pagination.Item>
                        </Pagination>
                    }
                </Col>
            </Row>

        </Container>
    )
}

export default Home;
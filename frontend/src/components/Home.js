import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Row, Col, Pagination, Placeholder } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faEye, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import DeleteModal from './DeleteModal';

const Home = () => {

    const [comprobantes, setComprobantes] = useState();
    const [pageCount, setPageCount] = useState();
    const [pageList, setPageList] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handlePageChange = (pageNumber) => {

        if (pageCount === null) { return }

        setComprobantes();
        axios.get('/api/comprobantes', {
            params: {
                page: pageNumber,
                token: process.env.REACT_APP_TOKEN
            }
        })
            .then((response) => {
                console.log(response.data.data);
                setComprobantes(response.data.data.map(comprobante => {
                    comprobante.fecha = new Date(comprobante.fecha);
                    return comprobante;
                }));
            })
            .catch((error) => {
                console.log(error);
            });

        const start = pageNumber > 3 ? pageNumber - 2 : 1;
        const end = pageNumber + 2 - pageCount > 0 ? (pageNumber + 2) - (pageNumber + 2 - pageCount) : pageNumber + 2

        const list = [];
        for (let i = start; i <= end; i++) {
            list.push(i);
        }
        setPageList(list);

        setCurrentPage(pageNumber);
    }

    const handleDelete = (id) => {
        axios.delete('/api/comprobantes/' + id, {
            params: {
                token: process.env.REACT_APP_TOKEN
            }
        })
            .then((response) => {
                console.log(response.data.data);
                setShowDeleteModal(false);
                setPageCount();
                loadData();
            })
            .catch((error) => {
                console.log(error);
            });

    }

    useEffect(() => {
        handlePageChange(1);
    }, [pageCount]);

    const loadData = () => {
        axios.get('/api/comprobantes/pages', {
            params: {
                token: process.env.REACT_APP_TOKEN
            }
        })
            .then((response) => {
                const pageCount = response.data.data;
                console.log(pageCount);
                setPageCount(pageCount);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Container className='bg-light border pt-5'>
            <Row className='mb-3'>
                <Link to='/new'>
                    <Button className='float-end' variant='primary'>Nuevo</Button>
                </Link>
            </Row>
            <Row>
                <Col>
                    <Table bordered responsive>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Origenes</th>
                                <th>Destino</th>
                                <th>Cantidad</th>
                                <th>Usuario</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                comprobantes
                                    ? comprobantes.map((comprobante, i) => {
                                        return (
                                            <tr key={'row' + i}>
                                                <td>{comprobante.fecha.toLocaleDateString()}</td>
                                                <td>{comprobante.origenes.length}</td>
                                                <td>{comprobante.destino.name}</td>
                                                <td>{comprobante.cantidad}</td>
                                                <td>{comprobante.user.name}</td>
                                                <td>
                                                    <Container>
                                                        <Row>
                                                            <Col className='mb-1 d-flex justify-content-center' md={12} lg={4}>
                                                                <Link to={'/view/' + comprobante._id}>
                                                                    <Button variant='success'><FontAwesomeIcon icon={faEye} /></Button>
                                                                </Link>
                                                            </Col>
                                                            <Col className='mb-1 d-flex justify-content-center' md={12} lg={4}>
                                                                <Link to={'/edit/' + comprobante._id}>
                                                                    <Button><FontAwesomeIcon icon={faPencil} /></Button>
                                                                </Link>
                                                            </Col>
                                                            <Col className='mb-1 d-flex justify-content-center' md={12} lg={4}>
                                                                <Button variant='danger' onClick={() => setShowDeleteModal(true)}><FontAwesomeIcon icon={faTrashCan} /></Button>
                                                                <DeleteModal show={showDeleteModal} onClose={() => { setShowDeleteModal(false) }} onDelete={()=> handleDelete(comprobante._id)} />
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </td>
                                            </tr >
                                        )
                                    })
                                    : (
                                        <tr>
                                            <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                                            <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                                            <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                                            <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                                            <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                                            <td><Placeholder animation='glow'><Placeholder className='w-100' /></Placeholder></td>
                                        </tr>
                                    )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        pageList && comprobantes && <Pagination className='float-end'>
                            <Pagination.Item disabled={currentPage === 1} onClick={() => { handlePageChange(currentPage - 1, pageCount) }}>
                                {'<'}
                            </Pagination.Item>
                            {
                                pageList.map((pageNumber) => {
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
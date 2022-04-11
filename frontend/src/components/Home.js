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

    const handleDelete = (id) => {
        axios.delete('/api/comprobantes/' + id)
            .then((response) => {
                setShowDeleteModal(false);
                setPageCount();
                setCurrentPage(1);
                loadData();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {

        setComprobantes();
        setPageList();

        if (pageCount === undefined) { return }

        axios.get('/api/comprobantes', {
            params: {
                page: currentPage
            }
        })
            .then((response) => {
                setComprobantes(response.data.data.map(comprobante => {
                    comprobante.fecha = new Date(comprobante.fecha);
                    return comprobante;
                }));

                const start = currentPage > 3 ? currentPage - 2 : 1;
                const end = currentPage + 2 - pageCount > 0 ? (currentPage + 2) - (currentPage + 2 - pageCount) : currentPage + 2
                const list = [];
                for (let i = start; i <= end; i++) {
                    list.push(i);
                }
                setPageList(list);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [currentPage, pageCount]);

    const loadData = () => {
        axios.get('/api/comprobantes/pages')
            .then((response) => {
                const pageCount = response.data.data;
                setPageCount(pageCount);
            })
            .catch((error) => {
                console.error(error);
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
                                                                <DeleteModal show={showDeleteModal} onClose={() => { setShowDeleteModal(false) }} onDelete={() => handleDelete(comprobante._id)} />
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
                        pageList &&
                        <Pagination className='float-end'>
                            {
                                pageList.length > 0 && <Pagination.Item disabled={currentPage === 1} onClick={() => { setCurrentPage(currentPage - 1) }}>
                                    {'<'}
                                </Pagination.Item>
                            }
                            {
                                pageList.map((pageNumber) => {
                                    return (
                                        <Pagination.Item key={'currentPage' + pageNumber} active={pageNumber === currentPage} onClick={() => setCurrentPage(pageNumber)}>
                                            {pageNumber}
                                        </Pagination.Item>
                                    )
                                })
                            }
                            {
                                pageList.length > 0 && <Pagination.Item disabled={currentPage === pageCount} onClick={() => { setCurrentPage(currentPage + 1) }}>
                                    {'>'}
                                </Pagination.Item>
                            }
                        </Pagination>
                    }
                </Col>
            </Row>

        </Container>
    )
}

export default Home;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Placeholder, Row, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const View = () => {

    const { id } = useParams();
    const [fecha, setFecha] = useState('');
    const [origenes, setOrigenes] = useState(['']);
    const [destino, setDestino] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [archivo, setArchivo] = useState({ url: '', fileName: '' });
    const [user, setUser] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        axios.get('/api/comprobantes/' + id, {
            params: { token: process.env.REACT_APP_TOKEN }
        })
            .then((response) => {
                const data = response.data.data;

                setFecha(moment(data.fecha).format('YYYY-MM-DD'));
                setOrigenes(data.origenes.map((origen) => origen.name));
                setDestino(data.destino.name);
                setCantidad(data.cantidad);
                setArchivo(data.archivo);
                setUser(data.user.name);
                setDataLoaded(true);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    return (
        <Container className='bg-light border py-3'>
            <Row>
                <Link to={'/edit/' + id}>
                    <Button className='float-end' variant='primary'>Editar</Button>
                </Link>
            </Row>

            <Table bordered responsive>
                <tbody>
                    <tr>
                        <td style={{ 'width': '30%' }}><b>Fecha</b></td>
                        <td>
                            {
                                !dataLoaded
                                    ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                                    : <>{fecha}</>

                            }
                        </td>
                    </tr>

                    <tr>
                        <td><b>Origenes</b></td>
                        <td>
                            {
                                !dataLoaded
                                    ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                                    : <>
                                        {
                                            origenes.map((origen, i) => {
                                                return (
                                                    <span key={i}>{origen}<br /></span>
                                                )
                                            })
                                        }
                                    </>

                            }
                        </td>
                    </tr>

                    <tr>
                        <td><b>CAT destino</b></td>
                        <td>
                            {
                                !dataLoaded
                                    ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                                    : <>{destino}</>
                            }
                        </td>
                    </tr>

                    <tr>
                        <td><b>Cantidad</b></td>
                        <td>
                            {
                                !dataLoaded
                                    ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                                    : <>{cantidad}</>

                            }
                        </td>
                    </tr>

                    <tr>
                        <td><b>PDF/Imagen</b></td>
                        <td>
                            {
                                !dataLoaded
                                    ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                                    : <a
                                        href={archivo.url}
                                        target='_blank'
                                        rel='noreferrer noopener'
                                    >
                                        {archivo.fileName}
                                    </a>

                            }
                        </td>
                    </tr>

                    <tr>
                        <td><b>Usuario</b></td>
                        <td>
                            {
                                !dataLoaded
                                    ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                                    : <>{user}</>

                            }
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    )
}

export default View;
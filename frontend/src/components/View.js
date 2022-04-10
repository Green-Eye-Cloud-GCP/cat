import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Placeholder, Row, Button, Col } from 'react-bootstrap';
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
            params: {
                token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjIwYTNiYjczMzlhNGY3ZDY1M2FmNTkiLCJvcmciOiJhZGJsaWNrIiwicm9sZXMiOlsiY3Vwb3MuZGVhbGVyIiwiY2F0LmVkaXRvciJdLCJpYXQiOjE2NDk1MjQ1NTMsImV4cCI6MTY0OTYxMDk1M30.GQq2AnCwCJ1k949ahtQnov9iGonRV2C_SoGvOS9z86sRllGbrY9N1FSXHcEHi5qhCR0QsnvaAsplx8QJH1HaNw'
            }
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

            <Row className='border p-3 my-3'>
                <h5>Fecha</h5>
                <div className='px-4'>
                    {
                        !dataLoaded
                            ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                            : <div>{fecha}</div>

                    }
                </div>
            </Row>

            <Row className='border p-3 my-3'>
                <h5>Origenes</h5>
                {
                    !dataLoaded
                        ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                        : <div>
                            <ul>
                                {
                                    origenes.map((origen, i) => {
                                        return (
                                            <li key={i}>{origen}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                }
            </Row>

            <Row className='border p-3 my-3'>
                <h5>CAT destino</h5>
                <div className='px-4'>
                    {
                        !dataLoaded
                            ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                            : <div>{destino}</div>

                    }
                </div>
            </Row>

            <Row className='border p-3 my-3'>
                <h5>Cantidad</h5>
                <div className='px-4'>
                    {
                        !dataLoaded
                            ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                            : <div>{cantidad}</div>

                    }
                </div>
            </Row>

            <Row className='border p-3 my-3'>
                <h5>PDF/Imagen</h5>
                {
                    !dataLoaded
                        ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                        : <div>
                            <a
                                href={archivo.url}
                                target='_blank'
                                rel='noreferrer noopener'
                            >
                                {archivo.fileName}
                            </a>
                        </div>

                }
            </Row>

            <Row className='border p-3 my-3'>
                <h5>Usuario</h5>
                {
                    !dataLoaded
                        ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                        : <div>{user}</div>

                }
            </Row>
        </Container>
    )
}

export default View;
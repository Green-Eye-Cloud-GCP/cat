import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Col, Row, OverlayTrigger, Tooltip, Placeholder, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const CommonForm = forwardRef((props, ref) => {

    const [validated, setValidated] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [opcionesOrigenes, setOpcionesOrigenes] = useState([]);
    const [opcionesDestinos, setOpcionesDestinos] = useState([]);

    const [fecha, setFecha] = useState('');
    const [origenes, setOrigenes] = useState(['']);
    const [destino, setDestino] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [archivo, setArchivo] = useState({ url: '', fileName: '' });
    const [id, setId] = useState();
    const [dataLoaded, setDataLoaded] = useState(false);

    const fileInputRef = useRef();
    const navigate = useNavigate();

    const handleSelectChange = (value, index) => {
        const list = [...origenes];
        list[index] = value;
        setOrigenes(list);
    };

    const handleDelOrigen = (index) => {
        const list = [...origenes];
        list.splice(index, 1);
        setOrigenes(list)
    }

    const handleAddOrigen = () => {
        setOrigenes([
            ...origenes,
            ''
        ])
    }

    const handleSuccess = () => {
        setShowSuccess(true);
        setTimeout(
            () => setShowSuccess(false),
            3000
        );
    }

    useImperativeHandle(ref,
        () => ({

            setFormData(data) {
                const origenes = data.origenes.map((origen) => origen._id);

                setFecha(moment(data.fecha).format('YYYY-MM-DD'));
                setOrigenes(origenes);
                setDestino(data.destino._id);
                setCantidad(data.cantidad);
                setArchivo(data.archivo);
                setId(data._id);
                setDataLoaded(true);
            }

        })
    );


    useEffect(() => {
        axios.get('https://www.greeneye.cloud/back/gps', {
            params: {
                org: 'adblick',
                types: ['Deposito insumos', 'Campo', 'CAT'],
                token: process.env.REACT_APP_TOKEN
            }
        })
            .then((response) => {
                setOpcionesOrigenes(response.data.filter(opcion => opcion.type !== 'CAT'));
                setOpcionesDestinos(response.data.filter(opcion => opcion.type === 'CAT'));
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleSubmit = (event) => {

        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return
        }

        const formData = new FormData();
        formData.append('fecha', moment(fecha).format());
        formData.append('origenes', origenes);
        formData.append('destino', destino);
        formData.append('cantidad', cantidad);
        formData.append('file', fileInputRef.current.files[0]);

        //TODO: eliminar
        formData.append('token', process.env.REACT_APP_TOKEN);

        axios({
            url: props.mode === 'Nuevo' ? '/api/comprobantes' : '/api/comprobantes/' + id,
            method: props.mode === 'Nuevo' ? 'POST' : 'PUT',
            data: formData
        })
            .then((response) => {
                if (props.mode === 'Editar') {
                    navigate('/');
                } else {
                    handleSuccess();
                    setFecha('');
                    setOrigenes(['']);
                    setDestino('');
                    setCantidad('');
                    fileInputRef.current.value = '';
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Container className='bg-light border py-3'>

            <Alert show={showSuccess} variant="success" onClose={() => setShowSuccess(false)} dismissible>
                <Alert.Heading>Comprobante creado!</Alert.Heading>
            </Alert>

            <h1 className='text-center'>{props.mode} comprobante</h1>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className='my-3' controlId='formFecha'>
                    <Form.Label><h5>Fecha</h5></Form.Label>
                    {
                        props.mode === 'Editar' && !dataLoaded
                            ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                            : (
                                <Form.Control
                                    type='date'
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    required
                                />
                            )
                    }
                </Form.Group>

                <Container className='border py-3'>
                    <h5>Origenes</h5>
                    {
                        props.mode === 'Editar' && !dataLoaded
                            ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                            : (
                                <Container>
                                    <Form.Group className='my-3' controlId='formOrigenes'>
                                        {
                                            origenes.map((origen, i) => {
                                                return (
                                                    <Container key={i}>
                                                        <Row className='my-3'>
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
                                                                        <Button className='float-end' variant='danger' onClick={() => handleDelOrigen(i)}>
                                                                            <FontAwesomeIcon icon={faTrashCan} />
                                                                        </Button>
                                                                    </OverlayTrigger>
                                                                </Col>
                                                            }
                                                        </Row>
                                                    </Container>
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
                                                <Button className='float-end' variant='success' onClick={handleAddOrigen}>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </Button>
                                            </OverlayTrigger>
                                        </Col>
                                    </Row>
                                </Container>
                            )
                    }
                </Container>

                <Form.Group className='my-3' controlId='formDestinos'>
                    <Form.Label><h5>CAT destino</h5></Form.Label>
                    {
                        props.mode === 'Editar' && !dataLoaded
                            ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                            : (
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
                            )
                    }
                </Form.Group>


                <Form.Group className='my-3' controlId='formCantidad'>
                    <Form.Label><h5>Cantidad</h5></Form.Label>
                    {
                        props.mode === 'Editar' && !dataLoaded
                            ? <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                            : (
                                <Form.Control
                                    type='number'
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    required
                                />
                            )
                    }
                </Form.Group>

                <Form.Group className='my-3' controlId='formArchivo'>
                    <Form.Label><h5>PDF/Imagen</h5></Form.Label>
                    {
                        props.mode === 'Editar' && (
                            !dataLoaded
                                ? (
                                    <div className='mb-3'>
                                        <Placeholder animation='glow'><Placeholder size='lg' className='w-100' /></Placeholder>
                                    </div>
                                )
                                : (
                                    <div className='mb-3'>
                                        <a
                                            href={archivo.url}
                                            target='_blank'
                                            rel='noreferrer noopener'
                                        >
                                            {archivo.fileName}
                                        </a>
                                    </div>
                                )
                        )
                    }
                    <Form.Control
                        type='file'
                        ref={fileInputRef}
                        required={props.mode === 'Nuevo'}
                    />
                </Form.Group>


                {
                    props.mode === 'Editar' && !dataLoaded
                        ? <></>
                        : (
                            <Row className='mt-5'>
                                <Col><Button className='float-end' variant='primary' type='submit'>{props.mode}</Button></Col>
                            </Row>
                        )
                }
            </Form>
        </Container>
    )
});

export default CommonForm;
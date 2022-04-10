import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import CommonForm from './CommonForm';

const Edit = () => {

    const { id } = useParams();
    const commonFormRef = useRef();

    useEffect(() => {
        axios.get('/api/comprobantes/' + id, {
            params: {
                token: process.env.REACT_APP_TOKEN
            }
        })
            .then((response) => {
                commonFormRef.current.setFormData(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    return (
        <CommonForm ref={commonFormRef} mode='Editar'/>
    )
}

export default Edit;
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
                token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjIwYTNiYjczMzlhNGY3ZDY1M2FmNTkiLCJvcmciOiJhZGJsaWNrIiwicm9sZXMiOlsiY3Vwb3MuZGVhbGVyIiwiY2F0LmVkaXRvciJdLCJpYXQiOjE2NDk1MjQ1NTMsImV4cCI6MTY0OTYxMDk1M30.GQq2AnCwCJ1k949ahtQnov9iGonRV2C_SoGvOS9z86sRllGbrY9N1FSXHcEHi5qhCR0QsnvaAsplx8QJH1HaNw'
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
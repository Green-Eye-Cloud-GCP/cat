import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import CommonForm from './CommonForm';

const Edit = () => {

    const { id } = useParams();
    const [formData, setFormData] = useState();

    useEffect(() => {
        axios.get('/api/comprobantes/' + id, {
            params: { token: process.env.REACT_APP_TOKEN }
        })
            .then((response) => {
                setFormData(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    return (
        <CommonForm data={formData} mode='Editar' />
    )
}

export default Edit;
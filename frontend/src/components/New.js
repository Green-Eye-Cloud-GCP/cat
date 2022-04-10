import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

import CommonForm from './CommonForm';

const New = () => {
    const [show, setShow] = useState(true);

    return (
        <>
            <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Comprobante creado!</Alert.Heading>
            </Alert>
            <CommonForm mode='Nuevo' />
        </>
    )
}

export default New;
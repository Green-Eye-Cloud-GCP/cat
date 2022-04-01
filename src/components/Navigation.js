import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Navigation = () => {

    const [expanded, setExpanded] = useState(false);

    return (
        <Navbar
            bg='light'
            expand='lg'
            expanded={expanded}
        >

            <Container>

                <Navbar.Brand
                    as={NavLink}
                    to='/'
                    onClick={() => setExpanded(false)}
                >
                    Inicio
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls='basic-navbar-nav'
                    onClick={() => setExpanded(!expanded)}
                />

                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='me-auto'>

                        <Nav.Link
                            as={NavLink}
                            to='/nuevo'
                            onClick={() => setExpanded(false)}
                        >
                            Nuevo
                        </Nav.Link>
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;
import React, { FC, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { About } from '../ControlPages/About/About';
import { Terms } from '../ControlPages/Terms/Terms';
import { ControlPage } from '../ControlPages/ControlPage';
import { Privacy } from '../ControlPages/Privacy/Privacy';
import { Contact } from '../ControlPages/Contact/Contact';
import { styled } from '@mui/system';
import { Home } from '../Home/Home';
import { Login } from '../Auth/Login/Login';
import { Register } from '../Auth/Register/Register';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled('div')`
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
`;

const Nav: FC<Props> = function ({
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    loading,
    error
}) {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/login"
                    element={
                        <Login
                            signInWithGoogle={signInWithGoogle}
                            signInWithFacebook={signInWithFacebook}
                            signUp={() => navigate('/register')}
                            error={error}
                            onSubmit={signInWithEmailAndPassword}
                            loading={loading}
                        />
                    }
                />
                <Route
                    path="/register"
                    element={
                        <Register
                            onSubmit={createUserWithEmailAndPassword}
                            login={() => navigate('/login')}
                        />
                    }
                />
                <Route
                    path="/about"
                    element={
                        <ControlPage>
                            <About />
                        </ControlPage>
                    }
                />
                <Route
                    path="/terms"
                    element={
                        <ControlPage>
                            <Terms />
                        </ControlPage>
                    }
                />
                <Route
                    path="/privacy"
                    element={
                        <ControlPage>
                            <Privacy />
                        </ControlPage>
                    }
                />
                <Route
                    path="/contact"
                    element={
                        <ControlPage>
                            <Contact />
                        </ControlPage>
                    }
                />
            </Routes>
        </Wrapper>
    );
};

export default Nav;

interface Props {
    signInWithEmailAndPassword?: (
        email: string,
        password: string
    ) => Promise<any>;
    createUserWithEmailAndPassword?: (
        email: string,
        password: string
    ) => Promise<any>;
    signInWithGoogle?: () => void;
    signInWithFacebook?: () => void;
    signOut?: () => void;
    error?: string;
    loading?: boolean;
}

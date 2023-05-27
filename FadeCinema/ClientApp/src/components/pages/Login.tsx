import * as React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../forms/LoginForm';

interface propState {
    isSessionExpired: boolean;
} 

const Login = () => {
    const isSessionExpired = useLocation().state?.isSessionExpired;
    return (
        <div className="d-flex align-items-center flex-column">
            {isSessionExpired && <span className="session-expired-text display-6">Session expired</span>}
            <h1 className="uppercase display-4 mb-50">Log in</h1>
            <LoginForm />
        </div>
    );
}

export default Login;

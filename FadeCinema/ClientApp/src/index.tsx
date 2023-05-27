import 'bootstrap/dist/css/bootstrap.css';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import UserContextProvider from './contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
    <BrowserRouter>
        <UserContextProvider>
            <App />
        </UserContextProvider>
        </BrowserRouter>);


registerServiceWorker();

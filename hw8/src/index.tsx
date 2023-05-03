import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';
import * as React from 'react';


const root = createRoot(document.getElementById('root')); // createRoot(container!) if you use TypeScript
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
    );



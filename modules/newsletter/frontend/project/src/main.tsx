import React from 'react';
import ReactDOM from 'react-dom/client';
import NewsletterUserModule from './pages/NewsletterUserModule.tsx';

export { NewsletterUserModule };

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <div>
                Remote App is running independently
            </div>
        </React.StrictMode>
    );
}
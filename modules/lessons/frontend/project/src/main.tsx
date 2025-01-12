import React from 'react';
import ReactDOM from 'react-dom/client';
import LessonsMainModule from './pages/LessonsMainModule.tsx';

export { LessonsMainModule };

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
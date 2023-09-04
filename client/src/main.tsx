import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// console.log = () => {};
// console.warn = () => {};
// console.error = () => {};
// console.info = () => {};
// console.debug = () => {};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className='App'>
      <App />
    </div>
  </React.StrictMode>,
)

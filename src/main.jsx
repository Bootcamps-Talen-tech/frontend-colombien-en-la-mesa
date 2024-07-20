import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Importar assets (recursos: hojas de estilo, imágens, fuentes, etc.)
import './assets/css/normalize.css';
import './assets/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/section.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)

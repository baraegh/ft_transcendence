import '../css/errorPage.css'
import { useNavigate } from 'react-router-dom';

function ErrorPage(): JSX.Element {
    const navigate = useNavigate();
    return (<div>
        <div className="mainDisplay">
            <div className='ErrorGif'>
            <iframe id="errorGifGif" src="https://gifer.com/embed/7VE">
            </iframe>
            </div>
            </div>

    </div>)
}

export default ErrorPage;
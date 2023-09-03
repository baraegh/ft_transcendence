import React, { useEffect, Dispatch } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import '../css/loginPage.css'
import gif from '../img/intro.gif'
import logo42 from '../img/42_logo.png'
import logo42White from '../img/42_logo_white.png'
import axios from 'axios'

// function getActualWindowDientions() {
//     const [windowDimensions, setWindowDimensions] = useState({
//       width: window.innerWidth,
//       height: window.innerHeight
//     });

//     useEffect(() => {
//       const handleResize = () => {
//         setWindowDimensions({
//           width: window.innerWidth,
//           height: window.innerHeight
//         });
//       };

//       window.addEventListener('resize', handleResize);

//       return () => {
//         window.removeEventListener('resize', handleResize);
//       };
//     }, []);

//     return (windowDimensions);
//   }



function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: Dispatch<boolean> }): JSX.Element {
    const handleLogin = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/`; // fix this a khay simo 

    }
    useEffect(() => {
        const checkLoggedInStatus = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/check`, {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                // Handle error
                console.error(error);
                setIsLoggedIn(false);
            }
        };

        checkLoggedInStatus();
    }, []);
    return (
        <div className="loginDiv">
            <img src={gif} alt="" />
            <div className="loginDiv">
                <button
                    onClick={handleLogin}
                    className='button_42'><img src={logo42} id="logo42" alt="" />
                    <img src={logo42White} id="logo42White" alt="" />
                    LOGIN
                </button>
            </div>
        </div>

    );
}
export default LoginPage;
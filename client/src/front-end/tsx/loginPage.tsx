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



function LoginPage({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean, setIsLoggedIn: Dispatch<boolean> }): JSX.Element {
    const handleLogin = async () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/`; // fix this a khay simo 
        // localStorage.setItem('isLoggedIn', "true");
    }
    useEffect(() => {
        const checkLoggedInStatus = async () => {
            try {
                // if ((localStorage.getItem('isLoggedIn')) == "true") {
                await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/check`, {
                    withCredentials: true,
                }).then((response) => {
                    if (response.status === 200) {
                        setIsLoggedIn(true);
                    }
                    else if (response.status === 401)
                        console.log("hiii")
                }).catch((err) => {
                    if (err.code == "ERR_BAD_REQUEST")
                        localStorage.setItem('isLoggedIn', "false");
                    console.clear();

                });
                // }
            } catch (error) {
                // Handle error
                // console.error(error);
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
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import '../css/loginPage.css'
import gif from '../img/intro.gif'
import logo42 from '../img/42_logo.png'
import logo42White from '../img/42_logo_white.png'

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

  

function LoginPage() : JSX.Element {
        const handleLogin = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/`;
    }
    return (
        <div className="loginDiv">
            <img src={gif} alt="" />
            <div className="loginDiv">
                <button  
                onClick ={handleLogin}
                className='button_42'><img src={logo42} id="logo42" alt="" />
                <img src={logo42White} id="logo42White" alt="" />
                LOGIN
                </button>
            </div>
        </div>

    );
}
export default LoginPage;
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'
import './loginPage.css'
import gif from './intro.gif'
import logo42 from './42_logo.png'

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
    return (
        <div className="loginDiv">
            <img src={gif} alt="" />
            
            {/* <img src={logo42} className="logo42"/> */}
            <button className="button_42">42 intra</button>
            <button className="button_google">Google</button>
        </div>

    );
}

export default LoginPage;
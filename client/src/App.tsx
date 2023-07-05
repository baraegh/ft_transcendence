import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from './chat/chat';
import AuthPage from './auth/AuthPage';
import HomePage from './home/HomePage';
import TwoFactorAuth from './TwoFactorAuth/TwoFactorAuth';



function App() {

  return (
    <Router>
      <Routes >
        <Route  path="/" element={<AuthPage />} />
        <Route  path="/TwoFactorAuth" element={<TwoFactorAuth />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
import './App.css';
import Chat from './chat/chat';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './auth/AuthPage';
import HomePage from './home/HomePage';



function App() {
  const Chat_ = () => {
    return (
      <div className='App'>
      <header></header>
        <Chat />
    </div>
    );
  }
  return (
    <Router>
      <Routes >
        <Route  path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<Chat_/>} />
      </Routes>
    </Router>
  );
}

export default App;
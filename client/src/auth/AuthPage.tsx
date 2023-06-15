const AuthPage = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/";
  };

  return (
    <div>
      <h1>Auth Page</h1>
        <button onClick ={handleLogin}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Login with 42Network
      </button >
    </div>
  );
};
export default AuthPage;


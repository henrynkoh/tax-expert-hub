import React from 'react';

const Login: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>Login</h2>
      <form style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input type="email" placeholder="Email" style={{ marginBottom: '10px', padding: '8px' }} />
        <input type="password" placeholder="Password" style={{ marginBottom: '10px', padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login; 
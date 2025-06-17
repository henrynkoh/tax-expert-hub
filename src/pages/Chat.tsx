import React from 'react';

const Chat: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>Chat</h2>
      <div style={{ width: '300px', height: '400px', border: '1px solid #ccc', borderRadius: '8px', padding: '16px', overflowY: 'auto' }}>
        <p>Welcome to the chat! (Feature coming soon)</p>
      </div>
    </div>
  );
};

export default Chat; 
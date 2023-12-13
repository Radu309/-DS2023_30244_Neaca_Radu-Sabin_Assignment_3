import React from 'react';

const NotificationMessage = ({ message }) => {
    return (
        <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '15px', border: '1px solid #f5c6cb' }}>
            {message}
        </div>
    );
};

export default NotificationMessage;
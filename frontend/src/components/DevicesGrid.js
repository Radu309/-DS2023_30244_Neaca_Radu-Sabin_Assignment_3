import React from 'react';
import axios from 'axios';

const columnStyle = {
    flex: 1,
    margin: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
    height: '600px',
    overflow: 'auto',
};

const deviceStyle = {
    marginBottom: '10px', // Adjust the margin between each device
    padding: '15px',
    border: '1px solid #f0f0f0',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
};

const buttonStyle = {
    backgroundColor: '#ff4d4f',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
};

const DevicesGrid = (props) => {
    const devices = props.devices;

    const handleButtonClick = (deviceId) => {
        axios
            .delete(`${process.env.REACT_APP_DEVICE_SERVICE}/device/delete/${deviceId}`)
            .then((response) => {
                props.setUpdateUser((prevState) => !prevState);
                props.setUpdateDevice((prevState) => !prevState);
            });
    };

    return (
        <div style={columnStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>All Devices</h2>
            <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                {devices.map((device) => (
                    <div key={device.id} style={deviceStyle}>
                        <h3>{device.name}</h3>
                        <p style={{ margin: '5px 0' }}>Id: {device.id}</p>
                        <p style={{ margin: '5px 0' }}>Details: {device.details}</p>
                        <p style={{ margin: '5px 0' }}>Address: {device.address}</p>
                        <p style={{ margin: '5px 0' }}>Hours: {device.hours}</p>
                        <p style={{ margin: '5px 0' }}>
                            <strong>Users:</strong> {device.users.map((user) => `User ID: ${user.id}`).join(', ')}
                        </p>
                        <button style={buttonStyle} onClick={() => handleButtonClick(device.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DevicesGrid;

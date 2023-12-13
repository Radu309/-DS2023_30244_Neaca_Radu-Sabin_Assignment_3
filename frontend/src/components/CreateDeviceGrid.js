import React, { useState } from 'react';
import axios from 'axios';

const columnStyle = {
    flex: 1,
    margin: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
};
const inputStyle = {
    width: '100%',
    padding: '5px',
    marginTop: '5px',
    paddingRight: '0px',
    border: '1px solid #ccc',
    borderRadius: '5px',
};


const CreateDeviceGrid = (props) => {
    const { setUpdateDevice } = props;
    const [newDevice, setNewDevice] = useState({
        name: '',
        details: '',
        address: '',
        hours: '',
    });
    const createDevice = () => {
        axios.post(process.env.REACT_APP_DEVICE_SERVICE + "/device/add", newDevice)
            .then(response => {
                setUpdateDevice(prevState => !prevState);
            });
    };

    return (
        <div style={columnStyle}>
            {/*<h2>Create a New Device</h2>*/}
            <form>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Name"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Details"
                    value={newDevice.details}
                    onChange={(e) => setNewDevice({ ...newDevice, details: e.target.value })}
                />
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Address"
                    value={newDevice.address}
                    onChange={(e) => setNewDevice({ ...newDevice, address: e.target.value })}
                />
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Maximum hourly energy consumption"
                    value={newDevice.hours}
                    onChange={(e) => setNewDevice({ ...newDevice, hours: e.target.value })}
                />
                <button style={inputStyle} type="button" onClick={createDevice}>Create Device</button>
            </form>
        </div>
    );
};

export default CreateDeviceGrid;

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


const MappingGrid = (props) => {
    const { setUpdateDevice } = props;
    const [ids, setIds] = useState({
        userId: '',
        deviceId: '',
    });
    const user = JSON.parse(localStorage.getItem('user') || null);


    const createUser = () => {
        axios.get(process.env.REACT_APP_USER_SERVICE + "/user/with-device/" + ids.userId + "/" + ids.deviceId ,
            {
                headers: {
                    "Authorization": "Bearer " + user.token,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                setUpdateDevice(prevState => !prevState);
            });
    };

    return (
        <div style={columnStyle}>
            <form>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="User Id"
                    value={ids.userId}
                    onChange={(e) => setIds({ ...ids, userId: e.target.value })}
                />
                <input
                    style={inputStyle}
                    type="email"
                    placeholder="Device Id"
                    value={ids.deviceId}
                    onChange={(e) => setIds({ ...ids, deviceId: e.target.value })}
                />
                <button style={inputStyle} type="button" onClick={createUser}>Map user-device</button>
            </form>
        </div>
    );
};

export default MappingGrid;

import React, { useEffect, useState } from 'react';
import UsersGrid from '../components/UsersGrid';
import DevicesGrid from '../components/DevicesGrid';
import CreateUserGrid from '../components/CreateUserGrid';
import CreateDeviceGrid from '../components/CreateDeviceGrid';
import MappingGrid from '../components/MappingGrid';
import axios from 'axios';
import EditDeviceGrid from "../components/EditDeviceGrid";
import EditUserGrid from "../components/EditUserGrid";
import ChatBox from "../components/ChatBox";
import ChatIcon from "../images/ChatIcon.svg"

const containerStyleColumn = {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
};

const columnStyle = {
    flex: '15',
    margin: '10px',
};

const containerStyleRow = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
};

const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0px',
    flex: '1',
};

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [devices, setDevices] = useState([]);
    const [updateUser, setUpdateUser] = useState(false);
    const [updateDevice, setUpdateDevice] = useState(false);

    useEffect(() => {
        axios.get(process.env.REACT_APP_USER_SERVICE + '/user/all')
            .then((response) => {setUsers(response.data);})
            .catch(() => {setUsers([])});
    }, [updateUser]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_DEVICE_SERVICE + '/device/all')
            .then((response) => {setDevices(response.data)})
            .catch(() => {setDevices([])});
    }, [updateDevice]);



    return (
        <div>
            <div style={containerStyleColumn}>
                <div style={columnStyle}>
                    <UsersGrid users={users} setUpdateDevice={setUpdateDevice} setUpdateUser={setUpdateUser} />
                </div>
                <div style={columnStyle}>
                    <DevicesGrid devices={devices} setUpdateDevice={setUpdateDevice} setUpdateUser={setUpdateUser}/>
                </div>
                <div style={columnStyle}>
                    <div style={containerStyleRow}>
                        <div style={rowStyle}>
                            <CreateUserGrid setUpdateUser={setUpdateUser} />
                            <CreateDeviceGrid setUpdateDevice={setUpdateDevice} />
                        </div>
                        <div style={rowStyle}>
                            <EditUserGrid setUpdateUser={setUpdateUser} />
                            <EditDeviceGrid setUpdateDevice={setUpdateDevice} />
                        </div>
                        <div style={rowStyle}>
                            <MappingGrid setUpdateDevice={setUpdateDevice}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AdminPage;

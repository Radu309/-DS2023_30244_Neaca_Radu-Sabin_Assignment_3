import React, {useState, useEffect} from 'react';
import axios from 'axios';
import SockJsClient from "react-stomp";
import Graphic from "../components/Graphic";
import DeviceList from "../components/DeviceList";
import NotificationMessage from "../components/NotificationMessage";
import 'react-datepicker/dist/react-datepicker.css';
import ChatBox from "../components/ChatBox";

const containerStyleColumn = {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
};
const columnStyle = {
    flex: '15',
    marginTop: '20px',
    marginBottom: '20px',
    marginLeft: '80px',
    marginRight: '80px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
    height: '600px',
    overflow: 'auto',
};

const ClientDevices = (props) => {
    const userId = props.user.id;
    const [userDevice, setUserDevice] = useState([]);
    const [measurements, setMeasurements] = useState(null);
    const [message, setMessage] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || null);

    useEffect(() => {
        axios.get(process.env.REACT_APP_DEVICE_SERVICE + "/device/all",
            {
                headers: {
                    "Authorization": "Bearer " + user.token,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                const filteredDevices = response.data.filter(device => device.users.some(user => user.id === props.user.id));
                setUserDevice(filteredDevices);
            });
    }, [props.user.id]);

    function handleHelpMeClick() {
        setShowMessage(true);
    }
    const websocketHeaders = {
        "Authorization": "Bearer " + user.token,
    };
    return (
        <div>
            <div>
                <SockJsClient
                    url={"http://localhost:8083/ws"}
                    topics={['/topic/notification/' + userId]}
                    onConnect={() => console.log("connected")}
                    onDisconnect={() => console.log("Disconnected!")}
                    onMessage={msg => setMessage(msg)}
                    debug={true}
                    headers={websocketHeaders}
                />
            </div>
            <div style={containerStyleColumn}>
                <div style={columnStyle}>
                    <DeviceList userDevices={userDevice} userName={props.user.name} setMeasurements={setMeasurements}/>
                </div>
                <div style={columnStyle}>
                    <Graphic userName={props.user.name} yValues={measurements}/>
                    <NotificationMessage message={message}/>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button onClick={handleHelpMeClick}>Help Me</button>
                    </div>
                </div>
            </div>
            {showMessage && <ChatBox user={props.user} index={0} userRole={'CLIENT'}/>}
        </div>
    );
};

export default ClientDevices;

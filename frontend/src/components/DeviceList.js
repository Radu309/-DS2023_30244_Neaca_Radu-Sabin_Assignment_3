// DeviceList.js
import React, {useEffect, useState} from 'react';
import SimpleDatePicker from "./SimpleDatePicker";
import axios from "axios";

const headerStyle = {
    width: '60%',
    margin: 'auto',
    textAlign: 'center',
    marginBottom: '20px',
};
const noDeviceStyle = {
    textAlign: 'center',
};
const hrStyle = {
    marginTop: '20px',
    border: '0',
    borderTop: '1px solid #ddd',
};
const listItemStyle = {
    width: '60%',
    margin: 'auto',
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
};

const DeviceList = ({ userDevices, userName, setMeasurements }) => {
    const [date, setDate] = useState(null);
    const [deviceId, setDeviceId] = useState(0);

    useEffect(() => {
        if (deviceId === 0)
            setMeasurements(null)
        else {
            axios.get('http://localhost:8083/measurement/find-device/' + deviceId)
                .then((response) => {
                    const filteredMeasurements = response.data.filter((dateMeasurement) => {
                        return timeStampTranslated(dateMeasurement.timeStamp, date)
                    });
                    setMeasurements(filteredMeasurements);
                })
        }
    }, [date, deviceId]);

    function timeStampTranslated(timeStampString1, timeStampString2){
        const timestamp1 = parseInt(timeStampString1, 10);
        const timestamp2 = parseInt(timeStampString2, 10);

        const dateObject1 = new Date(timestamp1);
        const dateObject2 = new Date(timestamp2);

        const isSameDay = dateObject1.getFullYear() === dateObject2.getFullYear() &&
            dateObject1.getMonth() === dateObject2.getMonth() &&
            dateObject1.getDate() === dateObject2.getDate();

        const isAfterTimestamp1 = timestamp2 <= timestamp1;

        return isSameDay && isAfterTimestamp1;

    }

    return (
        <>
            <h1 style={headerStyle}>{userName}'s Devices</h1>
            {userDevices.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: '0' }}>
                    {userDevices.map((device) => (
                        <li key={device.id} style={listItemStyle}>
                            <h3 style={{ marginBottom: '10px' }}>{device.name}</h3>
                            <p><strong>Details:</strong> {device.details}</p>
                            <p><strong>Address:</strong> {device.address}</p>
                            <p><strong>Hours:</strong> {device.hours}</p>
                            <hr style={hrStyle} />
                            <SimpleDatePicker setDate={setDate} setDeviceId={setDeviceId} deviceId={device.id}/>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={noDeviceStyle}>No devices found for this client.</p>
            )}
        </>
    );
};

export default DeviceList;

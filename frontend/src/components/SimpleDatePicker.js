import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SimpleDatePicker = ( {setDate, deviceId, setDeviceId} ) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        const timestamp = date.getTime();
        const timestampString = timestamp.toString();
        setDeviceId(deviceId);
        setDate(timestampString);
        setSelectedDate(date);
    };

    return (
        <div>
            <DatePicker
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                selected={selectedDate}
            />
        </div>
    );
};

export default SimpleDatePicker;

import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const headerStyle = {
    width: '60%',
    margin: 'auto',
    textAlign: 'center',
    marginBottom: '20px',
};
const graphicStyle = {
    width: '80%',
    margin: 'auto',
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
};

const Graphic = ({ userName, yValues }) => {
    if (yValues === null) {
        return (
            <div style={graphicStyle}>
                <h1 style={headerStyle}>{userName}'s Devices</h1>
                <p>No data available for the chart.</p>
            </div>
        );
    }

    function timeStampTranslated(timestampString){
        const timestamp = parseInt(timestampString, 10);

        const dateObject = new Date(timestamp);

        return dateObject.getHours();
        // return dateObject
        // return dateObject.getMinutes()
    }

    const options = {
        animationEnabled: true,
        data: [{
            type: "splineArea",
            xValueFormatString: "timestamp",
            yValueFormatString: "energy value",
            showInLegend: true,
            dataPoints: yValues.map((value, index) => ({
                // x: timeStampTranslated(value.timeStamp),
                x: timeStampTranslated(value.timeStamp) ,
                y: value.measurementValue,
            })),
        }]
    }
    return (
        <div>
            <h1 style={headerStyle}>{userName}'s Devices</h1>
            <CanvasJSChart options = {options}/>
        </div>
    );
}



export default Graphic;

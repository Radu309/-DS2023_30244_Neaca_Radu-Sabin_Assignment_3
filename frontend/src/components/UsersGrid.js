import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ChatIcon from "../images/ChatIcon.svg";
import ChatBox from "./ChatBox";

const columnStyle = {
    flex: 1,
    margin: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
    height: '600px', // Adjust the height as per your requirement
    overflow: 'auto', // Enable scrolling when content exceeds the height
};
const userStyle = {
    marginBottom: '10px', // Adjust the margin between each user
    padding: '15px',
    border: '1px solid #f0f0f0',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
};
const buttonStyle = {
    backgroundColor: '#ff4d4f',
    color: '#ffffff',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
};
const chatStyle = {
    // position: 'absolute',
    backgroundColor: '#0124b9',
    color: '#ffffff',
    border: 'none',
    // padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '250px',
};

const UsersGrid = (props) => {
    const users = props.users;
    const [usersMessages, setUsersMessages] = useState([]);

    const handleButtonClick = (userId) => {
        axios
            .delete(`${process.env.REACT_APP_USER_SERVICE}/user/delete/${userId}`)
            .then((response) => {
                props.setUpdateUser((prevState) => !prevState);
                props.setUpdateDevice((prevState) => !prevState);
            });
    };
    const addUser = (newUser) => {
        const existingUserIndex = usersMessages.findIndex(user => user.user.id === newUser.id);
        if (existingUserIndex !== -1) {
            // exists
            const updatedusersMessages = [...usersMessages];
            const changeStatus = updatedusersMessages[existingUserIndex].activated;
            updatedusersMessages[existingUserIndex] = { user: newUser, activated: !changeStatus };
            setUsersMessages(updatedusersMessages);
        } else {
            const newUserObject = { user: newUser, activated: true };
            setUsersMessages(prevusersMessages => [...prevusersMessages, newUserObject]);
        }
    };
    return (
        <div style={columnStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>All Users</h2>
            {users.length ? (
                <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                    {users.map((user) => (
                        <div key={user.id} style={userStyle}>
                            <h3>{user.name}</h3>
                            <p style={{ margin: '5px 0' }}>Id: {user.id}</p>
                            <p style={{ margin: '5px 0' }}>Email: {user.email}</p>
                            <p style={{ margin: '5px 0' }}>User Role: {user.userRole}</p>
                            <div>
                                <button style={buttonStyle} onClick={() => handleButtonClick(user.id)}>
                                    Delete
                                </button>
                                { (user.userRole === "CLIENT") &&
                                    <button style={chatStyle} onClick={() => addUser(user)} >
                                        <img src={ChatIcon} alt="Chat Icon" style={{ width: '30px', height: '30px' }}/>
                                    </button>
                                }
                            </div>
                        </div>
                    ))}
                    {usersMessages.map((userMessage, index) => (
                        (userMessage.activated) && (
                        <ChatBox user={userMessage.user} index={index} userRole={'ADMIN'}/>
                        )
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>No users found.</p>
            )}
        </div>
    );
};

export default UsersGrid;

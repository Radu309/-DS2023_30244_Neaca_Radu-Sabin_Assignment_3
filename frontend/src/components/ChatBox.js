import React, {useEffect, useRef, useState} from 'react';
import SockJs from "react-stomp";

const headerStyle = {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
};
const messageContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
};
const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderTop: '1px solid #ccc',
};
const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
    border: 'none',
};
const messageStyle = {
    marginBottom: '8px',
    padding: '8px',
    borderRadius: '8px',
    maxWidth: '70%',
};

const ChatBox = (props) => {
    const user = props.user;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const sockJsClientRef = useRef(null);

    const chatBoxStyle = {
        position: 'fixed',
        bottom: 20,
        right: props.rightPos,
        width: '250px',
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
    };

    useEffect(() => {
        return () => {
            if (sockJsClientRef.current) {
                sockJsClientRef.current.deactivate();
            }
        };
    }, []);

    const handleInputChange = (event) => {
        setInputMessage(event.target.value);
    };

    const handleReceiveMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    const handleSendMessage = () => {
        console.log(user);
        if (sockJsClientRef.current && inputMessage.trim() !== '') {
            const newMessage = {
                userId: user.id.toString(),
                userRole: "admin",
                text: inputMessage.toString(),
            };

            sockJsClientRef.current.sendMessage('/app/sendMessage', JSON.stringify(newMessage));
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInputMessage('');
        }
    };

    return (
        <div>
            <div style={chatBoxStyle}>
                <div style={headerStyle}>
                    <h2>{user.name}</h2>
                </div>
                <div style={messageContainerStyle}>
                    {messages.map((message, index) => (
                        <div key={index}
                             style={{
                                 ...messageStyle,
                                 alignSelf: message.userRole === 'admin' ? 'flex-start' : 'flex-end',
                                 backgroundColor: message.userRole === 'admin' ? '#e1e1e1' : '#3498db',
                                 color: message.userRole === 'admin' ? '#000' : '#fff',
                             }}
                        >
                            <strong>{message.userRole}:</strong> {message.text}
                        </div>
                    ))}
                </div>
                <div style={inputContainerStyle}>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                    />
                    <button onClick={handleSendMessage} style={buttonStyle}>
                        Send
                    </button>
                </div>
                <SockJs
                    url={'http://localhost:8081/ws'}
                    topics={['/user/message/admin/' + user.id]}
                    onConnect={() => console.log('connected')}
                    onDisconnect={() => console.log('Disconnected!')}
                    onMessage={(msg) => handleReceiveMessage(msg)}
                    debug={true}
                    ref={(client) => (sockJsClientRef.current = client)}
                />
            </div>
        </div>

    );
};

export default ChatBox;

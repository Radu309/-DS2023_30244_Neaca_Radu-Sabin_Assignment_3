import React, {useEffect, useRef, useState} from "react";
import SockJs from "react-stomp";

const chatBoxStyle = {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: '250px',
    height: '400px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
};
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
const ChatBoxClient = (props) => {
    const userId = props.user.id;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const sockJsClientRef = useRef(null);

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
        if (sockJsClientRef.current && inputMessage.trim() !== '') {
            const newMessage = {
                userId: userId.toString(),
                userRole: "client",
                text: inputMessage.toString(),
            };
            sockJsClientRef.current.sendMessage('/app/sendMessage', JSON.stringify(newMessage));
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInputMessage('');
        }
    };

    return (
        <div style={chatBoxStyle}>
            <div style={headerStyle}>
                <h2>Admin</h2>
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
                topics={['/user/message/client/' + userId]}
                onConnect={() => console.log('connected')}
                onDisconnect={() => console.log('Disconnected!')}
                onMessage={(msg) => handleReceiveMessage(msg)}
                debug={true}
                ref={(client) => (sockJsClientRef.current = client)}
            />
        </div>
    );
}

export default ChatBoxClient;
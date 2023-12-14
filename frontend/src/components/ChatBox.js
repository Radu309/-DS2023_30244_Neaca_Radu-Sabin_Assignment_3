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
    const userRole = props.userRole;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const sockJsClientRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [seen, setSeen] = useState(false);

    const chatBoxStyle = {
        position: 'fixed',
        bottom: 20,
        right: (props.index+1)*20 + props.index * 250,
        width: '250px',
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        zIndex: 9999,
    };

    useEffect(() => {
        return () => {
            if (sockJsClientRef.current) {
                sockJsClientRef.current = null;
            }
        };
    }, []);
    const handleInputChange = (event) => {
        const newMessage = {
            userId: user.id.toString(),
            userRole: userRole.toString(),
            text: 'is typing...',
        };
        sockJsClientRef.current.sendMessage('/app/isTyping', JSON.stringify(newMessage))
        setInputMessage(event.target.value);
    };

    const handleReceiveMessage = (newMessage) => {
        setSeen(false);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    const handleSendMessage = () => {
        console.log(user);
        if (sockJsClientRef.current && inputMessage.trim() !== '') {
            const newMessage = {
                userId: user.id.toString(),
                userRole: userRole.toString(),
                text: inputMessage.toString(),
            };

            sockJsClientRef.current.sendMessage('/app/sendMessage', JSON.stringify(newMessage));
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInputMessage('');
        }
    };

    const handleIsTyping = () => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };
    const handleSeen= () => {
        setSeen(true);
    };

    function handleClickComponent() {
            const newMessage = {
                userId: user.id.toString(),
                userRole: userRole.toString(),
                text: 'seen',
            };
            sockJsClientRef.current.sendMessage('/app/seen', JSON.stringify(newMessage));
    }

    return (
        <div>
            <div style={chatBoxStyle}>
                <div style={headerStyle} onClick={handleClickComponent}>
                    {userRole==='ADMIN' ?
                    <h2>TO {user.name}</h2>:
                    <h2>TO ADMIN</h2>}
                </div>
                <div style={messageContainerStyle} onClick={handleClickComponent}>
                    {messages.map((message, index) => (
                        <div key={index}
                             style={{
                                 ...messageStyle,
                                 alignSelf: message.userRole === 'ADMIN' ? 'flex-start' : 'flex-end',
                                 backgroundColor: message.userRole === 'ADMIN' ? '#e1e1e1' : '#3498db',
                                 color: message.userRole === 'ADMIN' ? '#000' : '#fff',
                             }}
                        >
                            <strong>{message.userRole.toLowerCase()}:</strong> {message.text}
                        </div>
                    ))}
                </div>
                <div style={{ alignItems: 'center', padding: '10px', paddingRight: '10px' }} onClick={handleClickComponent}>
                    <div style ={{justifyContent: 'flex-end'}}>
                        {isTyping ? 'is typing...' : null}
                    </div>
                    <div style ={{justifyContent: 'flex-start'}}>
                        {seen ? 'seen' : null}
                    </div>
                </div>
                <div style={inputContainerStyle}>
                    <input
                        onClick={handleClickComponent}
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
                    url={'http://localhost:8084/ws'}
                    topics={['/user/' + userRole.toString().toLowerCase() + '/' + user.id + '/message']}
                    onConnect={() => console.log('connected')}
                    onDisconnect={() => console.log('Disconnected!')}
                    onMessage={(msg) => handleReceiveMessage(msg)}
                    debug={true}
                    ref={(client) => (sockJsClientRef.current = client)}
                />
                <SockJs
                    url={'http://localhost:8084/ws'}
                    topics={['/user/' + userRole.toString().toLowerCase() + '/isTyping/' + user.id + '/message']}
                    onConnect={() => console.log('connected')}
                    onDisconnect={() => console.log('Disconnected!')}
                    onMessage={() => handleIsTyping()}
                    debug={true}
                    ref={(client) => (sockJsClientRef.current = client)}
                />
                <SockJs
                    url={'http://localhost:8084/ws'}
                    topics={['/user/' + userRole.toString().toLowerCase() + '/seen/' + user.id + '/message']}
                    onConnect={() => console.log('connected')}
                    onDisconnect={() => console.log('Disconnected!')}
                    onMessage={() => handleSeen()}
                    debug={true}
                    ref={(client) => (sockJsClientRef.current = client)}
                />
            </div>
        </div>

    );
};

export default ChatBox;

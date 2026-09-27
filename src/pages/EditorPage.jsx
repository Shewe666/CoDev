import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Action.js';
import Client from '../Components/Client';
import Editor from '../Components/Editor';
import { useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { initSocket } from '../socket.js';

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();

  const [clients, setClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Get username from location state or from stored user
  const username = location.state?.username ||
    JSON.parse(localStorage.getItem('user') || '{}').name || 'Anonymous';

  // Leave the room and go back to /join
  const handleLeave = () => {
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.LEAVE, { roomId });
      socketRef.current.disconnect();
    }
    reactNavigator('/join');
  };

  // Send a chat message
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (!socketRef.current) return;
    socketRef.current.emit('send-message', {
      roomId,
      username,
      message: newMessage.trim(),
    });
    setNewMessage('');
  };

  // Send message on Enter key
  const handleChatKeyUp = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  // Load previous chat messages from backend API
  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/rooms/${roomId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      // silently fail - chat history is optional
      console.log('Could not load chat history', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      // Handle socket errors
      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/join');
      }
      socketRef.current.on('connect_error', handleErrors);
      socketRef.current.on('connect_failed', handleErrors);

      // Join the room
      socketRef.current.emit(ACTIONS.JOIN, { roomId, username });

      // Listen for participant updates
      socketRef.current.on(ACTIONS.JOINED, ({ clients: updatedClients, username: joinedUser }) => {
        if (joinedUser !== username) {
          toast.success(`${joinedUser} joined the room.`);
        }
        setClients(updatedClients);
      });

      // Listen for a user disconnecting
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username: leftUser }) => {
        toast(`${leftUser} left the room.`, { icon: '👋' });
        setClients((prev) => prev.filter((c) => c.socketId !== socketId));
      });

      // Listen for incoming chat messages
      socketRef.current.on('receive-message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      // Load past messages from DB
      loadMessages();
    };

    init();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.off('receive-message');
        socketRef.current.off('connect_error');
        socketRef.current.off('connect_failed');
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Redirect if no username provided
  if (!location.state && !localStorage.getItem('user')) {
    return <Navigate to="/join" />;
  }

  return (
    <div className='mainWrap'>
      {/* Sidebar - connected users */}
      <div className='aside'>
        <div className='asideInner'>
          <div className='logoAside'>
            <img className='logoImg' src="/logo.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {clients.map((client) => (
              <Client
                key={client.socketId}
                username={client.username}
              />
            ))}
          </div>
        </div>
        <button
          className='btn copyBtn'
          onClick={() => {
            navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied!');
          }}
        >
          Copy ROOM ID
        </button>
        <button className='btn leaveBtn' onClick={handleLeave}>
          Leave
        </button>
      </div>

      {/* Monaco Editor area */}
      <div className='editorWrap'>
        <Editor socket={socketRef.current} roomId={roomId} />
      </div>

      {/* Chat panel */}
      <div className='chatWrap'>
        <div className='chatHeader'>💬 Room Chat</div>
        <div className='chatBox'>
          {messages.map((msg, i) => (
            <div key={i} className='chatMessage'>
              <strong>{msg.username}</strong>
              {msg.message}
            </div>
          ))}
        </div>
        <div className='chatInputRow'>
          <input
            className='chatInput'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={handleChatKeyUp}
            placeholder='Type a message...'
          />
          <button className='btn sendBtn' onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;

import React, { useState , useRef, useEffect} from 'react'
import toast from 'react-hot-toast';
import ACTIONS from '../Action.js';
import Client from '../Components/Client'
import Editor from '../Components/Editor'
import { useNavigate } from 'react-router-dom';
import { initSocket } from '../socket.js';
import {useLocation,Navigate,useParams} from 'react-router-dom';

const EditorPage = () => {
  const socketRef= useRef(null);
  const location = useLocation();
  const {roomId} = useParams();
  const reactNavigator = useNavigate();

  //hardcoded 
  const[clients, setClients]=useState([
    // {socketId :1 , username:'Shivi M'},
    // { socketId: 2, username: 'Vin Sharma'},
    // { socketId: 3, username: 'Aman'},

  ])
  const handleLeave = () => {
  reactNavigator('/');
};

  useEffect(()=>{
    const init = async() => {
      socketRef.current=await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
      console.log('socket error', e);
      toast.error('Socket connection failed, try again later.');
      reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username: location.state?.username,
      });
      //Listen for joined event 
      socketRef.current.on(ACTIONS.JOINED,
        ({clients,username,socketId})=>{
          if(username!==location.state?.username){
            toast.success(`${username} joined the room.`)

          }
          setClients(clients)
      })
    }

    init();
},[]);

  if(!location.state){
    return <Navigate  to="/" />
  }

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logoAside'>
            <img className='logoImg' src="/logo.png" alt="logo image" />

          </div>
          <h3>Connected</h3>
          {/* client list */}
          <div className='clientsList'>
              {
                clients.map((client)=>{
                  return(
                  <Client key={client.socketId} 
                   username={client.username}
                
                  />
                  )
                }
                )
              }
          </div>

        </div>
        <button className='btn copyBtn'> Copy ROOM ID </button>
        <button className='btn leaveBtn' onClick={handleLeave}> Leave</button>

      </div>
      <div className='editorWrap' style={{backgroundColor:'white'}}>
        <Editor />
      </div>


    </div>
  )
}

export default EditorPage

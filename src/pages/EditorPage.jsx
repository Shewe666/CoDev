import React, { useState } from 'react'
import Client from '../Components/Client'
import Editor from '../Components/Editor'
import { useNavigate } from 'react-router-dom';

const EditorPage = () => {
  const[clients, setClients]=useState([
    {socketId :1 , username:'Shivi M'},
    { socketId: 2, username: 'Vin Sharma'},
    { socketId: 3, username: 'aman'},

  ])
    const navigate = useNavigate();

  function handleLeave(){
    navigate('/');
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

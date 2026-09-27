import React, { useState } from 'react'
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomId , setRoomId]= useState(''); 
  const [username, setUsername] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return savedUser.name || localStorage.getItem('username') || '';
  });

  //function for uid..
   const createNewRoom=(e)=>{
    e.preventDefault();//to stop the page reload
    const id = uuidv4();
    setRoomId(id);
    toast.success('Created a new Room!')
    // console.log(id); 
  
   }

   function joinRoom(e){
      if(!roomId || !username){
        toast.error('Room ID and Username is Required!')
        return;
      }
      //if user have entered both-> we will redirect by using useNavigate
      navigate(`/editor/${roomId}` ,{
          state:{
            username,
          }
        }); 
   };

   //Enter Functionality...
   function handleInputEnter(e){
    // console.log('event',e.code);
    if(e.code==='Enter'){
      joinRoom();
    }
   }
  
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img src="/logo.png" alt="codev-logo" className='logo' />
            <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
            <div className='inputGroup'>
                <input type="text"
                  className='inputBox'
                  placeholder='ROOM ID'  
                  onChange={(e)=>setRoomId(e.target.value)}
                  value={roomId}  
                  onKeyUp={handleInputEnter}
                  />

                 <input type="text"
                  className='inputBox'
                  placeholder='USERNAME'  
                  onChange={(e)=>setUsername(e.target.value)} 
                  value={username} 
                  onKeyUp={handleInputEnter}
                  />
                    
                 <button className='btn joinBtn'
                 onClick={(joinRoom)}
                 >
                  Join</button>
                 <span className='createInfo'>If you don't have an invite than create &nbsp;
                  <a  onClick={createNewRoom} href='' className='createNewBtn' >new room</a>
                 </span>
                 <div style={{ marginTop: '14px', textAlign: 'center' }}>
                   <button
                     onClick={() => {
                       localStorage.removeItem('token');
                       localStorage.removeItem('user');
                       localStorage.removeItem('username');
                       toast.success('Logged out successfully');
                       navigate('/login');
                     }}
                     style={{
                       background: 'transparent',
                       border: 'none',
                       color: '#ff4b4b',
                       cursor: 'pointer',
                       fontSize: '13px',
                       textDecoration: 'underline'
                     }}
                   >
                     Logout
                   </button>
                 </div>
            </div>
 
        </div>
      <footer>
        <h4>Built with💛by <a href='https://github.com/Shewe666/CoDev'>S&V</a></h4>
      </footer>

    </div>
  );
};

export default JoinRoom;

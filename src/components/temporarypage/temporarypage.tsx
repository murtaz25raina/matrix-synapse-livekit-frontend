import { FC, useEffect, useState } from "react";
import {  Room } from "matrix-js-sdk";
// import RoomTile from "./RoomTile/RoomTile";
import "./temporarypage.css";
// import { TypingIndicatorProvider } from "../../providers/TypingIndicatorProvider";
import useRoomList from "../../hooks/useRoomList";
import MatrixChat from "../Chat/messages";
import { useClientContext } from "../../providers/ClientProvider";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { getLocalStorage } from "../../helpers/localStorage";
import { setVideoCallDetails } from "../../redux/store/videocall/videocallSlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";

const socket = io('http://localhost:3000');

interface RoomInfo  {
    roomId:string,
    roomName:string
}
const RoomList: FC = () => {
  const { rooms } = useRoomList();
  const navigate = useNavigate();
  const { client } = useClientContext();
  const [roomInfo,setRoomInfo] = useState<RoomInfo>({
    roomId:"",
    roomName:""
  });

  const [isCalling,setIsCalling] = useState(false);

  const [userWhoIsCalling,setUserWhoIsCalling] = useState("");
  const [userWhoIsGettingCall,setUserWhoIsGettingCall] = useState("");
  const [roomToken,setRoomToken] = useState("");
  const [roomName,setRoomName] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   const loggedInUser = getLocalStorage("username");
    
   
  //   socket.on('userJoined', (userName,roomToken,userToBeCalled,roomName) => {
  //     if(loggedInUser && loggedInUser!==userName && loggedInUser===userToBeCalled){
  //     // alert(`${userName} is calling`);
  //     setIsCalling(true);
  //     setRoomName(roomName);
  //     setUserWhoIsGettingCall(userToBeCalled);
  //     setUserWhoIsCalling(userName);
  //     setRoomToken(roomToken)
  //     }
  //   });

  //   socket.on('userLeft', (userName,userToBeCalled) => {
  //     if(loggedInUser && loggedInUser!==userName && loggedInUser===userToBeCalled){
  //       setIsCalling(false);
  //     setRoomName("");
  //     setUserWhoIsGettingCall("");
  //     setUserWhoIsCalling("");
  //     setRoomToken("")
  //     }
  //   });

  //   socket.on('userRejected', (userName,userWhoIsCalling) => {
  //     alert(userName);
  //     // && loggedInUser!==userWhoIsCalling
  //     if(loggedInUser && loggedInUser===userName ){
  //       setIsCalling(false);
  //       alert(`${loggedInUser} rejected the call`)
  //       navigate("/chat")
  //     }
  //   });

  //   return () => {
  //     socket.off('userJoined');
  //     socket.off('userLeft');
  //     socket.off('userRejected');
  //   };
  // }, []);

  
  const showChat = (roominfo:RoomInfo)=>{
    setRoomInfo(roominfo);
  }

  const logout =()=> {
      client
        .logout(true)
        .then(async () => {
          client.stopClient();
          await client.clearStores();
          localStorage.clear();
          navigate('/login')
          window.location.reload();
          
        })
        .catch((errors) => {
          console.error("Error during logout:", errors.error);
        });
  }

  // const acceptCallHandler = async() =>{
  //   try {
  //     const resp = await fetch(
  //       `http://localhost:3000/getToken?roomName=${roomName}&participantName=${userWhoIsGettingCall}`
  //     );
  //     const text = await resp.text();
  //     dispatch(setVideoCallDetails({
  //       roomToken:text,
  //       userName:userWhoIsGettingCall,
  //       userToBeCalled:userWhoIsCalling,
  //       roomName:roomName
  //     }))
  //     navigate("/videocall")
      
  //   } catch (error) {
  //     console.error("Error fetching token:", error);
  //   }
  // }

  // const rejectCallHandler = () =>{
  //   socket.emit('rejectCall', userWhoIsGettingCall,userWhoIsCalling);
  // }
  
  return (
      <div>
        <div className="n-room-list-container">
        <div className="n-room-left-panel">
        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><h1>Rooms</h1><div style={{cursor:'pointer'}} onClick={()=>logout()}>logout</div></div>
        <ul className="n-room-name-list">
        {rooms?.map((room: Room, index: number) => (
            <li key={index}>
                <div className="n-room-name" onClick={()=>showChat({roomId:room.roomId,roomName:room.name})}>{room.name}</div>
            </li>
        ))}
        </ul>
        </div>
        <div className="n-room-right-panel">
            {roomInfo.roomId !=="" && <MatrixChat roomInfo={roomInfo}/>}
        </div>
      </div>
      </div>
  );
};

export default RoomList;

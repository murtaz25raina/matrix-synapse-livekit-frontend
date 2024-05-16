import React, { useState, useEffect } from 'react';
import { MatrixClient, MatrixEvent, ClientEvent } from 'matrix-js-sdk';
import { useClientContext } from '../../providers/ClientProvider';
import './messages.css';
import "@livekit/components-styles";
import VideoConferenceComponent from '../VideoConference/videoconference';
import { getLocalStorage } from '../../helpers/localStorage';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from '../../redux/store';
import { selectVideoCallState, setVideoCallDetails } from '../../redux/store/videocall/videocallSlice';
import { useNavigate } from 'react-router-dom';



const MatrixChat: React.FC<{ roomInfo: { roomId: string, roomName: string } }> = (props) => {
  const { roomInfo } = props;
  const [messages, setMessages] = useState<MatrixEvent[]>([]);
  const { client } = useClientContext();
  const [textMessage, setTextMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoCallToken, setVideoCallToken] = useState<string>("")
  const [videoCallUsername, setVideoCallUsername] = useState<string>("")
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { roomToken } = useSelector(selectVideoCallState);


 
  
  useEffect(() => {
    if (!client) return;
    
   
    client.startClient();
    const loggedInUser = getLocalStorage("username");
    if(loggedInUser){
    setVideoCallUsername(loggedInUser);
    }

    if(videoCallToken!==""){
      setVideoCallToken("");
      // socket.emit('leaveCall', loggedInUser,roomInfo.roomName);
      }

    const handleSync = (state: string) => {
      if (state === "PREPARED" || state === "SYNCING") {
        const room = client.getRoom(roomInfo.roomId);
        if (room) {
          setIsLoading(false);
          setMessages(room.timeline);
        }
      }
    };

    client.on(ClientEvent.Sync, handleSync);

    // Cleanup on component unmount
    return () => {
      client.removeListener(ClientEvent.Sync, handleSync);
      client.stopClient();
    };
  }, [client, roomInfo.roomId]);

  const sendMessage = () => {
    if (!client || !roomInfo.roomId || textMessage.trim() === '') return;
    
    client.sendTextMessage(roomInfo.roomId, textMessage)
      .then(() => {
        setTextMessage('');
      })
      .catch((err) => {
        console.error('Error sending message:', err);
      });
  };


  const roomEnterHandler = async () => {
    try {
      const resp = await fetch(
        `http://localhost:3000/getToken?roomName=${roomInfo.roomId}&participantName=${videoCallUsername}`
      );
      // console.log(resp);
      const text = await resp.text();
      setVideoCallToken(text);
      dispatch(setVideoCallDetails({
        roomToken:text,
        userName:videoCallUsername,
        userToBeCalled:roomInfo.roomName,
        roomName:roomInfo.roomId,
        // isVideoCall:true
      }))
      navigate("/videocall")
      
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };



  const audioRoomEnterHandler = async () => {
    try {
      const resp = await fetch(
        `http://localhost:3000/getToken?roomName=${roomInfo.roomId}&participantName=${videoCallUsername}`
      );
      // console.log(resp);
      const text = await resp.text();
      setVideoCallToken(text);
      dispatch(setVideoCallDetails({
        roomToken:text,
        userName:videoCallUsername,
        userToBeCalled:roomInfo.roomName,
        roomName:roomInfo.roomId,
        // isVideoCall:false
      }))
      navigate("/audiocall")
      
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  return (
    <div className='n-chat-page-container'>
      <div>
        <div style={{display:'flex',justifyContent:"space-between",flexDirection:'row',alignItems:'center'}}>
        <h2>{roomInfo.roomName}</h2>
        <div style={{display:'flex',flexDirection:'row',gap:'10px'}}>
        {roomToken ==="" && <div onClick={()=>audioRoomEnterHandler()} style={{cursor:'pointer'}}>
            Audio Call
        </div>}
        {roomToken ==="" && <div onClick={()=>roomEnterHandler()} style={{cursor:'pointer'}}>
            Video Call
        </div>}
        </div>
        </div>
        <div>
        </div>
        <ul>
          {!isLoading && messages.map((event, index) => {
          // console.log(event.getContent().body);
          if(event.getContent().body){
          return(
            <li key={index}>
              {event.sender?.name}: {event.getContent().body}
            </li>
          )}
          }
          )}
        </ul>
        {isLoading && <p>Loading...</p>}
      </div>
      
      <div className='n-send-message-form'>
        <textarea
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          className='n-textarea'
        ></textarea>
        <button onClick={() => sendMessage()} className='n-button-send'>Send</button>
      </div>
    </div>
  );
};

export default MatrixChat;

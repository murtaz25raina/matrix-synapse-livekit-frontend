import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  LayoutContextProvider,
  formatChatMessageLinks,
  // useParticipants,
  // ParticipantLoop,
  // ParticipantName,
  // RoomAudioRenderer,
  // ControlBar,
  // useTracks,
  // GridLayout,
  // ParticipantTile,
  // useChat,
  // Chat,
  // ChatEntry,
  // ChatToggle,
  // useChatToggle,
} from "@livekit/components-react";
import "./videoconference.css";
// import { VideoConferenceInterfaceProps } from "./VideoConferenceInterface";
// import { Track } from "livekit-client";
// import { useEffect } from "react";
import io from 'socket.io-client';
import { useDispatch, useSelector } from "react-redux";
import { selectVideoCallState, setVideoCallDetails } from "../../redux/store/videocall/videocallSlice";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useClientContext } from "../../providers/ClientProvider";
import { setIsCalling, setOnCall } from "../../redux/store/videocallnotification/videocallnotificationSlice";


const socket = io('http://localhost:3000');
const serverUrl = "http://127.0.0.1:7880";

const VideoConferenceComponent = () => {
  // const { userToken, removeToken,userName,roomName,userToBeCalled } = props;
  
  const dispatch = useDispatch<AppDispatch>()
  const {userName,roomToken,userToBeCalled,roomName} = useSelector(selectVideoCallState);
  const navigate = useNavigate();
  const { startClient, setupSync } = useClientContext();
  //   const serverUrl = 'wss://test-app-ev2paxwn.livekit.cloud';
  //   const token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTQ5MjgzMTUsImlzcyI6IkFQSWhreFRaZGRpd05rVSIsIm5iZiI6MTcxNDkyMTExNSwic3ViIjoicXVpY2tzdGFydCB1c2VyIHppcTk1MyIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.DWhQVqgIqj1Q-pXWJ53N4lWv8etlzfZnR3PnuZOqozc';
  // const [chatToggle, setChatToggle] = useState(false);



  const handleJoinCall = () => {
    dispatch(setOnCall(true))
    dispatch(setIsCalling(false))
    socket.emit('joinCall', userName,roomToken,userToBeCalled,roomName,"video");
  };

  const handleDisconnectCall = async () => {
    dispatch(setOnCall(false))
    dispatch(setIsCalling(false))
    dispatch(setVideoCallDetails({
      roomToken:"",
      userName:"",
      userToBeCalled:"",
      roomName:"",
      // isVideoCall:true,
    }))

    await startClient();
          setupSync();
    navigate("/chat")
    socket.emit('leaveCall', userName,userToBeCalled);
     
  }

  return (
    <LayoutContextProvider>
      <LiveKitRoom
        video={false}
        audio={true}
        token={roomToken}
        serverUrl={serverUrl}
        onDisconnected={handleDisconnectCall}
        data-lk-theme="default"
        style={{ height: "80dvh"}}
        onConnected={handleJoinCall}
      >
        {/* <div style={{width:'80%'}}> */}
        {/* <MyVideoConference/> */}
        <VideoConference
          // SettingsComponent={() => <div>hello</div>}
          chatMessageFormatter={formatChatMessageLinks}
          
        >
         
         </VideoConference>
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        {/* <RoomAudioRenderer/> */}
        {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
        {/* <ControlBar controls={{chat:true,settings:true}}>
        <ChatToggle/>
          </ControlBar> */}
        {/* </div> */}
        {/* <Chat style={{height:'100%',width:'20%'}} messageFormatter={formatChatMessageLinks}> */}
        {/* <ChatEntry entry={}>

      </ChatEntry> */}
        {/* </Chat> */}
        
      </LiveKitRoom>
    </LayoutContextProvider>
  );
};

export default VideoConferenceComponent;

// function MyVideoConference() {
//   const participants = useParticipants();
//   const { send, update, chatMessages, isSending } = useChat();
//   const [message, setMessage] = useState('');
//   const { mergedProps } = useChatToggle({props:{}});
//   const [showChat,setShowChat] = useState(false);

//   const sendMessage = async () => {
//     if (send && message.trim() !== '') {
//       await send(message);
//       setMessage('');
//     }
//   };
  
//   // `useTracks` returns all camera and screen share tracks. If a user
//   // joins without a published camera track, a placeholder track is returned.
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Camera, withPlaceholder: true },
//       { source: Track.Source.ScreenShare, withPlaceholder: false },
//     ],
//     { onlySubscribed: false }
//   );
//   return (
//     <div>
//     <GridLayout
//       tracks={tracks}
//       style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
//     >
//       {/* The GridLayout accepts zero or one child. The child is used
//       as a template to render all passed in tracks. */}
//       <ParticipantTile />
//       {/* <ParticipantLoop  participants={participants}>
//         <ParticipantTile/> */}
//       {/* <ParticipantName /> */}
//       {/* </ParticipantLoop> */}
//     </GridLayout>
// <div style={{background:'black'}}>
//   {showChat && <div>
//       <div>
//         {chatMessages.map((msg,i) => (
//           <div key={i}>{msg.from?.identity} : {msg.message}</div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>
//       </div>}
//       <button {...mergedProps} onClick={()=>setShowChat(!showChat)}>Toggle Chat</button>
//     </div>
//     </div>
//   );
// }

// LIVEKIT_API_KEY=APIhkxTZddiwNkU
// LIVEKIT_API_SECRET=E0EZV9ineoIDX8WRnKiE2JABUGfh0JsnOby0Yxkce9QB

// LIVEKIT_API_KEY=devkey
// LIVEKIT_API_SECRET=secret

//livekit-server --dev

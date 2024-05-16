import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  LayoutContextProvider,
  formatChatMessageLinks,
  AudioConference,
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
import "./audioconference.css";
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

const AudioConferenceComponent = () => {
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
    socket.emit('joinCall', userName,roomToken,userToBeCalled,roomName,"audio");
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
        <AudioConference/>  
        
      </LiveKitRoom>
    </LayoutContextProvider>
  );
};

export default AudioConferenceComponent;
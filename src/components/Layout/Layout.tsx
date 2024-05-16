import { FC, useEffect, useState } from "react";
import Auth from "../Auth/Auth";
import "./Layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../helpers/localStorage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { selectVideoCallNotificationState, setIsCalling, setRoomName, setUserWhoIsCalling, setUserWhoIsGettingCall } from "../../redux/store/videocallnotification/videocallnotificationSlice";
import { selectVideoCallState, setIsVideoCall, setVideoCallDetails } from "../../redux/store/videocall/videocallSlice";


const socket = io('http://localhost:3000');

const Layout: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {userWhoIsCalling,roomName,userWhoIsGettingCall,onCall,isCalling,} = useSelector(selectVideoCallNotificationState);
  const { isVideoCall } = useSelector(selectVideoCallState);
 const navigate = useNavigate();
 let loggedInUser = getLocalStorage("username");;
  useEffect(() => {
     loggedInUser = getLocalStorage("username");
    
   
    socket.on('userJoined', (caller,roomToken,reciever,roomName,callType) => {
      if(loggedInUser && loggedInUser!==caller  && loggedInUser===reciever){
        dispatch(setIsCalling(true))
        dispatch(setUserWhoIsCalling(caller))
        dispatch(setRoomName(roomName))
        dispatch(setUserWhoIsGettingCall(reciever))
        console.log("callType",callType)
        if(callType ==="video"){
          // console.log("ooo")
        dispatch(setIsVideoCall(true))
      }
      else{
        // console.log("hhahaah")
        dispatch(setIsVideoCall(false))
      }
    }});

    socket.on('userLeft', (userName,userToBeCalled) => {
      if(loggedInUser && loggedInUser!==userName && loggedInUser===userToBeCalled){
        dispatch(setIsCalling(false))
        dispatch(setUserWhoIsCalling(""))
        dispatch(setRoomName(""))
        dispatch(setUserWhoIsGettingCall(""))
      }
    });

    socket.on('userRejected', (userName,userWhoIsCalling) => {
      alert(userName);
      
      if(loggedInUser && loggedInUser===userName && loggedInUser!==userWhoIsCalling ){
      }
    });

    return () => {
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('userRejected');
    };
  }, []);



  const acceptCallHandler = async() =>{
    try {
      const resp = await fetch(
        `http://localhost:3000/getToken?roomName=${roomName}&participantName=${userWhoIsGettingCall}`
      );
      const text = await resp.text();
      dispatch(setVideoCallDetails({
        roomToken:text,
        userName:userWhoIsGettingCall,
        userToBeCalled:userWhoIsCalling,
        roomName:roomName,
        // isVideoCall:isVideoCall
      }))
      if(isVideoCall){
      navigate("/videocall")
      }
      else{
        navigate('/audiocall')
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }

  console.log(isCalling,onCall)


  return (
    <div className="layout-container">
      {loggedInUser ? <div>{onCall ? <div>{loggedInUser} is on call</div>:<div>{loggedInUser} is free</div> }</div>:""}
      <div>{isCalling && !onCall ? <div>{userWhoIsCalling} is {isVideoCall?"Video":"Audio"} calling 
      <button onClick={()=>acceptCallHandler()}>Accept</button>
      
      {/* <button>Reject</button> */}
      </div>:""}</div>
      <Outlet/>
    </div>
  );
};

export default Auth({ component: Layout });

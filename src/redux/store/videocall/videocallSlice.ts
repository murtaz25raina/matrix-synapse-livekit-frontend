import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface callState {
    isVideoCall:boolean;
    roomToken :string;
    userName : string;
    userToBeCalled : string;
    roomName: string;
}

interface videoCallState {
  // isVideoCall:boolean;
  roomToken :string;
  userName : string;
  userToBeCalled : string;
  roomName: string;
}


const initialState: callState = {
  isVideoCall:true,
  roomToken: "",
  userName: "",
  userToBeCalled : "",
  roomName: ""
};

const videoCallSlice = createSlice({
  name: "videoCallSlice",
  initialState,
  reducers: {
    setVideoCallDetails : (state,action:PayloadAction<videoCallState>) => {
        // state.isVideoCall = action.payload.isVideoCall;
        state.roomToken = action.payload.roomToken;
        state.userName = action.payload.userName;
        state.userToBeCalled = action.payload.userToBeCalled;
        state.roomName = action.payload.roomName;
    },
    setRoomToken: (state, action: PayloadAction<string>) => {
        state.roomToken = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
        state.userName = action.payload;
  
    },
    setUserToBeCalled: (state, action: PayloadAction<string>) => {
        state.userToBeCalled = action.payload;
    },
    setRoomName: (state, action: PayloadAction<string>) => {
        state.roomName = action.payload;
    },
    setIsVideoCall : (state,action: PayloadAction<boolean>) => {
      state.isVideoCall = action.payload;
    }
  },
});

export const { setRoomName, setUserName,setUserToBeCalled,setRoomToken,setVideoCallDetails ,setIsVideoCall} = videoCallSlice.actions;
export const selectVideoCallState = (state: RootState) => state.videoCall;
export default videoCallSlice.reducer;

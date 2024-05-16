import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface videoCallNotificationState {
    isCalling :boolean;
    onCall : boolean;
    userWhoIsCalling :string;
    userWhoIsGettingCall : string;
    roomName: string;
}



const initialState: videoCallNotificationState = {
  isCalling: false,
  onCall: false,
  userWhoIsCalling: "",
  userWhoIsGettingCall: "",
  roomName: ""
};

const videoCallNotificationSlice = createSlice({
  name: "videoCallSlice",
  initialState,
  reducers: {
    setIsCalling: (state,action:PayloadAction<boolean>) =>{
        state.isCalling = action.payload;
    },
    setOnCall: (state,action:PayloadAction<boolean>) =>{
        state.onCall = action.payload;
    },
    setUserWhoIsCalling: (state,action:PayloadAction<string>) => {
        state.userWhoIsCalling = action.payload;
    },
    setUserWhoIsGettingCall: (state,action:PayloadAction<string>) => {
        state.userWhoIsGettingCall = action.payload;
    },
    setRoomName: (state, action: PayloadAction<string>) => {
        state.roomName = action.payload;
    },
  },
});

export const { setRoomName, setIsCalling,setOnCall,setUserWhoIsCalling,setUserWhoIsGettingCall } = videoCallNotificationSlice.actions;
export const selectVideoCallNotificationState = (state: RootState) => state.videCallNotification;
export default videoCallNotificationSlice.reducer;

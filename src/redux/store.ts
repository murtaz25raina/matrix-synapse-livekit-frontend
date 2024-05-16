import { configureStore } from "@reduxjs/toolkit";
import videoCallReducer from "./store/videocall/videocallSlice";
import videoCallNotification from "./store/videocallnotification/videocallnotificationSlice";

export const store = configureStore({
  reducer: {
    videoCall:videoCallReducer,
    videCallNotification:videoCallNotification
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import "./App.css"
import { ClientProvider } from "./providers/ClientProvider";
import TemporaryPage from "./components/temporarypage/temporarypage";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import VideoConferenceComponent from "./components/VideoConference/videoconference";
import Layout from "./components/Layout/Layout";
import AudioConferenceComponent from "./components/AudioConference/audioconference";

const App = ()=>{
  return(
    <Provider store={store}>
      <ClientProvider>
      <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={Layout}>
      <Route path="/chat" element={<TemporaryPage/>}/>
      <Route path="/videocall" element={<VideoConferenceComponent/>}/>
      <Route path="/audiocall" element={<AudioConferenceComponent/>}/>
      </Route>
      </Routes>
      </ClientProvider>
      </Provider>
  )
}

export default App;
import { FC, useState } from "react";
import { useClientContext } from "../../providers/ClientProvider";
import { setLocalStorage } from "../../helpers/localStorage.js";
import { useNavigate } from "react-router";
import { createClient } from "matrix-js-sdk";
import './login.css';

const Login: FC = () => {

    const[userName,setUserName]=useState("");
    const[password,setPassword] = useState("");

  const navigate = useNavigate();
  const { startClient, setupSync } = useClientContext();
  const client = createClient({
    baseUrl: "http://localhost:8008/",
  });

    const onSubmit = async (
      ) => {
        try {
          const response = await client.login("m.login.password", {
            user: userName,
            password: password,
          });
          const { user_id, access_token, device_id} = response;
          setLocalStorage([
            { key: "user_id", value: user_id },
            { key: "access_token", value: access_token },
            { key: "device_id", value: device_id },
            {key:"username",value: userName}
          ]);
          await startClient();
          setupSync();
          navigate("/chat");
        } catch (error) {
          console.error("Error during login:", error);
        }
      };



return(
    <div className="n-login-container">
        <h1>Login</h1>
        <div className='n-login-form'>
            <input type="text" className='n-login-form-input' placeholder="Username" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
            <input type="password" className='n-login-form-input' placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button className='n-login-form-button' onClick={()=>onSubmit()}>Login</button>
        </div>
    </div>
)
}

export default Login;
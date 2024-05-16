import { FC, useEffect, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../helpers/localStorage";

const Auth: FC<{ component: ComponentType }> = ({ component: Component }) => {
  const Authentication: FC = () => {
    const navigate = useNavigate();
    const accessToken = getLocalStorage("access_token");
    useEffect(() => {
      if (!accessToken) {
        navigate("/login");
      }
    }, [accessToken, navigate]);

    return accessToken ? <Component /> : null;
  };

  return <Authentication />;
};

export default Auth;

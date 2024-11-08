import { useAuth0 } from "@auth0/auth0-react";
import { useCreateUser } from "../api/user-api";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const AuthCallBackPage = () => {
  const { user } = useAuth0();
  const { createUser, isLoading } = useCreateUser();
  const navigate = useNavigate();
  const isUserSaved = useRef<boolean>(false);

  useEffect(() => {
    if (user?.sub && user?.email && !isUserSaved.current) {
      createUser({ email: user.email, auth0Id: user.sub }).then(() => {
        isUserSaved.current = true;
        navigate("/");
      });
    }
  }, []);

  if (isLoading)
    return (
      <div className="min-h-dvh flex justify-center items-center">
        <div className="animate-spin border-l-2 border-t-2  border-primary rounded-full size-14"></div>
      </div>
    );
};

export default AuthCallBackPage;

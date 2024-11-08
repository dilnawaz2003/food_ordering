import { AppState, Auth0Provider, User } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

interface PropType {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: PropType) => {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUrl = import.meta.env.VITE_REDIRECT_URL;

  if (!domain || !clientId || !redirectUrl)
    throw new Error("Unable to initalize auth");

  const onRedirectCallback = (appState?: AppState, user?: User) => {
    // console.log("state: ", appState);
    // console.log("user: ", user);
    // if (user?.sub && user?.email) {
    // }

    navigate("/auth-profile");
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUrl,
        audience: "food-order-mern-api",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;

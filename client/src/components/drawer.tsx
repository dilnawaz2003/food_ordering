import { AiOutlineClose } from "react-icons/ai";
import { closeDrawer } from "../redux/ui-slice";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Drawer = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();

  const hideDrawer = () => {
    dispatch(closeDrawer());
  };
  return (
    <div className="min-w-full min-h-full z-10  absolute flex  ">
      <div className="bg-black opacity-55 flex-1" onClick={hideDrawer}></div>
      <div className="w-3/5 bg-white p-3  flex flex-col gap-2 animate-drawer-animation">
        <div className="flex justify-end">
          <AiOutlineClose onClick={hideDrawer} />
        </div>
        {!isAuthenticated && (
          <>
            <h1 className="font-bold">Welcome To Foodify</h1>
            <div className="flex">
              <button
                onClick={() => loginWithRedirect()}
                className="flex-1 bg-[#D31B27] text-white  p-1 rounded-md "
              >
                Log IN
              </button>
            </div>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/" className="font-bold hover:text-primary">
              User Profile
            </Link>
            <div className="flex">
              <button
                onClick={() => logout()}
                className="flex-1 bg-[#D31B27] text-white  p-1 rounded-md "
              >
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Drawer;

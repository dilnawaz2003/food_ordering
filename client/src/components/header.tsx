import { FaBars, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openDrawer } from "../redux/ui-slice.ts";
import { useAuth0 } from "@auth0/auth0-react";
import { RootState } from "../redux/store.ts";
import { openUserModel, closeUserModel } from "../redux/ui-slice.ts";
import { useRef, useEffect } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const showUserModel = useSelector(
    (state: RootState) => state.uislice.showUserModel
  );
  // console.log(showUserModel);
  const { isAuthenticated, loginWithRedirect, user, logout, isLoading } =
    useAuth0();

  const showDrawer = () => {
    dispatch(openDrawer());
  };

  const login = () => {
    loginWithRedirect();
  };

  useEffect(() => {
    () => {};
  }, []);

  // console.log("user 2 : ", user);

  return (
    <nav className="w-full flex justify-between h-16 items-center p-3 relative">
      <Link
        onClick={() => dispatch(closeUserModel())}
        to="/"
        className="tracking-tighter text-3xl font-bold text-primary"
      >
        Eatify
      </Link>
      <div className="sm:hidden" onClick={showDrawer}>
        <FaBars />
      </div>
      {isLoading && (
        <div className="sm:flex sm:gap-5 hidden">
          <div className="hidden sm:flex animate-pulse w-14 h-7 bg-gray-200 rounded-md "></div>
          <div className="hidden sm:flex animate-pulse w-14 h-7 bg-gray-200 rounded-md "></div>
        </div>
      )}
      {!isAuthenticated && !isLoading && (
        <div className="hidden sm:flex">
          <button onClick={login} className="text-primary font-bold">
            Log In
          </button>
        </div>
      )}
      {isAuthenticated && (
        <div className=" hidden sm:flex  gap-4 items-center">
          <Link to="/order-status" className="hover:text-primary">
            Order Status
          </Link>
          <div className="relative">
            <FaUser
              className="cursor-pointer border border-gray-300 rounded-full p-1 text-gray-300 size-10"
              onClick={() => dispatch(openUserModel())}
            />
            {isAuthenticated && showUserModel && (
              <div
                ref={wrapperRef}
                className="absolute text-nowrap left-[-100px] p-2  font-medium shadow-sm shadow-gray-600 bg-white rounded-md flex flex-col gap-2"
              >
                <Link
                  to="/user-profile"
                  onClick={() => dispatch(closeUserModel())}
                  className="hover:text-primary cursor-pointer"
                >
                  User Profile
                </Link>
                <Link
                  to="/manage-resturant"
                  onClick={() => dispatch(closeUserModel())}
                  className="hover:text-primary cursor-pointer"
                >
                  My Resturent
                </Link>
                <button
                  onClick={() => logout()}
                  className="w-full bg-[#D31B27] text-white  p-1 rounded-md hover:bg-[#d31b27c2]"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: any) {
  const dispatch = useDispatch();
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: { target: any }) {
      if (ref.current && !ref.current.contains(event.target)) {
        dispatch(closeUserModel());
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default Header;

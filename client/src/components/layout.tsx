import { RootState } from "../redux/store";
import Drawer from "./drawer";
import Footer from "./footer";
import Header from "./header";
import { useSelector } from "react-redux";

type PropType = {
  children: React.ReactNode;
};

const Layout = ({ children }: PropType) => {
  const showDrawer = useSelector(
    (state: RootState) => state.uislice.showDrawer
  );
  return (
    <div className="flex flex-col ">
      {showDrawer && <Drawer></Drawer>}
      <Header></Header>
      <div className="">{children}</div>
      <Footer></Footer>
    </div>
  );
};

export default Layout;

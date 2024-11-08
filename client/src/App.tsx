import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import AuthCallBackPage from "./pages/auth-callback-page";
import HomePage from "./pages/home-page";
import UserProfilePage from "./pages/user-pofile-page";
import ManageResturantpage from "./pages/manage-resturant";
import { Toaster } from "react-hot-toast";
import SearchResturants from "./pages/search-page/search-resturants-page";
import RestaurantDetailPage from "./pages/resaurant-detail-page";
import OrderStatusPage from "./pages/order-status-page";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route path="/auth-profile" element={<AuthCallBackPage />}></Route>
        <Route
          path="/user-profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        ></Route>
        <Route
          path="/manage-resturant"
          element={
            <Layout>
              <ManageResturantpage />
            </Layout>
          }
        ></Route>

        <Route
          path="/resturants/:city"
          element={
            <Layout>
              <SearchResturants />
            </Layout>
          }
        ></Route>

        <Route
          path="/resturant/:city/:id"
          element={
            <Layout>
              <RestaurantDetailPage />
            </Layout>
          }
        ></Route>

        <Route
          path="/order-status"
          element={
            <Layout>
              <OrderStatusPage />
            </Layout>
          }
        ></Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;

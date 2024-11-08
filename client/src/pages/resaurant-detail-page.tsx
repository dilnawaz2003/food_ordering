import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useGerRestaurantById } from "../api/search-reasturant-api";
import CheckoutButton from "../components/checkout-button";
import ConfirmDeliveryDetailsModel from "../components/confirm-delivery-details-model";
import LoadingSpinner from "../components/loading-spinner";
import { useCreateCheckOutSession } from "../api/order-api";

type CartItem = {
  _id: string;
  quantity: number;
  price: number;
  name: string;
};

const RestaurantDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { restaurant, isLoading, isError } = useGerRestaurantById(id);
  const {
    createSession,
    isLoading: isLoadingSession,
    isError: isErrorSession,
  } = useCreateCheckOutSession();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showModel, setShowModel] = useState<boolean>(false);

  const paymentHandler = async (userDetails: {
    email?: string;
    name: string;
    addressLine1: string;
    city: string;
    country: string;
  }) => {
    const cartItemsModified = cartItems.map((item) => ({
      menuItemId: item._id,
      name: item.name,
      quantity: item.quantity.toString(),
    }));
    console.log(restaurant._id);
    const res = await createSession({
      restaurantId: restaurant._id.toString(),
      cartItems: cartItemsModified,
      deliveryDetails: {
        email: userDetails.email as string,
        name: userDetails.name,
        addressLine1: userDetails.addressLine1,
        city: userDetails.city,
      },
    });
    console.log(res);
    window.location.href = res.url;
  };

  const getTotalCost = () => {
    const totalPrice = cartItems.reduce((previousValue, currValue) => {
      return (previousValue += currValue.quantity * currValue.price);
    }, 0);

    return totalPrice + restaurant.deliveryPrice;
  };

  const addToCart = (item: CartItem) => {
    const existingItem = cartItems.find((i) => i._id === item._id);
    if (existingItem) {
      const newCartItemsList = cartItems.filter((i) => i._id !== item._id);
      newCartItemsList.push({
        ...existingItem,
        quantity: existingItem.quantity + 1,
      });
      setCartItems(newCartItemsList);
    } else {
      setCartItems((prev) => [...prev, item]);
    }
  };

  const removeFromCart = (id: string) => {
    const newCartItemsList = cartItems.filter((item) => item._id !== id);
    setCartItems(newCartItemsList);
  };

  const closeModal = () => {
    setShowModel(false);
    // document.body.style.overflow = "auto"; // Restore scrolling
  };

  const CheckoutButtonHandler = async () => {
    if (isAuthenticated) {
      setShowModel(true);
    } else {
      await loginWithRedirect();
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <h1 className="min-h-screen font-bold font-3xl grid place-content-center">
        Some Thing Went Wrong
      </h1>
    );
  }
  // console.log(restaurant);
  return (
    <div className="min-h-screen">
      {showModel && (
        <ConfirmDeliveryDetailsModel
          isLoading={isLoadingSession}
          isOpen={showModel}
          onClose={closeModal}
          paymentHandler={paymentHandler}
        />
      )}
      <img
        src={restaurant.imageUrl}
        className="w-full h-80 object-contain px-10"
      ></img>
      <div className="mt-5 grid grid-cols-[2fr,1fr] gap-5 px-10">
        <div id="restaurant-info" className="">
          <div className="flex flex-col gap-2 rounded-md shadow-md p-2 ">
            <h1 className="font-bold text-2xl">
              {restaurant.resturantName || restaurant.restaurantName}
            </h1>
            <p className="text-gray-400">
              {restaurant.city},{restaurant.country}
            </p>
            <div>
              <div
                id="cuisines-list"
                className="text-gray-700 flex gap-1 items-center flex-wrap"
              >
                {restaurant.cuisines?.map((cuisine: string, index: number) => {
                  return (
                    <p key={cuisine} className="flex items-center">
                      <span className="">
                        {index !== 0 && (
                          <div className="size-1 rounded-full bg-gray-600 mr-1"></div>
                        )}
                      </span>
                      {cuisine}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="font-bold text-xl">Menu</h1>
            <div id="menu-items">
              {restaurant.menuItems.map(
                (item: { name: string; price: number; _id: string }) => {
                  return (
                    <div
                      className="rounded-md shadow-md p-2 my-4 hover:-translate-y-[2px] cursor-pointer"
                      onClick={() => addToCart({ ...item, quantity: 1 })}
                    >
                      <p>{item.name}</p>
                      <p className="font-bold">${item.price}</p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
        <div
          id="order-info"
          className="flex-1 rounded-md shadow-md   h-min p-2"
        >
          <div className="flex items-center justify-between font-semibold text-xl">
            <h1>Your Order</h1>
            <h1>${getTotalCost()}</h1>
          </div>
          {cartItems.map((item) => {
            return (
              <p className="flex items-center justify-between my-2">
                <span>
                  <span className="bg-black p-1 px-2 text-white rounded-full">
                    {item.quantity}
                  </span>{" "}
                  {item.name}
                </span>
                <span className="flex gap-1 items-center ">
                  ${item.price}{" "}
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeFromCart(item._id)}
                  />
                </span>
              </p>
            );
          })}
          {/* <div
            id="horizonal-line"
            className="w-full rounded-full h-[1px] bg-gray-500 my-1"
          ></div> */}
          <div className="text-gray-700 flex items-center justify-between">
            <p>Delivery Price</p>
            <p>${restaurant.deliveryPrice}</p>
          </div>
          <div
            id="horizonal-line"
            className="w-full rounded-full h-[1px] bg-gray-500 my-1"
          ></div>
          <CheckoutButton
            text={isAuthenticated ? "Go to Checkout" : "Login to Checkout"}
            onClick={CheckoutButtonHandler}
            disabled={cartItems.length === 0}
          />
          {/* <button
            disabled={cartItems.length === 0}
            onClick={() => {
              console.log(showModel);
              setShowModel(true);
            }}
            className="bg-primary text-white rounded-md w-full py-1 mt-2 disabled:cursor-not-allowed"
          >
            Go to Checkout
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;

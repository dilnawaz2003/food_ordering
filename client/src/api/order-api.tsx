import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { Order } from "../types/types";
import toast from "react-hot-toast";

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const baseUrl = import.meta.env.VITE_BASE_URL;
export const useCreateCheckOutSession = () => {
  const { getAccessTokenSilently } = useAuth0();
  const request = async (data: CheckoutSessionRequest) => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(
      `${baseUrl}/api/order/checkout/create-checkout-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) throw new Error("Unable To Create Session");

    return res.json();
  };

  const {
    mutateAsync: createSession,
    isLoading,
    isError,
  } = useMutation(request);

  return { createSession, isLoading, isError };
};

export const useGetUserOrders = () => {
  const { getAccessTokenSilently } = useAuth0();
  const req = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(`${baseUrl}/api/order/myorders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) throw new Error();

    return res.json();
  };

  const { data: orders, isLoading, isError } = useQuery("myorders", req);

  return {
    orders,
    isLoading,
    isError,
  };
};

export const useGetRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();
  const request = async () => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(`${baseUrl}/api/resturant/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) throw new Error("Unable to get Restaurant Orders");

    return res.json();
  };

  const {
    data: restaurantOrders,
    isLoading,
    isError,
  } = useQuery("restaurantOrders", request);

  return {
    isLoading,
    isError,
    restaurantOrders,
  };
};

export const useUpdateOrderStatus = () => {
  const { getAccessTokenSilently } = useAuth0();

  const req = async ({
    orderId,
    status,
  }: {
    orderId: string;
    status: string;
  }) => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(
      `${baseUrl}/api/resturant/order/${orderId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Unable to Update Order Status");

    return res.json();
  };

  const {
    mutateAsync: updateOrderStatus,
    isError,
    isLoading,
    isSuccess,
    reset,
  } = useMutation(req);

  if (isSuccess) {
    toast.success("Status Update Successfully");
    reset();
  }

  if (isError) {
    toast.error("Unable to Update order status");
    reset();
  }

  // if (isLoading && (!isError || !isSuccess)) {
  //   toast.loading("Updating Order status");
  // }

  return {
    isError,
    isLoading,
    updateOrderStatus,
  };
};

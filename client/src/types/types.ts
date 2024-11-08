export type User = {
  _id: string;
  email: string;
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};
export type MenuItem = {
  _id: string;
  name: string;
  price: number;
};

export type Restaurant = {
  _id: string;
  user: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItem[];
  imageUrl: string;
  lastUpdated: string;
};

export type ResturantSearchData = {
  data: [];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type OrderStatus =
  | "placed"
  | "paid"
  | "inProgress"
  | "outForDelivery"
  | "delivered";

export type Order = {
  totalAmount?: number;
  restaurant: Restaurant;
  user: User;
  _id: string;
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  cartItems: {
    menuItemId: string;
    quantity: number;
    name: string;
    _id: string;
  }[];
  status: OrderStatus;
  createdAt: string;
};

import { useGetUserOrders } from "../api/order-api";
import LoadingSpinner from "../components/loading-spinner";
import { Order } from "../types/types";
import { ORDER_STATUS } from "../utils/constants";
import { getDayName } from "../utils/util-funcs";

const OrderStatusPage = () => {
  const { orders, isLoading, isError } = useGetUserOrders();

  console.log(orders);
  if (isError) {
    return <h1 className="min-h-screen">Some Thing Went Wrong</h1>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const getExpectedByTime = (createdAt: string, deliveryTime: number) => {
    const deliveryTimeMs = deliveryTime * 60 * 1000;

    const expectedTime = new Date(
      new Date(createdAt).getTime() + deliveryTimeMs
    );
    const dayName = getDayName(expectedTime.getDay());
    const hours =
      expectedTime.getHours() < 10
        ? `0${expectedTime.getHours()}`
        : expectedTime.getHours();
    const minutes =
      expectedTime.getMinutes() < 10
        ? `0${expectedTime.getMinutes()}`
        : expectedTime.getMinutes();

    return `${dayName}:${hours}:${minutes}`;
  };

  return (
    <div className="py-5 px-10 min-h-screen ">
      {orders?.map((order: Order) => {
        const orderStatus = ORDER_STATUS.find(
          (item) => item.value === order.status
        );
        return (
          <div
            key={order._id}
            className="rounded-md p-2 shadow-lg my-4 space-y-5 px-4  "
          >
            <div
              id="progess-bar"
              className="w-full rounded-full bg-gray-200 h-[15px]"
            >
              <div
                style={{ width: `${orderStatus?.progressValue}%` }}
                className={`rounded-full bg-green-500 animate-pulse h-full`}
              ></div>
            </div>
            <div className="flex flex-col sm:flex-row  sm:justify-between ">
              <h1 className="text-gray-500">
                Order Status: <span>{orderStatus?.label}</span>
              </h1>
              <h1 className="text-gray-500">
                Expected by -{" "}
                {getExpectedByTime(
                  order.createdAt,
                  order.restaurant.estimatedDeliveryTime
                )}
              </h1>
            </div>
            <div className="md:flex md:justify-between  md:items-center gap-5">
              <div className="my-2  w-full ">
                <img
                  src={order.restaurant.imageUrl}
                  className="w-full md:min-w-full h-[200px] object-cover rounded-md  bg-blue-50 "
                ></img>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="font-semibold text-sm">Delivering to:</p>
                  <p className="text-gray-500">{order.user.name}</p>
                  <p className="text-gray-500">
                    {order.user.addressLine1},{order.user.city}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm"> Your Order</p>
                  {order.cartItems.map((item) => {
                    return (
                      <p className="text-gray-500">
                        {item.name} x {item.quantity}{" "}
                      </p>
                    );
                  })}
                </div>
                <div>
                  <p className="font-semibold text-sm">Total</p>
                  <p>${order.totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusPage;

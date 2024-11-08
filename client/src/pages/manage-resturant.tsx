import { zodResolver } from "@hookform/resolvers/zod";
import { Key, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { z } from "zod";
// import { useCreateUser } from "../api/user-api";
import {
  useCreateResturant,
  useGetUserResturant,
  useUpdateUserResturant,
} from "../api/resturant-api";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useNavigate } from "react-router-dom";
import { ORDER_STATUS } from "../utils/constants";
import { useGetRestaurantOrders, useUpdateOrderStatus } from "../api/order-api";
import LoadingSpinner from "../components/loading-spinner";
import { Order } from "../types/types";

const fromSchema = z.object({
  resturantName: z.string().min(1, { message: "Name is Required" }),
  city: z.string().min(1, { message: "City is Required" }),
  country: z.string().min(1, { message: "Country is Required" }),
  deliveryPrice: z.coerce
    .number({ required_error: "Delivery price must be valid number" })
    .min(1, "Delivery price must be at least 1"),
  estimatedDeliveryTime: z.coerce
    .number({ required_error: "Estimated Delivery Time must be valid number" })
    .min(1, "Estimated Delivery Time must be at least 1 minute"),
  cuisines: z.array(z.string()).nonempty("Please Select at Least one."),
  menuItems: z.array(
    z.object({
      name: z.string().min(1, "name is required"),
      price: z.coerce.number().min(1, { message: "Price is required" }),
    })
  ),
  imageFile: z.union([z.instanceof(File).optional(), z.any().optional()]),
});

type resturantFormData = z.infer<typeof fromSchema>;
type registerType = UseFormRegister<{
  resturantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: [string, ...string[]];
  menuItems: {
    name: string;
    price: number;
  }[];
  imageFile?: File | undefined;
}>;

const ManageResturantpage = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [isOrdersTab, setIsOrdersTab] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = useForm<resturantFormData>({
    resolver: zodResolver(fromSchema),
  });

  const { createResturant } = useCreateResturant();
  const { updateResturant, isLoading: isUpdateLoading } =
    useUpdateUserResturant();
  const {
    data,
    isLoading: isLoadingInitResturant,
    isError: isErrorInitResturant,
    isSuccess: isSuccessInitResturant,
  } = useGetUserResturant();

  const formSubmitHandler = async (data: resturantFormData) => {
    if (data.menuItems.length === 0) {
      setError("menuItems", { message: "Add atleast one menu item" });
    }

    if (!data) {
      setError("imageFile", { message: "Image is required " });
    }

    const formData = new FormData();

    formData.append("resturantName", data.resturantName);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("deliveryPrice", data.deliveryPrice.toString());
    formData.append(
      "estimatedDeliveryTime",
      data.estimatedDeliveryTime.toString()
    );
    formData.append("cuisines", JSON.stringify(data.cuisines));
    formData.append("menuItems", JSON.stringify(data.menuItems));

    if (data.imageFile) {
      console.log("image file exist");
      formData.append("imageFile", data.imageFile);
    }

    // if already exist resturant then update else create.
    if (data) {
      // if already exist resturant ans user don't provide img url it's valid .
      await updateResturant(formData);
    } else {
      await createResturant(formData);
    }

    navigate("/");
  };

  if (isLoadingInitResturant) {
    return (
      <div className="h-[calc(100vh-64px-64px)] flex justify-center items-center ">
        <div className="animate-spin  rounded-full size-10 border-primary border-t border-r my-auto"></div>
      </div>
    );
  }

  if (isErrorInitResturant) {
    return <div>Unable to show resturant</div>;
  }

  if (isSuccessInitResturant) {
    // TODO : set all input field values .
    const { resturant } = data;
    console.log(resturant);

    setValue("resturantName", resturant.resturantName);
    setValue("city", resturant.city);
    setValue("country", resturant.country);
    setValue("deliveryPrice", resturant.deliveryPrice);
    setValue("estimatedDeliveryTime", resturant.estimatedDeliveryTime);
    setValue("cuisines", resturant.cuisines);
    setValue("menuItems", resturant.menuItems);
    setValue("imageFile", resturant.imageUrl);

    console.log(resturant);
  }

  if (!isAuthenticated) {
    console.log("ok");
    return <Navigate to="/"></Navigate>;
  }

  return (
    <div className="p-5 my-5 mx-10 bg-gray-200 rounded-lg">
      <div
        id="tab-bar"
        className="bg-gray-400 border w-min text-nowrap flex gap-5 p-1 rounded-md items-center "
      >
        <div
          className={`${
            isOrdersTab ? "bg-white" : "bg-gray-400"
          } p-1 rounded-md cursor-pointer  `}
          onClick={() => setIsOrdersTab(true)}
        >
          Orders
        </div>
        <div
          className={` ${
            isOrdersTab ? "bg-gray-400" : "bg-white"
          }  p-1 rounded-md cursor-pointer`}
          onClick={() => setIsOrdersTab(false)}
        >
          Manage Resturant
        </div>
      </div>
      {isOrdersTab ? (
        <Orders />
      ) : (
        <form onSubmit={handleSubmit(formSubmitHandler)}>
          <DetailsSection register={register} errors={errors} />
          <Seperator />
          <CuisinesSection
            register={register}
            errors={errors}
            control={control}
          />
          <Seperator />
          <MenuSection register={register} control={control} errors={errors} />
          <Seperator />
          <ImageSection
            control={control}
            errors={errors}
            defaultImageUrl={data?.resturant?.imageUrl}
          />
          <div className="flex justify-end ">
            <button
              disabled={isUpdateLoading}
              type="submit"
              className="bg-primary rounded-md p-2 text-white cursor-pointer"
            >
              {isUpdateLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const Orders = () => {
  const { isLoading, isError, restaurantOrders } = useGetRestaurantOrders();
  const { updateOrderStatus } = useUpdateOrderStatus();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>Unable to get Restaurant Orders</h1>;
  }

  console.log(restaurantOrders);

  const statusUpdateHandler = async (status: string, orderId: string) => {
    console.log(status);
    await updateOrderStatus({ orderId, status });
  };
  return (
    <div className=" mt-5 ">
      <p className="font-semibold">1 Active Order</p>
      {restaurantOrders.map((order: Order) => {
        return (
          <div className="space-y-2 bg-white rounded-md p-2 my-5">
            <div className="mt-5 sm:flex sm:justify-between ">
              <p>Customer Name:{order.deliveryDetails.name}</p>
              <p>Delivey Address : {order.deliveryDetails.addressLine1}</p>
              <p>Time : {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total Cost : ${((order.totalAmount || 0) / 100).toFixed(2)}</p>
            </div>
            <div>
              {order.cartItems.map((item) => {
                return (
                  <p className="text-gray-400">
                    {item.quantity} x {item.name}
                  </p>
                );
              })}
            </div>
            <div className="space-y-2">
              What is the status of the order
              <select
                defaultValue={order.status}
                onChange={(e) => statusUpdateHandler(e.target.value, order._id)}
              >
                {ORDER_STATUS.map((i) => {
                  return <option value={i.value}>{i.label}</option>;
                })}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DetailsSection = ({
  register,
  errors,
}: {
  register: registerType;
  errors: any;
}) => {
  return (
    <div>
      <h1 className="font-bold text-2xl ">Details</h1>
      <p className="text-gray-400">Enter Details About Your Resturant.</p>

      <div className="flex  flex-col my-1">
        <label className="font-semibold">Name</label>
        <input
          {...register("resturantName")}
          type="text"
          className="outline-none rounded-md p-1"
        ></input>
        {errors && errors.name && (
          <p className="text-red-400">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="flex  flex-col my-1 flex-1 ">
          <label className="font-semibold">City</label>
          <input
            {...register("city")}
            type="text"
            className="outline-none rounded-md p-1"
          ></input>
          {errors && errors.city && (
            <p className="text-red-400">{errors.city.message}</p>
          )}
        </div>
        <div className="flex  flex-col my-1 flex-1">
          <label className="font-semibold">Country</label>
          <input
            {...register("country")}
            type="text"
            className="outline-none rounded-md p-1"
          ></input>
          {errors && errors.country && (
            <p className="text-red-400">{errors.country.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="flex  flex-col my-1 flex-1 ">
          <label className="font-semibold">Delivery Price</label>
          <input
            {...register("deliveryPrice")}
            type="number"
            className="outline-none rounded-md p-1"
          ></input>
          {errors && errors.deliveryPrice && (
            <p className="text-red-400">{errors.deliveryPrice.message}</p>
          )}
        </div>
        <div className="flex  flex-col my-1 flex-1">
          <label className="font-semibold">
            Estimated Delivery Time(minutes)
          </label>
          <input
            {...register("estimatedDeliveryTime")}
            type="number"
            className="outline-none rounded-md p-1"
          ></input>
          {errors && errors.estimatedDeliveryTime && (
            <p className="text-red-400">
              {errors.estimatedDeliveryTime.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Seperator = () => {
  return (
    <div className="rounded-full bg-gray-300 width-full h-[2px] my-6 "></div>
  );
};

const CuisinesSection = ({
  register,
  control,
  errors,
}: {
  register: registerType;
  errors: any;
  control: any;
}) => {
  const cuisinesList: string[] = [
    "American",
    "BBQ",
    "Breakfast",
    "Burgers",
    "Cafe",
    "Chinese",
    "Desserts",
    "French",
    "Greek",
    "Healthy",
    "Indian",
    "Italina",
    "Japanese",
    "Mexican",
    "Noodles",
    "Organic",
    "Pasta",
    "Pizza",
    "Salads",
    "SeaFood",
    "Spanish",
    "Steak",
    "Sushi",
    "Tacos",
    "Tapas",
    "Vegan",
  ];
  return (
    <div>
      <h1 className="font-bold text-2xl">Cuisines</h1>
      <p className="text-gray-400">Enter Details About Your Restaurant.</p>
      <Controller
        name="cuisines"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 lg:grid-cols-5">
            {cuisinesList.map((cuisine) => (
              <div key={cuisine}>
                <input
                  type="checkbox"
                  className="mr-1"
                  id={cuisine}
                  value={cuisine}
                  checked={field.value.includes(cuisine)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      field.onChange([...field.value, cuisine]);
                    } else {
                      field.onChange(
                        field.value.filter((item: string) => item !== cuisine)
                      );
                    }
                  }}
                />
                <label htmlFor={cuisine}>{cuisine}</label>
              </div>
            ))}
          </div>
        )}
      />
      {errors && errors.cuisines && (
        <p className="text-red-400">{errors.cuisines.message}</p>
      )}
    </div>
  );
};

const MenuSection = ({
  control,
  register,
  errors,
}: {
  control: any;
  register: registerType;
  errors: any;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  return (
    <div>
      <h1 className="font-bold text-2xl">Menu</h1>
      <p className="text-gray-400">
        Create Your Menu and Give Each Item a Name and Price.
      </p>
      <div>
        {fields.map((field: { id: Key | null | undefined }, index: number) => (
          <div key={field.id} className="flex items-end  gap-5 mb-2 ">
            <div className="flex flex-col">
              <label className="font-semibold">Name</label>
              <input
                {...register(`menuItems.${index}.name` as const)}
                type="text"
                className="outline-none rounded-md p-1"
              />
              {errors.menuItems?.[index]?.name && (
                <p className="text-red-500">
                  {errors.menuItems?.[index]?.name?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col my-auto">
              <label className="font-semibold">Price</label>
              <input
                {...register(`menuItems.${index}.price` as const)}
                type="number"
                className="outline-none rounded-md p-1"
              />
              {errors.menuItems?.[index]?.price && (
                <p className="text-red-500">
                  {errors.menuItems?.[index]?.price?.message}
                </p>
              )}
            </div>
            {/* <FaTrash /> */}
            <button
              type="button"
              className="bg-red-500 p-1 text-white rounded-md "
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="my-2">
        <button
          type="button"
          className="bg-black p-2 text-white rounded-md"
          onClick={() => append({ name: "", price: undefined })}
        >
          Add Menu Item
        </button>
      </div>
      {errors.menuItems && (
        <p className="text-red-500">{errors.menuItems.message}</p>
      )}
    </div>
  );
};

const ImageSection = ({
  control,
  errors,
  defaultImageUrl,
}: {
  control: any;
  errors: any;
  defaultImageUrl: string | null;
}) => {
  const [imagePreview, setImagePreview] = useState<string>();

  return (
    <div>
      <h1 className="font-bold text-2xl ">Image</h1>
      <p className="text-gray-400">
        Add an image that will be displayed on your restaurant listing in the
        search result. Adding a new image will overwrite the existing one.
      </p>
      <div className="my-5">
        <img
          src={
            imagePreview ? imagePreview : defaultImageUrl ? defaultImageUrl : ""
          }
          // src={defaultImageUrl ? defaultImageUrl : imagePreview}
          className="w-1/3 object-contain mb-5"
          alt="Preview"
        />
        <Controller
          name="imageFile"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] as File | null;
                field.onChange(file);
                if (file) {
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
          )}
        />
        {errors && errors.imageFile && (
          <p className="text-red-400">{errors.imageFile.message}</p>
        )}
      </div>
    </div>
  );
};

export default ManageResturantpage;

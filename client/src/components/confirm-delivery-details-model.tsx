import { useAuth0 } from "@auth0/auth0-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useGetUser, useUpdateUser } from "../api/user-api";

type FormType = {
  email?: string;
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "city is required"),
  addressLine1: z.string().min(1, "addressLine1 is required"),
  country: z.string().min(1, "country is required"),
});

const ConfirmDeliveryDetailsModel = ({
  isOpen,
  onClose,
  paymentHandler,
  isLoading,
}: {
  isOpen: boolean;
  onClose: any;
  paymentHandler: any;
  isLoading: boolean;
}) => {
  if (!isOpen) return null;

  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const {
    user,
    isLoading: isLoadingInitData,
    isError: isErrorInitData,
  } = useGetUser();

  // Close the modal when clicking outside the content or on the close button
  const handleOutsideClick = (e: any) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email,
    },
  });

  const submitHandler = async (data: FormType) => {
    const { name, city, addressLine1, country } = data;
    paymentHandler({
      name,
      city,
      addressLine1,
      country,
      email: user?.email,
    });
    // console.log(name, city, addressLine1, country);
    // await updateUser({ name, city, addressLine1, country });
    // navigate("/");
  };

  // if (isErrorInitData) {
  //   return <h1>Some Thing went Wrong</h1>;
  // }

  if (!isLoadingInitData && !isErrorInitData) {
    setValue("email", user.email);
    setValue("name", user.name);
    setValue("city", user.city);
    setValue("addressLine1", user.addressLine1);
    setValue("country", user.country);
  }

  if (!isAuthenticated) {
    return <Navigate to="/"></Navigate>;
  }

  // if (isLoadingInitData) {
  //   return (
  //     <div className="min-h-dvh flex justify-center items-center">
  //       <div className="animate-spin border-l-2 border-t-2  border-primary rounded-full size-10"></div>
  //     </div>
  //   );
  // }

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      {/* {isLoadingInitData && (
        <div className="min-h-dvh flex justify-center items-center">
          <div className="animate-spin border-l-2 border-t-2  border-primary rounded-full size-10"></div>
        </div>
      )}
      {isErrorInitData && <h1>Some Thing went wrong</h1>}
      {!isErrorInitData && (
        
      )} */}
      <div className="bg-white p-8 rounded-lg relative w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[65%]">
        {isLoadingInitData && (
          <div className="min-h-dvh flex justify-center items-center">
            <div className="animate-spin border-l-2 border-t-2  border-primary rounded-full size-10"></div>
          </div>
        )}
        {isErrorInitData && <h1>Some Thing went wrong</h1>}
        {!isErrorInitData && (
          <>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={onClose}
            >
              &times;
            </button>
            <div>
              <h2 className="text-xl font-semibold ">
                Confirm Delivery Details
              </h2>
              <p className="text-gray-500">
                View and change your profile information here.
              </p>
            </div>
            <div>
              {/* FORM  */}
              <div className="w-full ">
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className="flex flex-col items-start justify-center w-full"
                >
                  <div className="flex flex-col w-full gap-1 my-2">
                    <label className="font-semibold ">Email </label>
                    <input
                      type="email"
                      readOnly
                      className="p-2 rounded-md  border border-black text-gray-400 "
                      {...register("email")}
                      name="email"
                    ></input>
                  </div>
                  <div className="flex flex-col w-full gap-1 my-2">
                    <label className="font-semibold">Name </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="p-2 rounded-md border border-black"
                      name="name"
                    ></input>
                    {errors.name && (
                      <p className="text-red-400">{errors.name.message}</p>
                    )}
                  </div>
                  <div className=" w-full flex flex-col  items-start my-2  lg:flex-row lg:gap-2 lg:w-full lg:items-start">
                    <div className="flex flex-col w-full gap-1 my-2 sm:flex-1">
                      <label className="font-semibold">Address Line 1 </label>
                      <input
                        type="text"
                        className="p-2 rounded-md border border-black "
                        {...register("addressLine1")}
                        name="addressLine1"
                      ></input>
                      <p className="text-red-400">
                        {errors?.addressLine1?.message}
                      </p>
                    </div>
                    <div className="flex flex-col w-full  gap-1 my-2 sm:flex-1">
                      <label className="font-semibold">City </label>
                      <input
                        type="text"
                        className="p-2 rounded-md border border-black "
                        {...register("city")}
                        name="city"
                      ></input>
                      <p className="text-red-400">{errors?.city?.message}</p>
                    </div>
                    <div className="flex flex-col  w-full gap-1 my-2 sm:flex-1">
                      <label className="font-semibold">Country </label>
                      <input
                        type="text"
                        className="p-2 rounded-md  border border-black "
                        {...register("country")}
                        name="country"
                      ></input>
                      <p className="text-red-400">{errors?.city?.message}</p>
                    </div>
                  </div>
                  <div className="mx-1 my-3 w-full flex justify-end">
                    <button
                      disabled={isLoading}
                      className=" bg-[#D31B27] text-white  p-2 rounded-md hover:bg-[#d31b27c2] flex items-center gap-2"
                    >
                      {/* {isLoadingUpdateUser && (
                    <div className="animate-spin border-l-2 border-t-2  border-white rounded-full size-3"></div>
                  )} */}
                      {isLoading ? "Is Loading..." : "Continue to Payment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmDeliveryDetailsModel;

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetUser, useUpdateUser } from "../api/user-api";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useNavigate } from "react-router-dom";

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

const UserProfilePage = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const {
    user,
    isLoading: isLoadingInitData,
    isError: isErrorInitData,
  } = useGetUser();
  // console.log(user, load);

  const {
    updateUser,
    isLoading: isLoadingUpdateUser,
    isError: isErrorUpdateUser,
  } = useUpdateUser();

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
    await updateUser({ name, city, addressLine1, country });
    navigate("/");
  };

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

  if (isLoadingInitData) {
    return (
      <div className="min-h-dvh flex justify-center items-center">
        <div className="animate-spin border-l-2 border-t-2  border-primary rounded-full size-10"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-3 w-11/12 mx-auto my-5 rounded-md flex flex-col items-center  ">
      <div className=" w-[90%] ">
        <h1 className="font-bold text-2xl">User Profile</h1>
        <p className="text-gray-500">
          view and change your profile information here
        </p>
      </div>
      <div className="w-full ">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col items-center justify-center w-full"
        >
          <div className="flex flex-col w-[90%] gap-1 my-2">
            <label className="font-semibold ">Email </label>
            <input
              type="email"
              readOnly
              className="p-2 rounded-md outline-none text-gray-400"
              {...register("email")}
              name="email"
            ></input>
          </div>
          <div className="flex flex-col w-[90%] gap-1 my-2">
            <label className="font-semibold">Name </label>
            <input
              {...register("name")}
              type="text"
              className="p-2 rounded-md outline-none"
              name="name"
            ></input>
            {errors.name && (
              <p className="text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div className=" w-full flex flex-col items-center  sm:flex-row sm:gap-2 sm:w-[90%] sm:items-start">
            <div className="flex flex-col w-[90%] gap-1 my-2 sm:flex-1">
              <label className="font-semibold">Address Line 1 </label>
              <input
                type="text"
                className="p-2 rounded-md outline-none"
                {...register("addressLine1")}
                name="addressLine1"
              ></input>
              <p className="text-red-400">{errors?.addressLine1?.message}</p>
            </div>
            <div className="flex flex-col w-[90%] gap-1 my-2 sm:flex-1">
              <label className="font-semibold">City </label>
              <input
                type="text"
                className="p-2 rounded-md outline-none"
                {...register("city")}
                name="city"
              ></input>
              <p className="text-red-400">{errors?.city?.message}</p>
            </div>
            <div className="flex flex-col w-[90%] gap-1 my-2 sm:flex-1">
              <label className="font-semibold">Country </label>
              <input
                type="text"
                className="p-2 rounded-md outline-none"
                {...register("country")}
                name="country"
              ></input>
              <p className="text-red-400">{errors?.city?.message}</p>
            </div>
          </div>
          <div className="mx-1 my-3 w-[90%] flex justify-end">
            <button
              disabled={isLoadingUpdateUser}
              className=" bg-[#D31B27] text-white  p-2 rounded-md hover:bg-[#d31b27c2] flex items-center gap-2"
            >
              {isLoadingUpdateUser && (
                <div className="animate-spin border-l-2 border-t-2  border-white rounded-full size-3"></div>
              )}
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;

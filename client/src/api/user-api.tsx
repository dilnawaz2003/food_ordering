import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useQuery } from "react-query";

// CREATE USER .
type UserType = {
  email: string;
  auth0Id: string;
};

export const useCreateUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const request = async (user: UserType) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const accessToken = await getAccessTokenSilently();
      const res = await fetch(`${baseUrl}/api/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Unable To Create User");
    } catch (error) {
      // show toast of error.
    }
  };

  const {
    mutateAsync: createUser,
    isLoading,
    isError,
    isPaused,
    isSuccess,
  } = useMutation(request);

  if (isError) {
    toast.error("Unable To Create User");
  }

  if (isSuccess) {
    toast.success("User created successfully");
  }

  return {
    createUser,
    isLoading,
    isError,
    isPaused,
  };
};

// GET USER

export const useGetUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const request = async () => {
    const accessToken = await getAccessTokenSilently();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    // console.log(authUser);
    // const auth0Id = authUser?.sub;
    // console.log(auth0Id);

    const res = await fetch(`${baseUrl}/api/user/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Unable to get user");

    return res.json();
  };

  const { data, isLoading, isError } = useQuery("user", request);

  // console.log(data);

  const user = data?.user;

  if (isError) {
    toast.error("Unable To get User");
  }

  return {
    user,
    isLoading,
    isError,
  };
};

export const useUpdateUser = () => {
  const { getAccessTokenSilently, user: authUser } = useAuth0();
  const request = async ({
    name,
    city,
    addressLine1,
    country,
  }: {
    name: string;
    city: string;
    addressLine1: string;
    country: string;
  }) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const accessToken = await getAccessTokenSilently();
      const auth0Id = authUser?.sub;
      const res = await fetch(`${baseUrl}/api/user/${auth0Id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          city,
          addressLine1,
          country,
        }),
      });

      if (!res.ok) throw new Error("Unable To Create User");
    } catch (error) {
      // show toast of error.
    }
  };

  const {
    mutateAsync: updateUser,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(request);

  if (isError) {
    toast.error("Unable To Update User");
  }

  if (isSuccess) {
    toast.success("User updated  successfully");
  }

  return {
    updateUser,
    isLoading,
    isError,
  };
};

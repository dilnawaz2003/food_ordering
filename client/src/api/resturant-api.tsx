import { useMutation, useQueries, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";

export const useCreateResturant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const request = async (formData: any) => {
    const token = await getAccessTokenSilently();
    const baseUrl = import.meta.env!.VITE_BASE_URL;
    const res = await fetch(`${baseUrl}/api/resturant/new`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "",
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Unable to create resturant");

    return res.json();
  };

  const {
    mutateAsync: createResturant,
    isError,
    isLoading,
    isSuccess,
  } = useMutation(request);

  if (isError) {
    toast.error("Unable to create resturant");
  }

  // if (isLoading) {
  //   toast.loading("Loading");
  // }

  if (isSuccess) {
    toast.success("Resturant created successfully");
  }

  return {
    createResturant,
    isError,
    isLoading,
    isSuccess,
  };
};

export const useGetUserResturant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const request = async () => {
    const token = await getAccessTokenSilently();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const res = await fetch(`${baseUrl}/api/resturant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json();
  };

  const { data, isError, isSuccess, isLoading } = useQuery(
    "resturant",
    request
  );

  // if (isError) {
  //   toast.error("Unable to create resturant");
  // }

  // if (isLoading) {
  //   toast.loading("Loading");
  // }

  // if (isSuccess) {
  //   toast.success("Resturant created successfully");
  // }

  return {
    data,
    isLoading,
    isSuccess,
    isError,
  };
};

export const useUpdateUserResturant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const request = async (formData: any) => {
    const token = await getAccessTokenSilently();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const res = await fetch(`${baseUrl}/api/resturant`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return res.json();
  };

  const {
    mutateAsync: updateResturant,
    isError,
    isSuccess,
    isLoading,
  } = useMutation(request);

  if (isError) {
    toast.error("Unable to update  resturant");
  }

  // if (isFetching) {
  //   toast.loading("Loading");
  // }

  if (isSuccess) {
    toast.success("Resturant updated successfully");
  }

  return {
    updateResturant,
    isLoading,
    isSuccess,
    isError,
  };
};

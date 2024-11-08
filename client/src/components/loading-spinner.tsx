const LoadingSpinner = () => {
  return (
    <div className="h-[calc(100vh-64px-64px)] flex justify-center items-center ">
      <div className="animate-spin  rounded-full size-10 border-primary border-t border-r my-auto"></div>
    </div>
  );
};

export default LoadingSpinner;

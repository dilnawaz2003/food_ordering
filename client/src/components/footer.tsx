const Footer = () => {
  return (
    <div className="bg-primary text-white text-center flex flex-col justify-center items-center gap-2 px-2 py-4 font-bold sm:flex-row sm:justify-between">
      <h1 className="text-2xl">Eatify.com</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <h1>Privacy Policy</h1>
        <h1>Terms of Service</h1>
      </div>
    </div>
  );
};

export default Footer;

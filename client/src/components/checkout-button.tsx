type Prop = {
  disabled: boolean;
  text: string;
  onClick: () => void;
};

const CheckoutButton = ({ disabled, onClick, text }: Prop) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="bg-primary text-white rounded-md w-full py-1 mt-2 disabled:cursor-not-allowed"
    >
      {text}
    </button>
  );
};

export default CheckoutButton;

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  ...props
}) {
  const base =
    "font-satoshi font-medium inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "border border-gray-300 bg-white text-black hover:bg-black hover:text-white",
    ghost: "bg-transparent text-black hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

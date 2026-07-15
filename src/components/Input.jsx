export default function Input({
  label,
  type = "text",
  error,
  className = "",
  ...props
}) {
  return (
    <label className="font-satoshi block w-full">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      )}
      <input
        type={type}
        className={`w-full rounded-full border bg-white px-4 py-3 text-sm outline-none transition-colors ${
          error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-black"
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

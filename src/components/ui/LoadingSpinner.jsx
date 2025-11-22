export default function LoadingSpinner({ size = "md", color = "border-white" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-t-transparent ${color}`}
      ></div>
    </div>
  );
}
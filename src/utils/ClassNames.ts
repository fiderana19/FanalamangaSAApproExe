export const selectErrorClass = (hasError: boolean) =>
  hasError
    ? "border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
    : "border-[#d9dee5]";

export const textAreaBaseClass =
  "w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:border-brand focus-visible:ring-brand/20 focus-visible:ring-2 md:text-sm";

export const cardClassName = "panel p-6";

export const selectErrorClassFocus = (hasError: boolean) =>
  hasError
    ? "border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-[#d9dee5]";
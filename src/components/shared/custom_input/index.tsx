import { toSnakeCase } from "../../../utilities/string_utilities";
import React, { type ReactNode } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  className?: string;
}

// Función auxiliar para combinar clases CSS sin usar tailwind-merge
const combineClasses = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(" ").trim().replace(/\s+/g, " ");
};

export const CustomInput: React.FC<Props> = ({
  label,
  startAdornment,
  endAdornment,
  className,
  ...rest
}) => {
  const id = toSnakeCase(label ?? "");

  // Clases base que siempre se aplican
  const baseClasses =
    "block w-full bg-white px-3 py-3 text-sm text-stone-900 placeholder:text-stone-400 ring-1 ring-stone-300 shadow-sm transition-all";
  const outlineClasses =
    "outline outline-1 outline-stone-100 focus:outline focus:outline-stone-700";
  const focusClasses = "focus:ring-0 focus:ring-offset-0";

  // Clases condicionales basadas en las propiedades
  const startAdornmentClass = startAdornment ? "pl-10" : "";
  const endAdornmentClass = endAdornment ? "pr-10" : "";

  // Combinamos todas las clases
  const inputClasses = combineClasses(
    baseClasses,
    outlineClasses,
    focusClasses,
    startAdornmentClass,
    endAdornmentClass,
    className
  );

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-stone-900 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {startAdornment && (
          <div className="absolute left-3 flex items-center justify-center h-full">
            {startAdornment}
          </div>
        )}

        <input id={id} className={inputClasses} {...rest} />

        {endAdornment && (
          <div className="absolute right-3 flex items-center justify-center h-full">
            {endAdornment}
          </div>
        )}
      </div>
    </div>
  );
};

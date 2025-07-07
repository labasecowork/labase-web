import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utilities";

// 1. Definir nuestros propios tipos para las props de botón que necesitamos
type CustomButtonVariant = "outline" | "ghost";
type CustomButtonSize = "icon" | "default";

interface CustomButtonPropsForPagination {
  variant: CustomButtonVariant;
  size: CustomButtonSize;
}

// 2. Crear nuestra propia función para generar clases de botón
// Estos estilos están inspirados en los que Shadcn/ui podría generar.
// Puedes ajustarlos según tus necesidades específicas de Tailwind CSS.
const getPaginationButtonVariants = ({
  variant,
  size,
}: CustomButtonPropsForPagination): string => {
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  let variantStyles = "";
  switch (variant) {
    case "outline":
      variantStyles =
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
      break;
    case "ghost":
      variantStyles = "hover:bg-accent hover:text-accent-foreground";
      break;
    default: // Por si acaso, aunque no deberíamos llegar aquí con los tipos actuales
      variantStyles = "hover:bg-accent hover:text-accent-foreground";
      break;
  }

  let sizeStyles = "";
  switch (size) {
    case "icon":
      sizeStyles = "h-9 w-9"; // Ajustado para que coincida con PaginationEllipsis
      break;
    case "default":
      sizeStyles = "h-9 px-3"; // Un tamaño "pequeño" o "por defecto" para paginación
      break;
    default:
      sizeStyles = "h-9 w-9";
      break;
  }

  return cn(baseStyles, variantStyles, sizeStyles);
};

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

// 3. Actualizar PaginationLinkProps para usar nuestro CustomButtonSize
// Ya no necesitamos Pick<ButtonProps, "size">
type PaginationLinkProps = {
  isActive?: boolean;
  size?: CustomButtonSize; // Usamos nuestro tipo de tamaño
} & Omit<React.ComponentProps<"a">, "size">; // Omitimos 'size' de <a> para evitar conflictos, aunque 'a' no tiene 'size'

const PaginationLink = ({
  className,
  isActive,
  size = "icon", // El tamaño por defecto para los números de página
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      // 4. Usar nuestra función getPaginationButtonVariants
      getPaginationButtonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default" // Este tamaño se pasará a getPaginationButtonVariants
    className={cn("gap-1 pl-2.5", className)} // Estas clases se añaden a las generadas
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default" // Este tamaño se pasará a getPaginationButtonVariants
    className={cn("gap-1 pr-2.5", className)} // Estas clases se añaden a las generadas
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

import { routes } from "@/config";
import type { MenuItem } from "../types";

export const menuItems: MenuItem[] = [
  {
    name: "INICIO",
    href: routes.home,
  },
  {
    name: "ESPACIOS",
    href: routes.spaces,
  },
  {
    name: "NOSOTROS",
    href: routes.about,
  },
  {
    name: "TESTIMONIOS",
    href: routes.testimonial,
  },
  {
    name: "CONTACTO",
    href: routes.contact,
  },
];

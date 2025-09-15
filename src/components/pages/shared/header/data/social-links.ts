import { routes } from "@/config";
import type { ContactInfo } from "../types";

export const socialLinksData = [
  {
    href: "#",
    label: "Síguenos en Facebook",
    platform: "facebook",
  },
  {
    href: "#",
    label: "Síguenos en Instagram",
    platform: "instagram",
  },
  {
    href: "#",
    label: "Síguenos en YouTube",
    platform: "youtube",
  },
];

export const contactInfo: ContactInfo = {
  phone: "+51 960 270 555",
  email: "labasecowork@gmail.com",
  address: "Jr. Tacna 234, piso 10, Huancayo",
};

export const secondaryLinks = [
  {
    href: routes.home,
    label: "Inicio",
  },
  {
    href: routes.about,
    label: "Acerca",
  },
  {
    href: routes.spaces,
    label: "Nuestros espacios",
  },
  {
    href: routes.testimonial,
    label: "Testimonios",
  },
  {
    href: routes.platform,
    label: "Plataforma",
  },
];

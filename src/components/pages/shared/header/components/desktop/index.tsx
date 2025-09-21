import React from "react";
import { socialLinksData, contactInfo, secondaryLinks } from "../../data";
import { routes, social } from "@/config";

const SocialIcon: React.FC<{ platform: string; className?: string }> = ({
  platform,
  className = "",
}) => {
  switch (platform) {
    case "facebook":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          className={className}
        >
          <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"></path>
        </svg>
      );
    case "instagram":
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
        </svg>
      );
    case "tiktok":
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path d="M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64L421.8 64C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z" />
        </svg>
      );
    default:
      return null;
  }
};

export const DesktopMenu: React.FC = () => {
  return (
    <>
      {/* Sección 1 */}
      <div className="flex flex-col justify-center items-start px-36 w-full">
        <div className="flex flex-col space-y-10">
          <a
            href={routes.about}
            className="text-5xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative ml-8 hover:ml-12"
            role="menuitem"
            tabIndex={0}
          >
            Sobre Nosotros
          </a>
          <a
            href={routes.arsenal}
            className="text-5xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative ml-0 hover:ml-4"
            role="menuitem"
            tabIndex={0}
          >
            El arsenal
          </a>
          <a
            href={routes.emprendimiento}
            className="text-5xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative ml-6 hover:ml-10"
            role="menuitem"
            tabIndex={0}
          >
            Emprendimiento
          </a>
          <a
            href={routes.testimonial}
            className="text-5xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative ml-2 hover:ml-6"
            role="menuitem"
            tabIndex={0}
          >
            Testimonios
          </a>
          <a
            target="_blank"
            href={social.linkedin.url}
            className="text-5xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative ml-9 hover:ml-10"
            role="menuitem"
            tabIndex={0}
          >
            Bolsa de trabajo
          </a>
        </div>
      </div>

      {/* Sección 4  */}
      <div
        className="flex flex-col justify-end items-end  border-l border-stone-700 px-24 py-16"
        role="complementary"
        aria-label="Enlaces adicionales y contacto"
      >
        <div>
          <div className="flex flex-col space-y-6 mb-12">
            <div
              className="flex flex-col space-y-4 w-full"
              role="menu"
              aria-label="Enlaces secundarios"
            >
              {secondaryLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-2xl font-secondary text-stone-100 hover:opacity-80 transition-opacity text-left block w-full"
                  role="menuitem"
                  tabIndex={0}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          {/* Redes sociales y contacto en desktop */}
          <div
            className="flex flex-col space-y-8"
            role="contentinfo"
            aria-label="Redes sociales y contacto"
          >
            <div
              className="flex space-x-4"
              role="list"
              aria-label="Redes sociales"
            >
              {socialLinksData.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="size-10 rounded-full bg-stone-800 border border-stone-700 hover:bg-stone-600 hover:border-stone-600 transition-all duration-300 flex items-center justify-center"
                  role="listitem"
                  aria-label={social.label}
                >
                  <SocialIcon
                    platform={social.platform}
                    className="text-stone-100 size-4 fill-current"
                  />
                </a>
              ))}
            </div>

            <div
              className="text-stone-50 text-left"
              role="contentinfo"
              aria-label="Información de contacto"
            >
              <p className="text-base">
                <span className="sr-only">Teléfono: </span>
                {contactInfo.phone}
              </p>
              <p className="text-base">
                <span className="sr-only">Correo electrónico: </span>
                {contactInfo.email}
              </p>
              <address className="text-base mt-2 not-italic">
                <span className="sr-only">Dirección: </span>
                Jr. Tacna 234, piso 10
                <br />
                Edificio Galena - Huancayo
              </address>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useScroll } from "../../../../hooks";

const menuItems = [
  {
    name: "INICIO",
    href: "/",
  },
  {
    name: "ESPACIOS",
    href: "/espacios",
  },
  {
    name: "NOSOTROS",
    href: "/nosotros",
  },
  {
    name: "EMPRENDIMIENTO",
    href: "/emprendimiento",
  },
  {
    name: "MENTORIA",
    href: "/mentoria",
  },
  {
    name: "TESTIMONIOS",
    href: "/testimonios",
  },
  {
    name: "BLOG",
    href: "/blog",
  },
  {
    name: "CONTACTO",
    href: "/contactanos",
  },
];

export default function Navbar({ isTransparent = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isStartPage, setIsStartPage] = useState(false);

  const {
    position: { y: currentScrollY },
  } = useScroll();

  const panelsRef = useRef([]);
  const contentRef = useRef(null);
  const closeButtonRef = useRef(null);
  const menuId = "main-menu";

  useEffect(() => {
    panelsRef.current = [];
    return () => {
      gsap.killTweensOf(panelsRef.current);
      gsap.killTweensOf(contentRef.current);
      gsap.killTweensOf(closeButtonRef.current);
    };
  }, []);

  const addPanelRef = (el) => {
    if (el && !panelsRef.current.includes(el)) {
      panelsRef.current.push(el);
    }
  };

  useEffect(() => {
    const hasScrolledDown = currentScrollY > previousScrollY;
    const isAboveThreshold = currentScrollY < 400;

    if (hasScrolledDown && isAboveThreshold) {
      setIsHeaderVisible(false);
      setIsStartPage(false);
    } else if (hasScrolledDown) {
      setIsHeaderVisible(true);
      setIsStartPage(false);
    } else {
      setIsHeaderVisible(false);
    }

    if (isAboveThreshold) {
      setIsStartPage(true);
    }

    setPreviousScrollY(currentScrollY);
  }, [currentScrollY]);

  useEffect(() => {
    gsap.killTweensOf(panelsRef.current);
    gsap.killTweensOf(contentRef.current);
    gsap.killTweensOf(closeButtonRef.current);

    if (isOpen) {
      setIsAnimating(true);

      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.style.position = "fixed";
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = "100%";

      gsap.set(panelsRef.current, {
        scaleX: 0,
        opacity: 1,
        transformOrigin: "right center",
      });

      gsap.to(panelsRef.current, {
        scaleX: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => setIsAnimating(false),
      });

      gsap.fromTo(
        [contentRef.current, closeButtonRef.current],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.7,
          ease: "power2.out",
        }
      );
    } else if (!isAnimating && panelsRef.current.length > 0) {
      setIsAnimating(true);

      gsap.to([contentRef.current, closeButtonRef.current], {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power2.in",
      });

      gsap.set(panelsRef.current, {
        transformOrigin: "right center",
      });

      gsap.to(panelsRef.current, {
        scaleX: 0,
        stagger: 0.15,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.in",
        onComplete: () => {
          const scrollY = document.body.style.top;
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.paddingRight = "";
          document.body.style.width = "";
          window.scrollTo(0, parseInt(scrollY || "0") * -1);

          setIsAnimating(false);
        },
      });
    }
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 z-50 transition-all ease-linear duration-500 text-white ${
          !isHeaderVisible ? "top-0" : "-top-[500px]"
        }`}
        style={{
          backgroundColor: isStartPage
            ? isTransparent === false
              ? "#1c1917"
              : "transparent"
            : "#1c1917",
        }}
        role="banner"
      >
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          role="navigation"
          aria-label="Navegación principal"
        >
          <a
            href="/"
            className="-m-1.5 p-1.5"
            aria-label="Ir a la página de inicio"
          >
            <img
              src="/logo.png"
              alt="La BaseCowork"
              className="lg:h-16 lg:w-52 w-32 h-10 object-cover"
              loading="lazy"
            />
          </a>

          <div className="flex items-center">
            <div
              className="hidden lg:flex gap-x-10 items-center"
              role="menubar"
              aria-label="Menú principal"
            >
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium tracking-widest uppercase text-white"
                  role="menuitem"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="ml-4 cursor-pointer inline-flex items-center justify-center rounded-md p-2.5 text-white"
              aria-expanded={isOpen}
              aria-controls={menuId}
              aria-label="Abrir menú principal"
              role="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <div
        id={menuId}
        className={`fixed inset-0 z-50 ${
          isOpen || isAnimating ? "block" : "hidden"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
      >
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            ref={addPanelRef}
            className="fixed inset-y-0 bg-stone-900"
            style={{
              left: `${index * 25}%`,
              width: "25%",
              height: "100vh",
            }}
            aria-hidden="true"
          />
        ))}

        <button
          ref={closeButtonRef}
          onClick={() => !isAnimating && setIsOpen(false)}
          className="fixed top-8 right-8 z-[70] text-white p-2 focus:outline-none cursor-pointer"
          aria-label="Cerrar menú principal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div
          ref={contentRef}
          className="fixed inset-0 z-[60] flex items-center justify-center h-full w-full overflow-auto"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="mx-auto w-full px-24 h-full flex flex-col">
            <div className="h-full grid grid-cols-[auto_400px] justify-between">
              <div className="flex flex-col justify-center h-full space-y-6">
                <div
                  className="flex flex-col space-y-8 px-24"
                  role="menu"
                  aria-label="Menú principal"
                >
                  <a
                    href="#"
                    className="text-4xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative hover:left-6 left-0"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Nuestros espacios
                  </a>
                  <a
                    href="#"
                    className="text-4xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative hover:left-16 left-12"
                    role="menuitem"
                    tabIndex={0}
                  >
                    ¿Por qué elegirnos?
                  </a>
                  <a
                    href="#"
                    className="text-4xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative hover:left-6 left-0"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Guías de la comunidad
                  </a>
                  <a
                    href="#"
                    className="text-4xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative hover:left-16 left-12"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Alquilar un espacio
                  </a>
                  <a
                    href="#"
                    className="text-4xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative hover:left-6 left-0"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Ofrecer un espacio
                  </a>
                  <a
                    href="#"
                    className="text-4xl font-secondary text-stone-100 hover:text-stone-300 transition-all capitalize relative hover:left-16 left-12"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Programas de incubacion
                  </a>
                </div>
              </div>

              <div
                className="flex flex-col justify-end border-l border-stone-700 pl-32 py-16"
                role="complementary"
                aria-label="Enlaces adicionales y contacto"
              >
                <div className="flex flex-col mb-24">
                  <div
                    className="flex flex-col space-y-4 w-full"
                    role="menu"
                    aria-label="Enlaces secundarios"
                  >
                    <a
                      href="#"
                      className="text-2xl font-secondary text-stone-100 hover:opacity-80 transition-opacity text-left block w-full"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Testimonios
                    </a>
                    <a
                      href="#"
                      className="text-2xl font-secondary text-stone-100 hover:opacity-80 transition-opacity text-left block w-full"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Mentoria
                    </a>
                    <a
                      href="#"
                      className="text-2xl font-secondary text-stone-100 hover:opacity-80 transition-opacity text-left block w-full"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Buscar espacios
                    </a>
                    <a
                      href="#"
                      className="text-2xl font-secondary text-stone-100 hover:opacity-80 transition-opacity text-left block w-full"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Oportunidades
                    </a>
                    <a
                      href="#"
                      className="text-2xl font-secondary text-stone-100 hover:opacity-80 transition-opacity text-left block w-full"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Blogs
                    </a>
                    <a
                      href="#"
                      className="text-2xl font-secondary text-stone-100 hover:opacity-80 transition-opacity text-left block w-full"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Contáctanos
                    </a>
                  </div>
                </div>

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
                    <a
                      href="#"
                      className="size-10 rounded-full bg-stone-800 border border-stone-700 hover:bg-stone-600 hover:border-stone-600 transition-all duration-300 flex items-center justify-center"
                      role="listitem"
                      aria-label="Síguenos en Facebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="text-stone-100 size-4 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="size-10 rounded-full bg-stone-800 border border-stone-700 hover:bg-stone-600 hover:border-stone-600 transition-all duration-300 flex items-center justify-center"
                      role="listitem"
                      aria-label="Síguenos en Instagram"
                    >
                      <svg
                        className="text-stone-100 size-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        aria-hidden="true"
                      >
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="size-10 rounded-full bg-stone-800 border border-stone-700 hover:bg-stone-600 hover:border-stone-600 transition-all duration-300 flex items-center justify-center"
                      role="listitem"
                      aria-label="Síguenos en YouTube"
                    >
                      <svg
                        className="text-stone-100 size-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        aria-hidden="true"
                      >
                        <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"></path>
                      </svg>
                    </a>
                  </div>

                  <div
                    className="text-stone-50 text-left"
                    role="contentinfo"
                    aria-label="Información de contacto"
                  >
                    <p className="text-base">
                      <span className="sr-only">Teléfono: </span>
                      +51 960 270 555
                    </p>
                    <p className="text-base">
                      <span className="sr-only">Correo electrónico: </span>
                      labasecowork@gmail.com
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
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useRef, useEffect } from "react";

export default function ContactFormSection() {
  const recaptchaRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isRecaptchaCompleted, setIsRecaptchaCompleted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Función para cargar reCAPTCHA v2
  useEffect(() => {
    // Crear script para cargar reCAPTCHA
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;

    // Agregar callback global para cuando reCAPTCHA se completa
    window.onRecaptchaSuccess = function () {
      setIsRecaptchaCompleted(true);
      if (formSubmitted) {
        validateForm();
      }
    };

    script.onload = () => {
      console.log("reCAPTCHA cargado");
    };

    document.body.appendChild(script);

    // Limpiar
    return () => {
      document.body.removeChild(script);
      delete window.onRecaptchaSuccess;
    };
  }, [formSubmitted]);

  // Validar formulario cuando cambian los datos, pero solo después del primer envío
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [formData, isRecaptchaCompleted, formSubmitted]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El número de teléfono es obligatorio";
    } else if (!/^\d{9,}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "El número de teléfono no es válido";
    }

    // Validar tema
    if (!formData.topic) {
      newErrors.topic = "Seleccione una razón";
    }

    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es obligatorio";
    }

    setErrors(newErrors);

    // Determinar si el formulario es válido
    const formIsValid =
      Object.keys(newErrors).length === 0 && isRecaptchaCompleted;
    setIsFormValid(formIsValid);

    return formIsValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar que el formulario se intentó enviar
    setFormSubmitted(true);

    // Verificar formulario
    const isValid = validateForm();

    if (!isValid) {
      // Mostrar mensaje al usuario (opcional)
      if (!isRecaptchaCompleted) {
        alert("Por favor, complete el captcha antes de enviar el formulario");
      }
      return;
    }

    // Obtener token de reCAPTCHA con verificación de seguridad
    let recaptchaResponse = "";
    if (typeof grecaptcha !== "undefined" && grecaptcha.getResponse) {
      recaptchaResponse = grecaptcha.getResponse();
    }

    // Proceder con el envío del formulario
    console.log("Formulario enviado:", formData);
    console.log("Token reCAPTCHA:", recaptchaResponse);

    // Aquí puedes implementar la lógica para enviar los datos al backend
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ...formData,
    //     recaptchaToken: recaptchaResponse
    //   }),
    // })

    // Resetear el formulario después de enviar
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
    });
    setIsRecaptchaCompleted(false);
    setFormSubmitted(false);
    // Verificar que grecaptcha esté disponible antes de hacer reset
    if (typeof grecaptcha !== "undefined" && grecaptcha.reset) {
      grecaptcha.reset();
    }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[500px_1fr] gap-8 max-w-7xl mx-auto p-4 sm:p-8 py-24"
      role="main"
      aria-label="Sección de contacto"
    >
      <div
        className="bg-stone-800 text-white p-10"
        role="complementary"
        aria-label="Información de contacto"
      >
        <img
          src="/logo.png"
          alt="McReynolds Real Estate Team Logo"
          className="max-w-[150px] sm:max-w-[200px] mb-10"
          loading="lazy"
        />

        <div role="contentinfo">
          <a
            href="tel:707.469.3288"
            className="block text-white no-underline text-sm sm:text-base tracking-wider"
            aria-label="Llamar al teléfono: +51 960 270 555"
          >
            +51 960 270 555
          </a>
          <a
            href="mailto:sarah@mcreynoldsrealestate.com"
            className="block text-white no-underline mb-8 text-sm sm:text-base tracking-wider"
            aria-label="Enviar correo a: contactolabase10@gmail.com"
          >
            contactolabase10@gmail.com
          </a>
          <address
            className="not-italic leading-relaxed text-sm sm:text-base tracking-wider"
            aria-label="Dirección física"
          >
            Jr. Tacna 234, piso 10
            <br />
            Edificio Galena - Huancayo
          </address>
        </div>

        <nav className="space-y-2 mt-12 sm:mt-16" aria-label="Redes sociales">
          <a
            href="#"
            className="flex items-center space-x-3 hover:text-stone-400 group transition-all duration-300"
            aria-label="Síguenos en Facebook"
          >
            <span className="size-10 rounded-full bg-stone-800 border border-stone-700 group-hover:bg-stone-600 group-hover:border-stone-600 transition-all duration-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="text-stone-100 size-4 fill-current"
                aria-hidden="true"
                role="img"
              >
                <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"></path>
              </svg>
            </span>
            <span>@labasecowork</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 hover:text-stone-400 group transition-all duration-300"
            aria-label="Síguenos en Instagram"
          >
            <span className="size-10 rounded-full bg-stone-800 border border-stone-700 group-hover:bg-stone-600 group-hover:border-stone-600 transition-all duration-300 flex items-center justify-center">
              <svg
                className="text-stone-100 size-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                aria-hidden="true"
                role="img"
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
              </svg>
            </span>
            <span>@labase</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 hover:text-stone-400 group transition-all duration-300"
            aria-label="Síguenos en YouTube"
          >
            <span className="size-10 rounded-full bg-stone-800 border border-stone-700 group-hover:bg-stone-600 group-hover:border-stone-600 transition-all duration-300 flex items-center justify-center">
              <svg
                className="text-stone-100 size-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                aria-hidden="true"
                role="img"
              >
                <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"></path>
              </svg>
            </span>
            <span>@coworklabase</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 hover:text-stone-300 group transition-all duration-300"
            aria-label="Síguenos en TikTok"
          >
            <span className="size-10 rounded-full bg-stone-800 border border-stone-700 group-hover:bg-stone-600 group-hover:border-stone-600 transition-all duration-300 flex items-center justify-center">
              <svg
                className="text-stone-100 size-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                aria-hidden="true"
                role="img"
              >
                <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"></path>
              </svg>
            </span>
            <span>@labasecowork</span>
          </a>
        </nav>
      </div>

      <form
        className="bg-white p-8 sm:p-14 shadow-sm"
        id="contactForm"
        onSubmit={handleSubmit}
        noValidate
        role="form"
        aria-label="Formulario de contacto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4 sm:mt-0">
          <div>
            <label htmlFor="firstName" className="sr-only">
              Nombres
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Nombres"
              required
              className={`w-full p-3 border ${
                formSubmitted && errors.firstName
                  ? "border-red-500"
                  : "border-stone-300"
              } text-sm sm:text-base tracking-wider bg-stone-50 placeholder:text-stone-400`}
              value={formData.firstName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={
                formSubmitted && errors.firstName ? "true" : "false"
              }
              aria-describedby={
                formSubmitted && errors.firstName
                  ? "firstName-error"
                  : undefined
              }
            />
            {formSubmitted && errors.firstName && (
              <p
                id="firstName-error"
                className="text-red-500 text-xs mt-1"
                role="alert"
              >
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="sr-only">
              Apellidos
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Apellidos"
              required
              className={`w-full p-3 border ${
                formSubmitted && errors.lastName
                  ? "border-red-500"
                  : "border-stone-300"
              } text-sm sm:text-base tracking-wider bg-stone-50 placeholder:text-stone-400`}
              value={formData.lastName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={formSubmitted && errors.lastName ? "true" : "false"}
              aria-describedby={
                formSubmitted && errors.lastName ? "lastName-error" : undefined
              }
            />
            {formSubmitted && errors.lastName && (
              <p
                id="lastName-error"
                className="text-red-500 text-xs mt-1"
                role="alert"
              >
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Correo electrónico"
            required
            className={`w-full p-3 border ${
              formSubmitted && errors.email
                ? "border-red-500"
                : "border-stone-300"
            } text-sm sm:text-base tracking-wider bg-stone-50 placeholder:text-stone-400`}
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={formSubmitted && errors.email ? "true" : "false"}
            aria-describedby={
              formSubmitted && errors.email ? "email-error" : undefined
            }
          />
          {formSubmitted && errors.email && (
            <p
              id="email-error"
              className="text-red-500 text-xs mt-1"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="phone" className="sr-only">
            Número de celular
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Numero de celular"
            required
            className={`w-full p-3 border ${
              formSubmitted && errors.phone
                ? "border-red-500"
                : "border-stone-300"
            } text-sm sm:text-base tracking-wider bg-stone-50 placeholder:text-stone-400`}
            value={formData.phone}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={formSubmitted && errors.phone ? "true" : "false"}
            aria-describedby={
              formSubmitted && errors.phone ? "phone-error" : undefined
            }
          />
          {formSubmitted && errors.phone && (
            <p
              id="phone-error"
              className="text-red-500 text-xs mt-1"
              role="alert"
            >
              {errors.phone}
            </p>
          )}
        </div>

        <div className="mb-4 mt-4">
          <label htmlFor="topic" className="sr-only">
            Razón de contacto
          </label>
          <select
            id="topic"
            name="topic"
            required
            className={`w-full p-3 border ${
              formSubmitted && errors.topic
                ? "border-red-500"
                : "border-stone-300"
            } text-sm sm:text-base tracking-wider bg-stone-50 placeholder:text-stone-400`}
            value={formData.topic}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={formSubmitted && errors.topic ? "true" : "false"}
            aria-describedby={
              formSubmitted && errors.topic ? "topic-error" : undefined
            }
          >
            <option value="">Selecciona la razon</option>
            <option value="buying">Coworking</option>
            <option value="selling">Emprendimiento</option>
            <option value="other">Otros</option>
          </select>
          {formSubmitted && errors.topic && (
            <p
              id="topic-error"
              className="text-red-500 text-xs mt-1"
              role="alert"
            >
              {errors.topic}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="sr-only">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Preguntas / Comentarios:"
            rows="4"
            required
            className={`w-full p-3 border ${
              formSubmitted && errors.message
                ? "border-red-500"
                : "border-stone-300"
            } text-sm sm:text-base tracking-wider resize-y bg-stone-50 placeholder:text-stone-400`}
            value={formData.message}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={formSubmitted && errors.message ? "true" : "false"}
            aria-describedby={
              formSubmitted && errors.message ? "message-error" : undefined
            }
          ></textarea>
          {formSubmitted && errors.message && (
            <p
              id="message-error"
              className="text-red-500 text-xs mt-1"
              role="alert"
            >
              {errors.message}
            </p>
          )}
        </div>

        <div className="mb-4" role="group" aria-label="Verificación reCAPTCHA">
          <div
            className="g-recaptcha"
            data-sitekey="6LcOAh8rAAAAALrU8ZeT7xRhmSHU6BDKDB58m1fm"
            data-callback="onRecaptchaSuccess"
          ></div>
          {formSubmitted && !isRecaptchaCompleted && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              Debe verificar que no es un robot
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`${
            formSubmitted && !isFormValid
              ? "bg-stone-300 cursor-not-allowed"
              : "bg-stone-500 hover:bg-stone-700"
          } rounded-full w-fit text-stone-100 py-4 px-12 transition-colors duration-200 text-sm sm:text-base tracking-widest font-medium uppercase mt-8`}
          disabled={formSubmitted && !isFormValid}
          aria-disabled={formSubmitted && !isFormValid}
        >
          Enviar formulario
        </button>
      </form>
    </div>
  );
}

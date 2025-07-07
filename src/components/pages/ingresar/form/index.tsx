import { useState, useRef } from "react";
import { authService } from "@/services/authService";

export default function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const errorId = "login-error-message";
  const loadingId = "loading-status";

  const togglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login(email, password);

      window.sessionStorage.setItem("auth_success", "true");
      window.sessionStorage.setItem("redirect_to", "/admin");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="pt-24 max-w-lg mx-auto"
      aria-label="Formulario de inicio de sesión"
      noValidate
      aria-describedby={error ? errorId : undefined}
    >
      <h2
        className="sm:text-3xl text-xl font-bold text-left uppercase font-secondary text-stone-900"
        id="login-title"
      >
        INGRESA CON TU CUENTA
      </h2>
      <p
        className="sm:text-base text-sm text-left text-stone-500 mt-2"
        id="login-description"
      >
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum
        architecto cupiditate consectetur harum sed atque sit, est adipisci.
        Explicabo aliquid
      </p>

      <div
        className="space-y-2 mt-8"
        role="group"
        aria-labelledby="email-label"
      >
        <label
          id="email-label"
          htmlFor="email"
          className="sm:text-base text-sm font-medium text-stone-900"
        >
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Ej. usuario@correo.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-stone-100 text-sm sm:text-base border border-stone-200 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition placeholder:text-stone-400"
          aria-required="true"
          aria-invalid={error ? "true" : "false"}
          autoComplete="email"
        />
      </div>

      <div
        className="space-y-2 mt-4"
        role="group"
        aria-labelledby="password-label"
      >
        <label
          id="password-label"
          htmlFor="password"
          className="sm:text-base text-sm font-medium text-stone-900"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Ej. fsAgwSG53$#2b"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-stone-100 border text-sm sm:text-base border-stone-200 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition placeholder:text-stone-400"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-0 bottom-0 my-auto text-stone-400"
            aria-label={
              isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            aria-pressed={isPasswordVisible}
          >
            {isPasswordVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                role="img"
              >
                <path
                  fillRule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clipRule="evenodd"
                />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                role="img"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <a
          href="/recuperar-password"
          className="sm:text-sm text-xs font-medium text-stone-900 hover:text-stone-700"
          aria-label="¿Olvidaste tu contraseña? Haz clic para recuperarla"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {error !== null && (
        <div
          className="text-red-500 text-sm mt-4 text-center bg-red-50 border-red-200 p-4"
          role="alert"
          aria-live="assertive"
          id={errorId}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-4 px-8 uppercase tracking-wider rounded-full text-xs sm:text-sm font-medium text-white bg-stone-900 hover:from-stone-600 hover:to-purple-700 transition transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 mt-8"
        aria-disabled={isLoading}
        aria-describedby={isLoading ? loadingId : undefined}
      >
        <span className="inline-flex items-center">
          <span>{isLoading ? "Iniciando sesión" : "Iniciar sesión"}</span>
          {isLoading && (
            <span
              className="ml-2"
              role="status"
              id={loadingId}
              aria-label="Cargando"
            >
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="img"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          )}
        </span>
      </button>
    </form>
  );
}

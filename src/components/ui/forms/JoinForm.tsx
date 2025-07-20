import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "@/services/apiClient";

const joinSchema = z.object({
  name: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  email: z
    .string()
    .email({ message: "Por favor, ingresa un correo electrónico válido." }),
});

type JoinFormValues = z.infer<typeof joinSchema>;

export const JoinForm = () => {
  const [submissionStatus, setSubmissionStatus] = useState<{
    message: string;
    success: boolean | null;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
  });

  const toTitleCase = (str: string): string => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const onSubmit = async (data: JoinFormValues) => {
    setSubmissionStatus(null);
    data.name = toTitleCase(data.name);

    try {
      const response = await apiClient.post("/newsletter/subscribe", data);

      if (response.status === 200 || response.status === 201) {
        setSubmissionStatus({
          message: "¡Gracias por unirte! Te contactaremos pronto.",
          success: true,
        });
        reset();
      } else {
        throw new Error("El servidor respondió con un estado inesperado.");
      }
    } catch (error: any) {
      let errorMessage =
        "Hubo un error al enviar la solicitud. Inténtalo de nuevo.";

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (
          status === 400 &&
          responseData?.description?.includes("already subscribed")
        ) {
          errorMessage =
            "Este correo electrónico ya está registrado. ¡Intenta con otro!";
        } else if (responseData?.description) {
          errorMessage = responseData.description;
        } else {
          errorMessage =
            "Ocurrió un problema en el servidor. Por favor, intenta más tarde.";
        }
      } else if (error.request) {
        errorMessage =
          "No se pudo conectar con el servidor. Revisa tu conexión a internet.";
      }

      setSubmissionStatus({
        message: errorMessage,
        success: false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-center text-stone-100 mb-4 font-secondary">
        Sé parte de la base
      </h2>

      <div>
        <label
          htmlFor="name"
          className="block font-medium text-stone-300 text-left mb-2"
        >
          Nombre
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`mt-1 block w-full bg-stone-800 border rounded-md p-2 text-stone-100 focus:ring-stone-500 focus:border-stone-500 outline-none ${errors.name ? "border-red-500" : "border-stone-600"}`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500 text-left">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block font-medium text-stone-300 text-left mb-2"
        >
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`mt-1 block w-full bg-stone-800 border rounded-md p-2 text-stone-100 focus:ring-stone-500 focus:border-stone-500 outline-none ${errors.email ? "border-red-500" : "border-stone-600"}`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500 text-left">
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-stone-600 hover:bg-stone-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
      </button>

      {submissionStatus && (
        <p
          className={`mt-4 text-center text-sm ${submissionStatus.success ? "text-green-500" : "text-red-500"}`}
        >
          {submissionStatus.message}
        </p>
      )}
    </form>
  );
};

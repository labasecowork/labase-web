import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resetFormatting: {
      /**
       * Reset all formatting
       */
      resetFormatting: () => ReturnType;
    };
  }
}

const ResetFormattingExtension = Extension.create({
  name: "resetFormatting",

  addCommands() {
    return {
      // Comando para limpiar todo el formato del texto seleccionado
      resetFormatting:
        () =>
        ({ chain }) => {
          return chain()
            .focus()
            .unsetAllMarks() // Quita todas las marcas
            .unsetMark("textStyle") // Quita estilos de texto
            .unsetMark("color") // Quita color
            .unsetMark("highlight") // Quita resaltado
            .unsetMark("bold") // Quita negrita
            .unsetMark("italic") // Quita cursiva
            .unsetMark("underline") // Quita subrayado
            .run();
        },
    };
  },
});

export default ResetFormattingExtension;

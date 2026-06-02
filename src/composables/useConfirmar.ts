import { ref } from "vue";

export const useConfirmar = () => {
  const dialog = ref(false);
  const mensaje = ref("");
  const textoAceptar = ref("Eliminar");
  const colorAceptar = ref("red");
  const resolve = ref<(value: boolean) => void>();

  const confirmar = (
    msg: string,
    opciones?: { textoAceptar?: string; colorAceptar?: string }
  ): Promise<boolean> => {
    mensaje.value = msg;
    textoAceptar.value = opciones?.textoAceptar ?? "Eliminar";
    colorAceptar.value = opciones?.colorAceptar ?? "red";
    dialog.value = true;
    return new Promise((res) => {
      resolve.value = res;
    });
  };

  const aceptar = () => {
    dialog.value = false;
    resolve.value?.(true);
  };

  const cancelar = () => {
    dialog.value = false;
    resolve.value?.(false);
  };

  return { dialog, mensaje, textoAceptar, colorAceptar, confirmar, aceptar, cancelar };
};

import { ref } from "vue";

export const useConfirmar = () => {
  const dialog = ref(false);
  const resolve = ref<(value: boolean) => void>();

  const confirmar = (): Promise<boolean> => {
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

  return { dialog, confirmar, aceptar, cancelar };
};
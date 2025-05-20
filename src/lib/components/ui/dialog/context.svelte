<script context="module" lang="ts">
  import { setContext, getContext } from "svelte";
  export type DialogContext = {
    isOpen: () => boolean;
    open: () => void;
    close: () => void;
    setDialogElement: (dialogElement: HTMLDialogElement) => void;
    handleNativeClose: () => void;
  };

  export const DIALOG_CONTEXT_KEY = Symbol("dialogContext");

  export const setDialogContext = (context: DialogContext) => {
    setContext<DialogContext>(DIALOG_CONTEXT_KEY, context);
  }

  export const getDialogContext = () => {
    const context = getContext<DialogContext>(DIALOG_CONTEXT_KEY);
    if (!context) {
      throw new Error("Dialog context not found, are you using it inside a Dialog component?");
    }
    return context;
  };
</script>

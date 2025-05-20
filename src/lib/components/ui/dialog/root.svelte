<script lang="ts">
  import { setDialogContext, getDialogContext } from "./context.svelte";
  import type { Snippet } from "svelte";

  let { children } : { children: Snippet}  = $props()

  let isOpen = $state(false);
  let dialogEl = $state<HTMLDialogElement | null>(null);

  const open = () => {
    isOpen = true;
    console.log(dialogEl)
  };

  const close = (returnValue?: string) => {
    isOpen = false;
    dialogEl?.close(returnValue);
  };

  const handleNativeClose = () => {
    isOpen = false;
  };

  const setDialogElement = (el: HTMLDialogElement) => {
    dialogEl = el;
  };

  import { onDestroy } from "svelte";

  $effect((): void => {
    if (isOpen && dialogEl) {
      if (!dialogEl.open) {
        dialogEl.showModal();
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });


  setDialogContext({
    isOpen: () => isOpen,
    open,
    close,
    handleNativeClose,
    setDialogElement,
  });
</script>

{@render children()}
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLDialogAttributes } from "svelte/elements";
  import {getDialogContext} from "./context.svelte";
  import clsx from "clsx";

  let { children, className, ...rest }: { children: Snippet, className?: string } & HTMLDialogAttributes = $props();

  const { isOpen: isDialogOpen, setDialogElement, handleNativeClose, close } = getDialogContext();

  let dialog: HTMLDialogElement | null = $state(null);
  
  const handleBackDropClick = (e: MouseEvent) => {
    if (e.target === dialog) {
      close();
    }
  };

  $effect((): void => {
    if (!dialog) return;
    setDialogElement(dialog);
  });
</script>

{#if isDialogOpen()}
<dialog
  bind:this={dialog}
  class={clsx(
    "inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto w-full h-full bg-black/30 animate-fade backdrop-blur-sm",
    className
  )}
  onclick={handleBackDropClick}
  onclose={handleNativeClose}
  aria-modal="true"
  {...rest}
>
<div
  class="flex flex-col items-center justify-center w-full max-w-2xl mx-auto bg-background border border-secondary rounded-lg shadow-lg">
{@render children()}
</div>
</dialog>
{/if}


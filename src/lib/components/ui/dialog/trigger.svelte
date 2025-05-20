<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { getDialogContext } from "./context.svelte";
  import clsx from "clsx";

  type Props = {
    children?: Snippet
    className?: string;
  } & HTMLButtonAttributes;

  const { children, className, ...rest }: Props = $props();

  const { open } = getDialogContext();

</script>

<button
  class={clsx(
    "inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
    className
  )}
  onclick={open}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    Open
  {/if}
</button>

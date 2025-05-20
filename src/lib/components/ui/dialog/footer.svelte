<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import clsx from "clsx";

  type Props = {
    children?: Snippet;
    className?: string;
  } & HTMLAttributes<HTMLDivElement>;

  const { children, className, ...rest }: Props = $props();
</script>

<div
  class={clsx(
    "flex items-center justify-between px-4 py-3 border-b border-secondary",
    className
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</div>
<script lang="ts">
  import type { Snippet, ComponentProps } from "svelte";
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
    "relative flex items-center justify-start px-4 py-5 border-b border-secondary",
    className
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</div>

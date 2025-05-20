<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import clsx from "clsx";

  type Props = {
    children?: Snippet;
    className?: string;
  } & HTMLAttributes<HTMLHeadingElement>;

  const { children, className, ...rest }: Props = $props();

</script>

<h2
  class={clsx(
    "text-lg font-medium leading-6 text-foreground",
    className
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</h2>
<script lang="ts">
  import { type Snippet } from "svelte";
  import clsx from "clsx";

  interface TabListProps {
    children: Snippet;
    className?: string;
  }

  const { children, className } : TabListProps = $props();


</script>

<div
  class={clsx(
    "flex flex-row items-center justify-center w-full h-auto",
    className
  )}>
  {@render children()}
  </div>





  



  
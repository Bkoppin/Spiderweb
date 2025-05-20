<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { getDialogContext } from "./context.svelte";
  import clsx from "clsx";

  type Props = {
    children?: Snippet
    className?: string;
  } & HTMLButtonAttributes
  
  const { children, className, ...rest }: Props = $props();

  const { close } = getDialogContext();

  const handleClick = () => {
    close();
  };
</script>

<button type="button" onclick={handleClick} {...rest} class={clsx(
    "absolute top-1 right-2 rounded-md p-1 text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary",
    className
  )}>
	{#if children}
		{@render children()}
	{:else}
		<svg 
			aria-hidden="true" 
			focusable="false" 
			xmlns="http://www.w3.org/2000/svg" 
			width="1em" 
			height="1em" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="currentColor" 
			stroke-width="2" 
			stroke-linecap="round" 
			stroke-linejoin="round"
		>
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
	{/if}
</button>
<script lang="ts">
  import { page } from "$app/state";
  import clsx from "clsx";

  interface LinkProps {
    href: string;
    className?: string;
    children: () => any;
  }

  let { href, className, children}: LinkProps = $props();
</script>

<a href={href} class={
  clsx(className, page.url.pathname === href
    ? "pointer-events-none text-secondary"
    :  "hover:text-secondary transition-colors duration-200 ease-in-out")
    }
    data-sveltekit-preload-data="hover"
    >
  {@render children()}
</a>
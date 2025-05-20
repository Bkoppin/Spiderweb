<script lang="ts">
  import { getTabsContext } from "./context.svelte";
  import { type Snippet } from "svelte";
  import clsx from "clsx";



  interface TabTriggerProps {
    value: unknown;
    children: Snippet;
    className?: string;
  }

  const { value, children, className } : TabTriggerProps = $props();

  const { selectTab, selectedTabValue } = getTabsContext();

  let isDisabled = $state(false);

  $effect(() => {
    const selectedValue = selectedTabValue();
    isDisabled = value === selectedValue;
  });

</script>

<button
  class={clsx(
    "flex items-center justify-center w-auto h-auto px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
    "disabled:bg-gray-600 disabled:cursor-not-allowed",
    className
  )}
  disabled={isDisabled}
  onclick={() => selectTab(value)}

  >
  {@render children()}
</button>
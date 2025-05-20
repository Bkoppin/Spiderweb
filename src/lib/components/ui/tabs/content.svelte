<script lang="ts">
  import {setTabsContext, type TabRegistration, getTabsContext} from "./context.svelte";
  import {onMount, type Snippet} from "svelte";
  import clsx from "clsx";

  interface TabContentProps {
    children: Snippet;
    className?: string;
    value?: unknown;
  }

  const {children, className, value} : TabContentProps = $props();
  const {selectedTabValue, registeredTabs, registerTab} = getTabsContext();

  registerTab({
    value: value,
    content: children,
  })

  const tab = registeredTabs().find((tab) => tab.value === value);

</script>

{#if selectedTabValue() === tab?.value}
  <div
    class={clsx(
      "flex flex-col w-full h-full py-4 animate-fade",
      className
    )}
  >
    {@render children()}
  </div>
{/if}
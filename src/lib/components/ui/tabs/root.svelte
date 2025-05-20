<script lang="ts">
  import { setTabsContext, getTabsContext, type TabRegistration } from "./context.svelte";
  import { type Snippet } from "svelte";

  interface TabRootProps {
    value?: unknown;
    children: Snippet
  }


  const { value, children } : TabRootProps = $props()

  let selectedTabValue: unknown = $state(value)

  const selectTab = (tab: unknown) => {
    selectedTabValue = tab;
    console.log("Selected tab:", selectedTabValue);
  };

  let registeredTabs: TabRegistration[] = [];

  const registerTab = (tab: TabRegistration) => {
    const existingTab = registeredTabs.find((t) => t.value === tab.value);
    if (existingTab) {
      registeredTabs = registeredTabs.map((t) => (t.value === tab.value ? tab : t));
    } else {
      registeredTabs = [...registeredTabs, tab];
    }
  };

  const unregisterTab = (value: unknown) => {
    const index = registeredTabs.findIndex((tab) => tab.value === value);
    if (index !== -1) {
      registeredTabs.splice(index, 1);
    }
  };

  setTabsContext({
    selectedTabValue: () => selectedTabValue, 
    selectTab,
    registerTab,
    unregisterTab,
    registeredTabs: () => registeredTabs,
  });

</script>

<div
  class="flex flex-col w-full h-full"
  >
  {@render children()}
</div>


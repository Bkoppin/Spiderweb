<script context="module" lang="ts">
  import { setContext, getContext, type Snippet } from "svelte";
  

  export interface TabRegistration {
    value: unknown;
    content?: Snippet;
  }

  export interface TabsContext {
    selectedTabValue: () => unknown;
    selectTab: (value: unknown) => void;
    registerTab: (tab: TabRegistration) => void;
    unregisterTab: (value: unknown) => void;
    registeredTabs: () => TabRegistration[];
  }

  export const TABS_CONTEXT_KEY = Symbol("TABS_CONTEXT_KEY");

  export const setTabsContext = (context: TabsContext) => {
    setContext(TABS_CONTEXT_KEY, context);
  };

  export const getTabsContext = () => {
    const context = getContext<TabsContext>(TABS_CONTEXT_KEY);

    if (!context) {
      throw new Error("Tabs context not found");
    }

    return context;
  };
</script>
<script lang="ts">
  import { setContext } from "svelte";
  import { QueryClient } from "$lib/client/queryClient";

  let { children } = $props();

  // Set the context using the imported singleton instance
  setContext("queryClient", QueryClient);

</script>

{@render children()}


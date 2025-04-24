<script lang="ts">
	import '../app.css';
	import QueryClientProvider from '$lib/client/queryClientProvider.svelte';
	let { children } = $props();
</script>
<QueryClientProvider>
{@render children()}
</QueryClientProvider>

<script lang="ts">
	import '../app.css';
	import QueryClientProvider from '$lib/client/queryClientProvider.svelte';
	import { NavBar } from '$lib/components/ui/nav';
	let { children } = $props();
</script>

<QueryClientProvider>
	<header>
		<NavBar />
	</header>
	{@render children()}
</QueryClientProvider>

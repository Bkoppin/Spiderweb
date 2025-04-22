<script>
  import { useQuery } from "$lib/client/query.svelte";
  import { onMount, tick } from "svelte";
  import { z } from "zod";

  const testSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  async function fetchTest() {
    const response = await fetch("/api/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const simulateError = Math.random() < 0.5; // Simulate a 50% chance of error
    if (simulateError) {
      throw new Error("Simulated error occurred while fetching data.");
    }

    const simulateDataUpdate = Math.random() < 0.5; // Simulate a 50% chance of data update
    if (simulateDataUpdate) {
      const updatedData = { id: 1, name: "Updated Name" };
      return updatedData;
    }
    const data = await response.json();

    const parsedData = testSchema.parse(data);
    return parsedData;
  }

  const query = useQuery("test", {
    enabled: true,
    queryFn: fetchTest,
    onError: (error) => {
      console.error("Error fetching data:", error);
    },
    onSuccess: (data) => {
      console.log("Data fetched successfully:", data);
    },
  });

  function handleRefresh() {
    query.refetch();
  }

  function handleInvalidate() {
    query.invalidate()
  }

</script>

<h1>Test</h1>
{#if query.isLoading}
  <p>Loading...</p>
{:else if query.isError}
  <p>Error: {query.error}</p>
{:else if query.data}
  <p>Data: {JSON.stringify(query.data)}</p>
{:else}
  <p>No data loaded.</p>
{/if}
<button on:click={handleRefresh}>Refresh</button>
<button on:click={handleInvalidate}>Invalidate</button>

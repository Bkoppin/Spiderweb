<script lang="ts">
  import { useQuery } from "$lib/client/query.svelte";
  import { useMutation } from "$lib/client/mutation.svelte";
  import { z } from "zod";
	import { QueryClient } from "$lib/client/queryClient";

  const testSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  let name = $state("");

  let delId = $state("");

  async function fetchTest() {
    try {
    const response = await fetch("/api/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch data");
    }
    return data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }

    
  }

  async function simulateMutation(id: number, name: string) : Promise<z.infer<typeof testSchema>> {
    const response = await fetch("/api/test", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name }),
    });
    const data = await response.json();
    const parsedData = testSchema.parse(data);
    return parsedData;
  }

  async function simulatePost(id: number, string: number) : Promise<z.infer<typeof testSchema>> {
    const response = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name }),
    });
    const data = await response.json();
    const parsedData = testSchema.parse(data);
    return parsedData;
  }

  async function SimulateDelete(id: string) : Promise<z.infer<typeof testSchema>> {
    const response = await fetch("/api/test", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    const parsedData = testSchema.parse(data);
    return parsedData;
  }

  const post = useMutation({
    mutationFn: simulatePost,
    onError: (error) => {
      console.error("Error posting data:", error);
    },
    onSuccess: (data) => {
      console.log("Data posted successfully:", data);
    },
  });

  const deleteName = useMutation({
    mutationFn: SimulateDelete,
    onError: (error) => {
      console.error("Error deleting data:", error);
    },
    onSuccess: (data) => {
      console.log("Data deleted successfully:", data);
    },
  });



  const query = useQuery("test", {
    enabled: true,
    queryFn: fetchTest,
    onError: (error) => {
      console.error("Error fetching data:", error);
    },
    onSuccess: (data) => {
      console.log("Data fetched successfully:", data)
    },
    staleTime: 1
  });

  const mutation = useMutation({
    mutationFn: simulateMutation,
    invalidateKeys: ["test"],
    onError: (error) => {
      console.error("Error mutating data:", error);
    },
    onSuccess: (data) => {
      console.log("Data mutated successfully:", data);
    },
  });

  function handleRefresh() {
    query.refetch();
  }

  function handleInvalidate() {
    query.invalidate()
  }

  function handleMutation() {
    mutation.mutate(delId, name);
    query.invalidate();
  }

  function blurHandler(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    name = input.value;
  }

  function deleteBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    delId = input.value;
  }

  function handlePost() {
    post.mutate(Math.floor(Math.random() * 1000), name);
    query.invalidate();
  }

  function handleDelete() {
    deleteName.mutate(delId);
    query.invalidate();
  }

</script>

<h1>Test</h1>
{#if query.isLoading}
  <p>Loading...</p>
{:else if query.isError}
  <p>Error: {query.error?.message}</p>
{:else if query.data}
  <p>Data: {JSON.stringify(query.data.result.data)}</p>
{:else}
  <p>No data loaded.</p>
{/if}
<button onclick={handleRefresh}>Refresh</button>
<button onclick={handleInvalidate}>Invalidate</button>
<button onclick={handleMutation}>PUT</button>
<button onclick={handlePost}>POST</button>
<button onclick={handleDelete}>DELETE</button>
<input type="text" value={name} onblur={blurHandler} placeholder="Name" />
<input type="text" value={delId} onblur={deleteBlur} placeholder="ID" />

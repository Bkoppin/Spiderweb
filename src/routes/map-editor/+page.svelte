<script>
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { useQuery } from "$lib/client/query.svelte";
    import { useMutation } from "$lib/client/mutation.svelte";
    import { getUserWorlds } from "$lib/client/queries/worlds";

    console.log(page.data.user);
    const initData = {
      nodes: [{ id: 0 }],
      links: [],
    };

    const query = useQuery("userWorlds",
      {
        queryFn: () => getUserWorlds(page.data.user.userID),
        
      }
    )

    /**
     * @type {import("3d-force-graph").ForceGraph3DInstance<import("three-forcegraph").NodeObject,
     * import("three-forcegraph").LinkObject<import("three-forcegraph").NodeObject>>}
     */
    let Graph;

    /**
     * @param {HTMLElement} elem
     */
    async function createGraph(elem) {
      const ForceGraph3D = (await import("3d-force-graph")).default; // Dynamically import the library
      const Graph = new ForceGraph3D(elem)
        .enableNodeDrag(false)
        .onNodeHover(node => elem.style.cursor = node ? 'pointer' : '')
        .onNodeClick(handleNodeClick)
        .graphData(initData);
      return Graph;
    }

    /**
     * @param {import("three-forcegraph").NodeObject} node
     */
    function removeNode(node) {
        let { nodes, links } = Graph.graphData();
        links = links.filter(l => l.source !== node && l.target !== node); // Remove links attached to node
        if (typeof node.id === 'number') {
            nodes.splice(node.id, 1); // Remove node
        } else {
            console.error("Node id is not a valid number:", node.id);
        }
        nodes.forEach((n, idx) => { n.id = idx; }); // Reset node ids to array index
        Graph.graphData({ nodes, links });
    }

    /**
     * Adds a new node to the graph or removes the clicked node based on user input.
     * @param {import("three-forcegraph").NodeObject} node
     */
    function handleNodeClick(node) {
      const userAction = confirm("Click OK to add a new node or Cancel to remove the clicked node.");
      if (userAction) {
        addNode(node); // Pass the clicked node to addNode
      } else {
        removeNode(node);
      }
    }

    /**
	 * @param {import("three-forcegraph").NodeObject} clickedNode
	 */
    function addNode(clickedNode) {
      let { nodes, links } = Graph.graphData();
      const id = nodes.length;
      nodes.push({ id }); // Add new node with the next id
      if (clickedNode) {
        links.push({ source: id, target: clickedNode.id }); // Add a link to the clicked node
      }
      Graph.graphData({ nodes, links });
    }

    onMount(async () => {
      if (typeof window !== "undefined") { // Ensure this runs only in the browser
        const elem = document.getElementById("graph-3d");
        if (elem) {
          Graph = await createGraph(elem);
        } else {
          console.error("Element with id 'graph-3d' not found.");
        }
      }
    });
</script>

<style>
  #graph-3d {
    width: 100%;
    height: 100vh;
    background-color: black;
  }
</style>

{#if query.isLoading}
  <p>Loading...</p>
{:else if query.error}
  <p>Error loading data: {query.error.message}</p>
{:else if !query.data || query.data.length === 0}
  <p>No worlds found for this user.</p>
  <div id="graph-3d"></div>
{/if}

  
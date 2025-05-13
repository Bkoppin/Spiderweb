<script lang="ts">
  import { auth } from "$lib/client/stores/auth";
  import { onMount } from "svelte";

  $: console.log("Component: Detected $auth change:", $auth);

  const handleLogin = async (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;
    console.log("Component: Calling auth.login...");
    try {
        await auth.login(username, password);
        console.log("Component: auth.login finished.");
     } catch (error) {
        console.error("Component: Login failed:", error);
        alert(`Login failed: ${error.message}`);
     }
  };

  const handleRegister = async (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;
    await auth.register(username, password);
  };

  onMount(async () => {
    console.log("Component: Mounting, calling checkAuth...");
    await auth.checkAuth();
  });

</script>

<main>
  {#if $auth?.user}
    <h1>Welcome, {$auth?.user.username}</h1>
  {:else}
    <h1>Please log in or register</h1>
  {/if}

  <h1>Login</h1>
  <form onsubmit={handleLogin} class="flex flex-col">
    <label for="username">Username</label>
    <input type="text" id="username" name="username" required>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required>
    <button type="submit">Login</button>
  </form>
  <h1>Register</h1>
  <form onsubmit={handleRegister} class="flex flex-col">
    <label for="username">Username</label>
    <input type="text" id="username" name="username" required>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required>
    <button type="submit">Register</button>
  </form>
  <button onclick={async () => await auth.logout()}>Logout</button>
</main>
<script lang="ts">
 import { auth } from "$lib/client/stores/auth";
  import { onMount } from "svelte";

 const handleLogin = async (event: SubmitEvent) => {
   event.preventDefault();
   const form = event.target as HTMLFormElement;
   const username = form.username.value;
   const password = form.password.value;
   await auth.login(username, password);
 };

  const handleRegister = async (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;
    await auth.register(username, password);
  };

  onMount(auth.checkAuth);


  

</script>

<main>
  <p>Logged in as { $auth ? $auth?.username : "Guest"}</p>
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
<script lang="ts">
  import { page } from "$app/state";
  import { auth } from "$lib/client/stores/auth";
  import { Link } from "$lib/components/ui/link";
  import Tabs from "$lib/components/ui/tabs";
  import Dialog from "$lib/components/ui/dialog";
  import Loginform from "$lib/components/login/loginform.svelte";
  import RegisterForm from "$lib/components/login/registerForm.svelte";

  const isLoggedIn = $derived(page.data.isLoggedIn)

  $effect(() => {
    console.log("isLoggedIn", isLoggedIn);
  })

</script>

<nav class ="flex justify-between items-center p-4 bg-background text-white">
  <Link href="/" className="text-2xl font-bold">
    Spiderweb
  </Link>
  <div class="flex space-x-4">
    <Link href="/about">
      About
    </Link>
    {#if isLoggedIn}
      <Link href="/profile">
        Profile
      </Link>
      <button class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        onclick={() => {
          auth.logout();
        }}>
        Logout
      </button>

    {:else if isLoggedIn === false}
    <Dialog.Root>
      <Dialog.Trigger className="transition-all">
        Login / Sign-up
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header className="w-full">
          <Dialog.Title className="w-fit">
            Login / Sign-up
          </Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>

        <Dialog.Body>
          <Tabs.Root value="login">
            <Tabs.List>
              <Tabs.Trigger value="login" className="w-1/2">
                Login
              </Tabs.Trigger>
              <Tabs.Trigger value="signup" className="w-1/2">
                Sign-up
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="login" className="justify-center items-center">
              <Loginform zodForm={page.data.loginForm}/>
            </Tabs.Content>
            <Tabs.Content value="signup" className="justify-center items-center">
              <RegisterForm zodForm={page.data.registerForm} />
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
</nav>


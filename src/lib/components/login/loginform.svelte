<script lang="ts">
	import { invalidate } from "$app/navigation";
  import * as Form from "$lib/components/ui/form/index";
  import { Input } from "$lib/components/ui/input";
  import { loginFormSchema, type LoginFormSchema } from "./formSchema";
  import {
    type SuperValidated,
    type Infer, 
    superForm
  } from "sveltekit-superforms";
  import {zodClient} from "sveltekit-superforms/adapters";

  let { zodForm } : { zodForm: SuperValidated<Infer<LoginFormSchema>>} = $props();
   
  const form = superForm(zodForm, {
    validators: zodClient(loginFormSchema),
    invalidateAll: "force",
    onResult: (event) => {
      if (event.result.status === 200) {
        return invalidate("app:auth")
      } 

    },
  });

  const { form: formData, enhance} = form;
</script>

<form method="POST" action="/login" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({props}: { props: Record<string, any> })}
      <Form.Label>Username</Form.Label>
      <Input {...props} bind:value={$formData.username} class="w-fit" />
      {/snippet}
    </Form.Control>
    <Form.Description class="text-foreground">Enter your username.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="password">
    <Form.Control>
      {#snippet children({props}: { props: Record<string, any> })}
      <Form.Label>Password</Form.Label>
      <Input {...props} bind:value={$formData.password} type="password" class="w-fit" />
      {/snippet}
    </Form.Control>
    <Form.Description class="text-foreground">Enter your password.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Login</Form.Button>
</form>
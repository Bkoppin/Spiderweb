<script lang="ts">
	import { invalidate } from "$app/navigation";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { registerFormSchema, type RegisterFormSchema } from "./formSchema";
  import {
    type SuperValidated,
    type Infer,
    superForm
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  let { zodForm }: { zodForm: SuperValidated<Infer<RegisterFormSchema>>} = $props();

  const form = superForm(zodForm, {
    validators: zodClient(registerFormSchema),
    invalidateAll: "force",
    onResult: (event) => {
      if (event.result.status === 200) {
        return invalidate("app:auth")
      } 

    },
  });


  const { form: formData, enhance } = form;

</script>

<form method="POST" action="/register" use:enhance class="flex flex-col gap-4">
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({props}: { props: Record<string, any> })}
      <Form.Label>Username</Form.Label>

      <Input {...props} bind:value={$formData.username} class="w-fit" />

      {/snippet}
    </Form.Control>
    <Form.Description class="text-foreground">Enter a username between 2 and 20 characters.</Form.Description>
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
  <Form.Button class="w-fit">Register</Form.Button>
</form>

<template>

    <h2>Register</h2>
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">

        <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit">
            Register
        </UButton>
    </UForm>
    <small>Already have an Account? <ULink to="/user/login">Login</ULink></small>
</template>

<script setup>

const state = reactive({
  email: undefined,
  password: undefined
});

const client = useSupabaseClient();

const validate = (state) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return errors;
}

async function onSubmit (event) {
  const { user, error } = await client.auth.signUp({
    email: state.email,
    password: state.password,
  });  
}

</script>

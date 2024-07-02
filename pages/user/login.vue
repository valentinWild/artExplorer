<template>
    <h2>Login</h2>
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit()">

        <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit">
            Sign In
        </UButton>
    </UForm>
    <small>You don't have an Account? <ULink to="/user/register">Register</ULink></small>
</template>

<script setup>
definePageMeta({
    // middleware: ['auth'],
});

const state = reactive({
  email: undefined,
  password: undefined
});

const client = useSupabaseClient();
const user = useSupabaseUser();

onMounted(() => {
  watchEffect(() => {
    if (user.value) {
      // navigateTo('/dashboard');
    }
  });
});

const validate = (state) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return errors;
}

async function onSubmit(event) {
  const { user, session, error } = await client.auth.signInWithPassword({
    email: state.email,
    password: state.password,
  });  
}



</script>

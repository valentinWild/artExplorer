<template>
   <div class="login-container">
    <h2>Login</h2>
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit()">
      
      <UFormGroup label="Email" name="email" class="form-group">
        <UInput v-model="state.email" class="input-field" />
      </UFormGroup>
      
      <UFormGroup label="Password" name="password" class="form-group">
        <UInput v-model="state.password" type="password" class="input-field" />
      </UFormGroup>
      
      <UButton type="submit">
        Sign In
      </UButton>
    </UForm>
    <small>You don't have an Account? <ULink to="/user/register">Register</ULink></small>
  </div>
</template>

<script setup>
definePageMeta({
    middleware: ['auth'],
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
      navigateTo('/dashboard');
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

<style scoped>
.login-container {
  color: rgb(255, 255, 255);
  text-align: center;
  width: 300px; 
  margin: 0 auto; 
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.5); 
  border-radius: 8px; 
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

UInput {
  width: 300px; 
  max-width: 100%; 
}

h2, small, UButton {
  color: white;
}
</style>
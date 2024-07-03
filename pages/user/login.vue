<template>
   <div class="login-page">
      <div class="content-container">
        <div class="welcome-section">
          <img src="/pictures/Login.png" alt="Welcome Image" class="welcome-image" />
        </div>
      <div class="login-section">
        <h2 class="font-bold text-3xl">Login</h2>
          <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit()">
        
            <UFormGroup label="E-Mail" name="email" class="form-group" :ui="{ label: 'text-cyan-300' }">
              <UInput v-model="state.email" class="input-field" />
            </UFormGroup>
        
            <UFormGroup label="Password" name="password" class="form-group" :ui="{ label: 'text-cyan-300' }">
              <UInput v-model="state.password" type="password" class="input-field" />
            </UFormGroup>
            <div class="button-container">
              <UButton type="submit">
                Sign In
              </UButton>
            </div>
          </UForm>
        <small>You don't have an Account? <ULink to="/user/register" class="register-link">Register</ULink></small>
        
      </div>
    </div>
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

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/public/pictures/Background.png');
}

.content-container {
  display: flex;
  width: 80%;
  max-width: 1200px;
  background-color: #121421;
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(40px); 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
  border: 1px solid #58B9CC;
}

.welcome-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  color: white;
}

.welcome-image {
  max-width: 110%;
  height: auto;
  margin-bottom: 0.2rem;
}

.login-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white; 
}

h2 {
  margin-bottom: 2rem; 
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.input-field {
  width: 300px; 
  max-width: 100%; 
  margin-bottom: 1rem;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

small {
  margin-top: 2rem; 
  text-align: center;
}

</style>
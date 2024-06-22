<template>

    <h2>Register</h2>
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">

        <UFormGroup label="Username" name="email">
            <UInput v-model="state.username" />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit">
            Submit
        </UButton>
    </UForm>
</template>

<script setup lang="ts">

import type { FormError, FormSubmitEvent } from '#ui/types'

const state = reactive({
  username: undefined,
  email: undefined,
  password: undefined
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Required' })
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return errors;
}

async function onSubmit (event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)

  try {
    const res = await $fetch('../api/auth/register', {
      method: 'POST',
      body: {username: state.username, email: state.email, password: state.password}
    })
  } catch (error) {
    console.error(error);
  }
}

</script>

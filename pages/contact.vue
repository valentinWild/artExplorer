<template>
    <div class="contact-page">
       <div class="content-container">
         <div class="contactText-section">
           <img src="/pictures/Contact.png" alt="Contact Image" class="contact-image" />
         </div>
       <div class="message-section">
         <h2 class="font-bold text-3xl">Contact Us</h2>
     <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit()">
 
             <UFormGroup label="Name" name="name" class="form-group" :ui="{ label: 'text-cyan-300' }">
               <UInput v-model="state.name" class="input-field" />
         </UFormGroup>
 
             <UFormGroup label="E-Mail" name="email" class="form-group" :ui="{ label: 'text-cyan-300' }">
               <UInput v-model="state.email" class="input-field" />
         </UFormGroup>

         <UFormGroup label="Message" name="message" class="form-group" :ui="{ label: 'text-cyan-300' }">
            <UTextarea v-model="state.message"  class="textarea-field" />
          </UFormGroup>

             <div class="button-container">
         <UButton type="send">
             Send Message
         </UButton>
             </div>
     </UForm>
         
       </div>
     </div>
   </div>
 </template>
 
 <script setup>
 const state = reactive({
   name: '',
   email: '',
   message: ''
 });
 
 const validate = (state) => {
   const errors = [];
   if (!state.name) errors.push({ path: 'name', message: 'Required' });
   if (!state.email) errors.push({ path: 'email', message: 'Required' });
   if (!state.message) errors.push({ path: 'message', message: 'Required' });
   return errors;
 }
 
 function onSubmit(event) {
   event.preventDefault();
   state.name = '';
   state.email = '';
   state.message = '';
 }
 </script>

 
 <style scoped>
 
 .contact-page {
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
 
 .contactText-section {
   flex: 1;
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 2rem;
   text-align: center;
   color: white;
 }
 
 .contact-image {
   max-width: 110%;
   height: auto;
   margin-bottom: 0.2rem;
 }
 
 .message-section {
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
 
 .input-field .textarea-field {
   width: 400px; 
   max-width: 100%; 
   margin-bottom: 1rem;
 }

 .textarea-field {
  height: 150px;
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
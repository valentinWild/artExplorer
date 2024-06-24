<template>
    <header>
       <nav>
           <ul>
               <li>
                   <ULink 
                        to="/" 
                        active-class="text-primary font-semibold"
                        inactive-class="text-gray-800 hover:text-primary font-semibold"
                    >
                        Home
                    </ULink>
               </li>
               <li>
                   <ULink 
                        to="/about"
                        active-class="text-primary font-semibold"
                        inactive-class="text-gray-800 hover:text-primary font-semibold"
                    >
                        About
                    </ULink>
               </li>
               <li>
                    <ULink 
                        to="/contact"
                        class=""
                        active-class="text-primary font-semibold"
                        inactive-class="text-gray-800 hover:text-primary font-semibold"
                    >Contact</ULink>
               </li>
               <li>
                    <UButton
                        v-if="!user"
                        to="/user/login"
                    >Login</UButton>
                    <UButton
                        v-if="user"
                        @click="signOut"
                    >Logout</UButton>
               </li>
           </ul>
       </nav>
    </header>
</template>
   

<script setup>

const user = useSupabaseUser();
const client = useSupabaseClient();

const signOut = async () => {
    const {error} = await client.auth.signOut();
    if (error) {
        console.error(error);
    }
}

</script>
   
<style scoped>
 
header {
    width: 100%;
    background-color:aquamarine;
}

ul {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    position: sticky;
    top: 0px
}

</style>
   
   
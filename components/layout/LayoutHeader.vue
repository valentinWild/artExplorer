<template>
    <header>
       <nav>
            <div class="logo">
                <img src="/pictures/Logo2.png" alt="Logo" />
            </div>
           <ul class="nav-links">
               <li>
                   <ULink 
                        to="/" 
                        active-class="text-primary font-semibold"
                        inactive-class="text-stone-100 hover:text-primary font-semibold"
                    >
                        Home
                    </ULink>
               </li>
               <li>
                   <ULink 
                        to="/about"
                        active-class="text-primary font-semibold"
                        inactive-class="text-stone-100 hover:text-primary font-semibold"
                    >
                        About
                    </ULink>
               </li>
               <li>
                   <ULink 
                        to="/learnsets" 
                        active-class="text-primary font-semibold"
                        inactive-class="text-gray-800 hover:text-primary font-semibold"
                    >
                        Learning
                    </ULink>
               </li>
               <li>
                    <ULink 
                        to="/contact"
                        class=""
                        active-class="text-primary font-semibold"
                        inactive-class="text-stone-100 hover:text-primary font-semibold"
                    >Contact</ULink>
               </li>
           </ul>
           <div class="auth-buttons">
                <UButton
                    v-if="!user"
                    to="/user/login"
                >Login</UButton>
                <UButton
                    v-if="user"
                    @click="signOut"
                >Logout</UButton>
            </div>
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
    background-color: #121421;
    margin-bottom: 0.2rem;
    align-items: center;
    padding: 1rem;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border: none;
    outline: none;
    box-shadow: none;
}

.logo img {
    height: 80px; 
}

.nav-links {
    display: flex;
    flex-direction: row;
    gap: 3rem;
}

.auth-buttons {
    display: flex;
    gap: 0.5rem;
}

.nav-links, .auth-buttons {
    display: flex;
    align-items: center;
}

.nav-links li {
    list-style: none;
}


ul {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 5rem;
    position: sticky;
    top: 10px
}

</style>
   
   
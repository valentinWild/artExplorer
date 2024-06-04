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
                        active-class="text-primary font-semibold"
                        inactive-class="text-gray-800 hover:text-primary font-semibold"
                    >Contact</ULink>
               </li>
           </ul>
       </nav>
    </header>
</template>
   

<script setup lang="ts">

</script>
   
<style scoped>
 
header {
    width: 100%
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
   
   
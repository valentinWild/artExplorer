<template>
    <body>
    <section class="section1">
        <div class="initialText">
            <h1 class="text-5xl text-cyan-300 font-extrabold tracking-normal font-sans">Dive into the Fascinating World of Art History</h1>
            <br>
            <h2 class="font-semibold font-sans text-xl text-stone-100">Our learning application offers you the opportunity to gain deeper insights into the masterpieces and epochs of art.</h2>
        </div>

        <div class="features">
            <span>Expand your horizon</span>
            <span class="separator">|</span>
            <span>Test your knowledge</span>
            <span class="separator">|</span>
            <span>Receive feedback</span>
        </div>

        <div class="initialButton">
            <UButton to="/user/login" :ui="{ label: 'font-medium' }">
                Get Started Now
            </UButton>
        </div>

        <div class="carousel">
            <UCarousel v-slot="{ item }" :items="items" class="full-width-carousel">
                <img :src="item" width="300" height="400" draggable="false">
            </UCarousel>
        </div>

    </section>

    <section class="section2">
        <div>
            <UDivider 
            label="A PLACE TO LEARN"
            size="sm"
            :ui="{ label: 'text-cyan-300' }"
            />
        </div>
        
        <div class="two-columns">

            <div class="bg-zinc-300">
                <h1 class="text-2xl font-sans font-semibold text-cyan-200">All Tools & Learning Materials for Maximum Learning Success</h1>
                <p class="text-stone-100 font-normal">Bleib organisiert und motiviert </p>
                <br>
                <p class="text-stone-100 text-sm">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>

                <div class="avatar-text-group">
                    <div class="avatars">
                        <UAvatarGroup size="sm" :max="3">
                            <UAvatar
                            src="https://avatars.githubusercontent.com/u/739984?v=4"
                            alt="benjamincanac"
                            />
                            <UAvatar
                            src="https://avatars.githubusercontent.com/u/904724?v=4"
                            alt="Atinux"
                            />
                            <UAvatar
                            src="https://avatars.githubusercontent.com/u/7547335?v=4"
                            alt="smarroufin"
                            />
                        </UAvatarGroup>
                    </div>  

                    <div class="text-group">
                        <h1 class="font-semibold text-stone-100">150+</h1>
                        <br>
                        <p class="font-semibold text-stone-100">nutzen ArtExplorer</p>
                    </div>
                </div>

            
                <UButton>Visit Learnsets</UButton>
            </div>

            <div class="videoContainer">
                <div class="videotext">
                    <h1 class="text-2xl font-sans font-semibold text-cyan-200">Discover all the tasks we can offer you.</h1>
                </div>
                <div class="video">
                    <video width="300" controls loop autoplay muted>
                        <source src="/pictures/video.mp4" type="video/mp4">
                    </video>
                </div>
            </div>
            
        </div>

    </section>

    <section class="section2">
        <div>
            <UDivider 
            label="DISCOVER"
            size="xs"
            :ui="{ label: 'text-cyan-300' }"
            />
        </div>
        
        <div class="two-columns">

            <div>
                <h1>TBA</h1>
                <p>Lorum ipsum</p>
                <UButton>Visit Learnsets</UButton>
            </div>
            <div>
                <h2>TBA</h2>
                <p>Lorum ipsum</p>
                <UButton>Analytics</UButton>
            </div>
            
            
        </div>

        <!---Random Number:<span>{{ randomString }}</span>-->
        <!---<Test></Test>-->
    </section>

    <section class="section2">
        <UDivider label="DISCOVER" />
        <div class="two-columns">

            <div>
                <h1>TBA</h1>
                <p>Lorum ipsum</p>
                <UButton>Visit Learnsets</UButton>
            </div>
            <div class="videoMaterial">
                <h2>TBA</h2>
                <p>Lorum ipsum</p>
                <UButton>Analytics</UButton>
            </div>
            
            
        </div>

        <!---Random Number:<span>{{ randomString }}</span>-->
        <!---<Test></Test>-->
    </section>


    <section class="section3">
        <!--<UDivider label="DISCOVER" />
        <div>
            <h1>Hello Petra</h1>
        </div>

        <div>

        </div>-->

    </section>
</body>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const items = ref([]); // State to hold the images

// Function to fetch images from the API
async function fetchImages() {
  try {
    const response = await fetch('https://api.artic.edu/api/v1/artworks?page=1&limit=100');
    const data = await response.json();
    const uniqueImageUrls = new Set();
    
    data.data.forEach(image => {
      if (image.image_id && (image.style_title === "Modernism" || image.style_title === "Impressionism")) {
        const imageUrl = `${iiifBaseUrl}/${image.image_id}/full/400,400/0/default.jpg`;
        uniqueImageUrls.add(imageUrl);
      }
    });
    items.value = Array.from(uniqueImageUrls);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Fetch images when the component is mounted
onMounted(fetchImages);

const iiifBaseUrl = 'https://www.artic.edu/iiif/2'; // Base URL for IIIF images

//const {data: randomString} = await useFetch('/api/randomString/');

</script>


<style scoped>

body{
    background-color: #121421;
}

.section1{
    background-image: url('/public/pictures/Background.png');
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem; /* Abstand zwischen den Elementen */
    text-align: center;
    padding-left:5rem;
    padding-right: 5rem;
    padding-top: 5rem;
    padding-bottom: 5rem;
}

.features {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem; 
  font-size: 1rem; 
  color: white; 
  margin-top: 5rem;
}

.carousel {
  margin-top: 3rem; 
}

.initialButton {
  margin-top: 1.5rem; 
}

.separator {
  color: #06B6D4; 
}


.section2{
    background-color: #121421;
}

.full-width-carousel {
    width: 100%;
}

.two-columns {
    display: flex;
    justify-content: space-between;
    gap: 5rem; /* Optional: Abstand zwischen den Spalten */
    padding-left: 5em;
    padding-right: 5rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.videoContainer {
    display: flex;
    align-items: center; /* Center items vertically */
    justify-content: space-between; /* Optional: adds space between items */
    gap: 1rem; /* Optional: gap between the two divs */
    padding: 3rem;
    background: rgba(255, 255, 255, 0.09); 
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
    backdrop-filter: blur(10px); 
    -webkit-backdrop-filter: blur(10px); 
}

.two-columns > div {
    flex: 1;
    padding: 3rem; /* Optional Innenabstand */
    background: rgba(255, 255, 255, 0.09); 
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px); 
}

.avatar-text-group {
  display: flex;
  align-items: center;
  gap: 1.2rem; /* Abstand zwischen den Avatars und dem Text */
}

.avatars {
  display: flex;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.text-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
}



</style>
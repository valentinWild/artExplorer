<template>
    <body>
    <section class="section1">
        <div>
            <h1>Dive into the Fascinating World of Art History</h1>
            <h2>Our learning application offers you the opportunity to gain deeper insights into the masterpieces and epochs of art.</h2>
        </div>

        <div class="features">
            <span>Expand your horizon</span>
            <span class="separator">|</span>
            <span>Test your knowledge</span>
            <span class="separator">|</span>
            <span>Receive feedback</span>
        </div>

        <div>
            <UButton>Get Started Now</UButton>
        </div>

        <div>
            <UCarousel v-slot="{ item }" :items="items" class="full-width-carousel">
                <img :src="item" width="300" height="400" draggable="false">
            </UCarousel>
        </div>

    </section>

    <section class="section2">
        <UDivider label="DISCOVER" />
        <div class="two-columns">

            <div>
                <h1>Hello Petra</h1>
                <p>Lorum ipsum</p>
                <UButton>Visit Learnsets</UButton>
            </div>
            <div>
                <h2>Zwei</h2>
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
                <h1>Hello Petra</h1>
                <p>Lorum ipsum</p>
                <UButton>Visit Learnsets</UButton>
            </div>
            <div>
                <h2>Zwei</h2>
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
                <h1>Hello Petra</h1>
                <p>Lorum ipsum</p>
                <UButton>Visit Learnsets</UButton>
            </div>
            <div>
                <h2>Zwei</h2>
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
    background-color:#64748b;
}

.section1{
    background-color: #64748b;
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

.section1 h1 {
    font-size: 2.5rem;
    color: #fff;
}

.section1 h2 {
    font-size: 1.2rem; 
    color: #fff;
}

.features {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem; 
  font-size: 1rem; 
  color: white; 
}

.separator {
  color: #06B6D4; 
}


.section2{
    background-color: #64748b;
}

.full-width-carousel {
    width: 100%;
}

.two-columns {
    display: flex;
    justify-content: space-between;
    gap: 5rem; /* Optional: Abstand zwischen den Spalten */
    padding-left: 5rem;
    padding-right: 5rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.two-columns > div {
    flex: 1;
    padding: 5rem; /* Optional Innenabstand */
    background-color: #fff; /* Optional Hintergrundfarbe der Spalten */
    border-radius: 8px; /* Optional Abgerundete Ecken */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional Schatten */
}



</style>
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
                <p class="text-stone-100 font-normal" style="text-align: justify;"> Stay organized and motivated with us!</p>
                <br>
                <p class="text-stone-100 text-sm" style="text-align: justify;">Discover the fascinating world of art with ArtExplorer! Our app offers you an interactive and entertaining way to learn. Test your knowledge with exciting quizzes and learn all about famous artists, artworks and eras in a fun way.
                    Join our growing community of over 150+ art lovers and benefit from exclusive learning sets that will help you expand and deepen your knowledge. Whether you are a beginner or an advanced art connoisseur, you will find the right content to improve your knowledge.
                    <br>Analyze and understand your own learning journey with our dashboard. It helps you to track your progress and work specifically on your weaknesses.</p>

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
                        <h1 class="font-semibold text-stone-100" style="color: #FEC52D;">150+</h1>
                        <br>
                        <p class="font-semibold text-stone-100" style="color: #FEC52D;">nutzen ArtExplorer</p>
                    </div>
                </div>

            
                <UButton to="/user/login">Visit Learnsets</UButton>
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

        <div class="image-container">
        <img src="/pictures/Students.png" alt="Students Studying" class="centered-image">
        </div>

        
        <div class="two-columns">

            <div class="funcionality">
                <h1 class="text-2xl font-sans font-semibold" style="margin-bottom: 20px;">Discover the Magic of Art History with Learning Sets!</h1>
                <p class="text-stone-100 text-sm" style="margin-bottom: 20px; text-align: justify; font-style: italic;">Unlock the secrets of different art epochs with our interactive Learning Sets. Dive into the era of your choice and explore various quiz sets designed to help you memorize artists and their masterpieces, match them accurately, and much more. Through Multiple Choice questions, Task Orders, Matching exercises, and Fill-in-the-Blank challenges, you'll become a master of each unique artistic period.</p>
                <p class="text-stone-100 text-m font-semibold text-cyan-300" style="margin-bottom: 20px; text-align: justify; font-style: italic;">Ready to ignite your passion for art and history?
                    <br>
                    Start learning now and transform your knowledge!</p>

                <img src="/pictures/Epoche.png" alt="Art History" class="functionality-image">
                <UButton to="/user/login"  style="margin-top: 20px;" :ui="{ label: 'font-medium' }">Become a Member</UButton>
            </div>

            <div class="analytics">
                <div class="analyticstext-image">
                <div class="analyticstext">
                    <h1 class="text-2xl font-sans font-semibold text-cyan-200" style="margin-bottom: 30px;">Track Your Progress with Smart Analytics</h1>
                    <p class="text-stone-100 text-sm" style="margin-bottom: 40px; text-align: justify;">Track your learning progress effortlessly with our comprehensive dashboard. 
                    Our app automatically analyzes your learning success, presenting it in various ways to help you understand your strengths and areas for improvement. See your progress in real-time and stay motivated on your journey to becoming an art history expert.</p>

                    <p class="text-stone-100 text-m font-semibold text-cyan-300" style="margin-bottom: 20px; text-align: justify; font-style: italic;">Start practicing today and receive feedback on your learning process!</p>
                    <UButton to="/user/login"  style="margin-top: 20px;" :ui="{ label: 'font-medium' }">Log In and Discover Your Dashboard</UButton>
                </div>
                <div class="analyticsImage">
                    <img src="/pictures/Analytics.png" alt="Art History" class="analytics-image">
                </div>
            </div>
        </div>
        </div>

    </section>

</body>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const items = ref([]); 
const iiifBaseUrl = 'https://www.artic.edu/iiif/2'; 

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
    gap: 2rem; 
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
    gap: 5rem; 
    padding-left: 5em;
    padding-right: 5rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.videoContainer {
    display: flex;
    align-items: center; 
    justify-content: space-between; 
    gap: 1rem; 
    padding: 3rem;
    background: rgba(255, 255, 255, 0.09); 
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
    backdrop-filter: blur(10px); 
    -webkit-backdrop-filter: blur(10px); 
}

.two-columns > div {
    flex: 1;
    padding: 3rem; 
    background: rgba(255, 255, 255, 0.09); 
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px); 
}

.avatar-text-group {
  display: flex;
  align-items: center;
  gap: 1.2rem;
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

.image-container {
  display: flex;
  justify-content: center;
  padding: 3.5rem 0;
}

.centered-image {
  max-width: 70%;
  height: auto;
  border-radius: 10px;
}

.funcionality h1 {
    color: #FEC52D;
}

.funcionality img.functionality-image {
    width: 70%; 
    height: auto; 
    margin-bottom: 10px; 
    margin-left: 6rem;
    margin-top: 1.5rem;
}

.analytics h1{
    color:#67E8F9;
}

.analytics {
    display: flex;
    align-items: center;
}

.analyticstext-image {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.analyticstext {
    flex: 1;
}

.analyticsImage {
    flex: 1;
}

.analytics img.analytics-image {
    max-width: 100%;
    height: auto;
}


</style>
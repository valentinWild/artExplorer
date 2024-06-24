<template>
    <body>
    <section class="section1">
        <h1>Grow your Skills to Advance your Career Path</h1>

        <UButton>Get Started Now</UButton>

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
const {data: randomString} = await useFetch('/api/randomString/');

const items = [
  '/pictures/image1.jpg',
  '/pictures/image2.jpg',
  '/pictures/image3.jpg',
  '/pictures/image1.jpg',
  '/pictures/image2.jpg',
  '/pictures/image3.jpg',
  '/pictures/image1.jpg',
  '/pictures/image2.jpg',
  '/pictures/image3.jpg',
  '/pictures/image1.jpg',
  '/pictures/image2.jpg',
  '/pictures/image3.jpg',
  '/pictures/image1.jpg',
  '/pictures/image2.jpg',
]
</script>


<style scoped>

body{
    background-color:#64748b;
}

.section1{
    background-color: #64748b;
    background-image: url('/public/pictures/image1.jpg'); /* Pfad zum Hintergrundbild */
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem; /* Abstand zwischen den Elementen */
    text-align: center; /* Text zentrieren */
    padding-left:5rem;
    padding-right: 5rem;
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
    padding: 5rem; /* Optional: Innenabstand */
    background-color: #fff; /* Optional: Hintergrundfarbe der Spalten */
    border-radius: 8px; /* Optional: Abgerundete Ecken */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Schatten */
}



</style>
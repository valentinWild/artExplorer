<script>
import QuizComponent from './index.vue';

export default {
  name: 'App',
  components: {
    QuizComponent
  }
};
</script>



<template>
    <div class="container">
        <header>
            <h1>Learning Sets</h1>
            <input type="text" placeholder="Search ...">
        </header>
        <div class="options-container">
            <div class="card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/54/Claude_Monet%2C_Impression%2C_soleil_levant.jpg" alt="Impressionist Painting">
                <div class="card-text">
                    <h2>Impressionism</h2>
                    <p>15 questions</p>
                </div>
            </div>
        </div>
    </div>
    <div id="app">
    <QuizComponent />
  </div>
</template>

<style scoped>
    .container{
        max-width: 1000px;
        margin: 0 auto;
        justify-content: center; /* Horizontale Zentrierung */
        align-items: center; /* Vertikale Zentrierung */
    }

    header{
        margin-bottom: 10px;
        margin-top: 10px;
        display: flex;
        justify-content: center; /* Horizontale Zentrierung */
        align-items: center; /* Vertikale Zentrierung */
    }

    header h1 {
        font-weight: bold;
        margin-right: 20px; 
    }

    header input {
        border: none;
        background-color: rgba(128, 128, 128, 0.1);
        padding: 5px;
        border-radius: 5px;
    }

    /* OPTIONS CONTAINER */
    .options-container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 40px;
        justify-content: center; /* Zentrierung der Card */
    }

    /* CARD */
    .card{
        width: 310px;
        overflow: hidden;
        border-radius: 2%;
        box-shadow: 1px 1px 10px rgba(0,0,0,0.1);
        margin-bottom: 35px;
        margin-right: 20px;
        cursor: pointer;
    }

    .card img{
        width: 100%;
        height: 190px;
        margin: 0;
    }

    .card .card-text{
        padding: 5px 5px;
    }

    .card .card-text h2 {
        font-weight: bold;
    }

    .card .card-text p {
        font-size: 14px; /* Festlegung der Schriftgröße */
        color: #666666; /* Festlegung der Schriftfarbe */
    }

    



</style>

<template>
    <div class="timeline-container">
      <h1>Sort the pictures in the correct chronological order:</h1>
      <div class="timeline">
        <div class="date-container" v-for="(date, index) in dates" :key="date">
          <div 
            class="date" 
            :class="{'selected': selectedField === index, 'correct': checkStatus && placedImages[index] && placedImages[index].correct_order === index + 1, 'incorrect': checkStatus && (!placedImages[index] || placedImages[index].correct_order !== index + 1)}"
            @click="selectField(index)"
          >
            <div v-if="placedImages[index]" class="image-placeholder">
              <img :src="placedImages[index].src" :alt="placedImages[index].artist_title">
            </div>
            <div v-else class="placeholder"></div>
          </div>
        </div>
      </div>
      <svg class="timeline-line" viewBox="0 0 100 10" preserveAspectRatio="none">
        <line x1="0" y1="5" x2="100" y2="5" stroke="white" stroke-width="0.5"/>
        <polygon points="95,3 100,5 95,7" fill="white" />
        <polygon points="5,3 0,5 5,7" fill="white" />
      </svg>
      <div class="dates">
        <span class="date-label" v-for="(date, index) in dates" :key="date">{{ date }}</span>
      </div>
      <div class="images">
        <div 
          class="image" 
          v-for="image in images" 
          :key="image.id"
          :class="{'selected': selectedImage === image}"
          @click="selectImage(image)"
        >
          <img :src="image.src" :alt="image.artist_title">
          <p>{{ image.artist_title }}</p>
        </div>
      </div>
      <button @click="checkOrder" class="button">Done</button>
      <div v-if="showMessage" :class="['message', messageClass]">
        <Icons v-if="messageClass === 'message-success'" class="result-icon" type="happy" />
        <Icons v-if="messageClass === 'message-error'" class="result-icon" type="sad" />
        {{ message }}
      </div>
      <button v-if="showNextButton" @click="fetchImages" class="button">Next</button>
    </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from 'vue'
import Icons from '../components/Icons.vue'; 
import axios from 'axios'; 

const API_URL = 'https://api.artic.edu/api/v1/artworks/search';

export default defineComponent({
  components: {
    Icons
  },
  data() {
    return {
      dates: [],
      images: reactive([]),
      selectedImage: null,
      selectedField: null,
      placedImages: reactive({}),
      checkStatus: false,
      showMessage: false,
      message: '',
      messageClass: '',
      showNextButton: false
    }
  },
  methods: {
    async fetchImages() {
      try {
        const randomSearchTerms = ['impressionism', 'renaissance', 'baroque', 'modernism'];
        const randomTerm = randomSearchTerms[Math.floor(Math.random() * randomSearchTerms.length)];
        const params = {
          q: randomTerm, // suche
          fields: 'id,title,image_id,artist_title,date_display',
          limit: 4 
        };
        const response = await axios.get(API_URL, { params });
        const artworks = response.data.data;
        this.images = artworks.map((artwork, index) => ({
          id: artwork.id,
          src: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
          artist_title: artwork.artist_title,
          date_display: artwork.date_display,
          correct_order: index + 1 // reihenfolge
        }));
        this.dates = this.images.map(image => image.date_display);
        this.resetQuizState();
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    },
    selectImage(image) {
      this.selectedImage = image;
    },
    selectField(index) {
      if (this.selectedImage) {
        this.placedImages[index] = this.selectedImage;
        this.images = this.images.filter(img => img.id !== this.selectedImage.id);
        this.selectedImage = null;
      }
      this.selectedField = index;
    },
    checkOrder() {
      this.checkStatus = true;
      let correct = true;
      for (let i = 0; i < this.dates.length; i++) {
        if (!this.placedImages[i] || this.placedImages[i].correct_order !== i + 1) {
          correct = false;
        }
      }
      if (correct) {
        this.showMessage = true;
        this.message = 'Correct order!';
        this.messageClass = 'message-success';
        this.showNextButton = true;
      } else {
        this.showMessage = true;
        this.message = 'Wrong order, try again.';
        this.messageClass = 'message-error';
        this.showNextButton = false;
      }
      setTimeout(() => {
        this.showMessage = false;
      }, 3000);
    },
    resetQuizState() {
      this.selectedImage = null;
      this.selectedField = null;
      this.placedImages = reactive({});
      this.checkStatus = false;
      this.showNextButton = false;
      this.showMessage = false;
      this.message = '';
      this.messageClass = '';
    }
  },
  mounted() {
    this.fetchImages();
  }
})
</script>

<style scoped>
body {
  background-color: #1a202c;
  color: #ffffff;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.timeline-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #2d3748;
  color: #ffffff;
  border-radius: 10px;
  position: relative;
}

h1 {
  color: #ffffff;
  font-weight: bold;
  font-size: x-large;
  margin-bottom: 20px;
}

.timeline {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px 0;
  position: relative;
}

.date-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date {
  width: 200px;
  height: 200px;
  background-color: #4a5568;
  padding: 10px;
  border-radius: 5px;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  margin-bottom: 5px;
}

.date.selected {
  background-color: #52B3D0;
}

.date.correct {
  background-color: lightgreen;
}

.date.incorrect {
  background-color: lightcoral;
}

.date .placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed #a0aec0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.date .image-placeholder img {
  max-width: 100%;
  max-height: 100%;
  height: 100%; 
}

.timeline-line {
  width: 100%;
  height: 20px;
  margin-top: 10px;
}

.dates {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.date-label {
  background-color: #4a5568;
  padding: 5px;
  border-radius: 5px;
  color: #e2e8f0;
  font-weight: bold;
  margin-top: 5px;
  width: 200px;
  text-align: center;
}

.images {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
}

.image {
  width: 200px;
  text-align: center;
  padding: 10px;
  background-color: #4a5568;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  transition: border 0.3s, background-color 0.3s;
  color: #e2e8f0;
}

.image.selected {
  border: 2px solid #52B3D0;
  background-color: #2d3748;
}

.image img {
  max-width: 100%;
  height: 200px;
  border-radius: 5px;
}

.button {
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 20px 0;
  color: white;
  font-weight: bold;
  background-color: #52B3D0;
}

.message {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-success {
  background-color: lightgreen;
  color: #2d3748;
}

.message-error {
  background-color: lightcoral;
  color: #2d3748;
}

.result-icon {
  margin-right: 10px; 
  vertical-align: middle; 
  font-size: 20px; 
}
</style>

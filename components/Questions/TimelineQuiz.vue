<template>
  <div class="timeline-container">
    <h1>Sort the pictures in the correct chronological order:</h1>
    <div class="timeline">
      <div class="date-container" v-for="(date, index) in sortedDates" :key="date.id">
        <div
          class="date"
          :class="{
            'selected': selectedField === index,
            'correct': checkStatus && placedImages[index] && placedImages[index].id === date.id,
            'incorrect': checkStatus && placedImages[index] && placedImages[index].id !== date.id
          }"
          @click="selectField(index)"
        >
          <div v-if="placedImages[index]" class="image-placeholder">
            <img :src="placedImages[index].src" :alt="placedImages[index].title">
            <p class="image-info">{{ placedImages[index].title }} - {{ placedImages[index].artist_title }}</p>
          </div>
          <div v-else class="placeholder"></div>
        </div>
      </div>
    </div>
    <div class="dates">
      <span class="date-label" v-for="(date, index) in sortedDates" :key="date.id">{{ date.date_display }}</span>
    </div>
    <svg class="timeline-line" viewBox="0 0 100 10" preserveAspectRatio="none">
      <line x1="0" y1="5" x2="100" y2="5" stroke="white" stroke-width="0.5"/>
      <polygon points="95,3 100,5 95,7" fill="white"/>
      <polygon points="5,3 0,5 5,7" fill="white"/>
    </svg>
    <div class="images">
      <div
        class="image"
        v-for="image in images"
        :key="image.id"
        :class="{'selected': selectedImage === image}"
        @click="selectImage(image)"
      >
        <img :src="image.src" :alt="image.title">
        <p class="image-info">{{ image.title }} - {{ image.artist_title }}</p>
      </div>
    </div>
    <button v-if="!showNextButton" @click="checkOrder" class="button">Done</button>
    <button v-if="showNextButton" @click="nextQuiz" class="button">Next</button>
    <div v-if="showMessage" :class="['message', messageClass]">
      <Icons v-if="messageClass === 'message-success'" class="result-icon" type="happy"/>
      <Icons v-if="messageClass === 'message-error'" class="result-icon" type="sad"/>
      {{ message }}
      <div v-if="messageClass === 'message-error'" class="correct-order">
        <p>The correct order is:</p>
        <ul>
          <li v-for="date in sortedDates" :key="date.id"><strong>{{ date.date_display }}:</strong> {{ date.title }} - {{ date.artist_title }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted, computed } from 'vue';
import Icons from '../components/Icons.vue';
import axios from 'axios';
import helpers from '../server/utils/helpers.js';

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
    };
  },
  computed: {
    sortedDates() {
      return this.dates.slice().sort((a, b) => {
        const yearA = parseInt(a.date_display.match(/\d{4}/));
        const yearB = parseInt(b.date_display.match(/\d{4}/));
        return yearA - yearB;
      });
    }
  },
  methods: {
    async fetchImages() {
      try {
        const styleCategory = this.$route.query.style_category || 'impressionism'; // Default style category
        const imageResults = await this.fetchImageByStyle(styleCategory);

        let filteredImages = imageResults.filter(image => image.title && image.artist_title && image.date_display.match(/\d{4}/));
        filteredImages = this.shuffleArray(filteredImages);

        const uniqueYears = new Set();
        const selectedImages = [];

        for (let artwork of filteredImages) {
          let year = artwork.date_display.match(/\d{4}/);
          if (year && !uniqueYears.has(year[0])) {
            uniqueYears.add(year[0]);
            selectedImages.push(artwork);
            if (selectedImages.length >= 4) break;
          }
        }

        this.images = [];
        let validImageCount = 0;
        for (let artwork of selectedImages) {
          const src = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`;
          const validImage = await this.isValidImage(src);
          if (validImage) {
            this.images.push({
              id: artwork.id,
              src,
              title: artwork.title,
              artist_title: artwork.artist_title,
              date_display: this.cleanDateDisplay(artwork.date_display),
            });
            validImageCount++;
          }
          if (validImageCount >= 4) break;
        }

        helpers.shuffleArray(this.images);
        if (this.images.length < 4) {
          throw new Error('Not enough valid images to create a quiz.');
        }
        this.dates = this.images.map(image => ({
          id: image.id,
          date_display: image.date_display,
          title: image.title,
          artist_title: image.artist_title
        }));
        this.resetQuizState();
      } catch (error) {
        console.error('Error fetching images:', error);
        this.message = 'Error fetching images, please try again later.';
        this.messageClass = 'message-error';
        this.showMessage = true;
      }
    },
    async fetchImageByStyle(style) {
      const params = {
        q: style,
        fields: 'id,title,image_id,artist_title,date_display',
        limit: 50
      };
      const response = await axios.get(API_URL, { params });
      return response.data.data;
    },
    async isValidImage(url) {
      try {
        await axios.get(url);
        return true;
      } catch (error) {
        return false;
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
      for (let i = 0; i < this.sortedDates.length; i++) {
        const expectedDate = this.sortedDates[i];
        const placedImage = this.placedImages[i];
        if (!placedImage || placedImage.id !== expectedDate.id) {
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
        this.message = 'Wrong order.';
        this.messageClass = 'message-error';
        this.showNextButton = true;
      }
    },
    nextQuiz() {
      this.$emit('next-quiz');
    },
    cleanDateDisplay(dateDisplay) {
      return dateDisplay
        .replace(/(modeled|designed|cast|painted|sculpted|created|photographed|published|printed|rebuilt|restored)\s*/gi, '')
        .replace('c. ', '');
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
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  },
  mounted() {
    this.fetchImages();
  }
});
</script>

<style scoped>
body {
  background-color: #1a202c;
  color: #ffffff;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.timeline-container {
  max-width: 1100px;
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
  margin: 0 10px; /* Add margin between date containers */
}

.date {
  width: 250px;
  height: 300px;
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

.date .image-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.date .image-placeholder img {
  max-width: 100%;
  height: 200px;
  border-radius: 5px;
}

.date .image-placeholder p {
  margin: 5px 0;
  font-size: smaller;
}

.timeline-line {
  width: 100%;
  height: 30px;
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
  width: 250px;
  text-align: center;
}

.images {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
}

.image {
  width: 250px;
  text-align: center;
  padding: 8px;
  background-color: #4a5568;
  border-radius: 5px;
  cursor: pointer;
  transition: border 0.3s, background-color 0.3s;
  color: #e2e8f0;
  margin: 0 10px; /* Add margin between images */
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
 position: relative;
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

.image .image-info {
  margin: 5px 0;
  font-size: smaller;
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
  flex-direction: column; 
}

.message-success {
  background-color: lightgreen;
  color: #2d3748;
}

.message-error {
  background-color: lightcoral;
  color: #2d3748;
}

.correct-order {
  margin-top: 10px;
  text-align: left;
}

.correct-order strong {
  font-weight: bold;
}

.result-icon {
  margin-right: 10px; 
  vertical-align: middle; 
  font-size: 20px; 
}
</style>



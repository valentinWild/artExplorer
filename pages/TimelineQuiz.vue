<template>
    <div class="timeline-container">
      <h1>Bringe die Bilder in die richtige zeitliche Reihenfolge:</h1>
      <div class="timeline">
        <div 
          class="date" 
          v-for="(date, index) in dates" 
          :key="date"
          :class="{'selected': selectedField === index}"
          @click="selectField(index)"
        >
          <div v-if="placedImages[index]">
            <img :src="placedImages[index].src" :alt="placedImages[index].artist_title">
            <p>{{ placedImages[index].artist_title }}</p>
          </div>
          <div v-else>
            {{ date }}
          </div>
        </div>
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
      <button @click="checkOrder">Überprüfen</button>
    </div>
  </template>
  
  
  <script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  data() {
    return {
      dates: ['date_display1', 'date_display2', 'date_display3', 'date_display4'],
      images: reactive([
        { id: 1, src: 'https://www.artic.edu/iiif/2/381b2912-9769-1e17-8145-0016368f0cc4/full/843,/0/default.jpg', artist_title: 'artist_title1', period: 'Impressionismus', correct_order: 1 },
        { id: 2, src: 'https://www.artic.edu/iiif/2/381b2912-9769-1e17-8145-0016368f0cc4/full/843,/0/default.jpg', artist_title: 'artist_title2', period: 'Impressionismus', correct_order: 2 },
        { id: 3, src: 'https://www.artic.edu/iiif/2/381b2912-9769-1e17-8145-0016368f0cc4/full/843,/0/default.jpg', artist_title: 'artist_title3', period: 'Moderne', correct_order: 3 },
        { id: 4, src: 'https://www.artic.edu/iiif/2/381b2912-9769-1e17-8145-0016368f0cc4/full/843,/0/default.jpg', artist_title: 'artist_title4', period: 'Impressionismus', correct_order: 4 },
      ]),
      selectedImage: null,
      selectedField: null,
      placedImages: reactive({})
    }
  },
  methods: {
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
      let correct = true;
      for (let i = 0; i < this.dates.length; i++) {
        if (!this.placedImages[i] || this.placedImages[i].correct_order !== i + 1) {
          correct = false;
          break;
        }
      }
      if (correct) {
        alert('Richtige Reihenfolge!');
      } else {
        alert('Falsche Reihenfolge, versuche es nochmal.');
      }
    }
  }
})
</script>

  
  
  <style>
  .timeline-container {
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }
  
  .timeline {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  
  .date {
    width: 100px;
    height: 150px;
    background-color: #ff6b6b;
    padding: 10px;
    border-radius: 5px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .date.selected {
    background-color: #ff9b9b;
  }
  
  .images {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .image {
    width: 100px;
    text-align: center;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px;
    transition: border 0.3s;
  }
  
  .image.selected {
    border: 2px solid #ff6b6b;
  }
  
  .image img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }
  </style>
  
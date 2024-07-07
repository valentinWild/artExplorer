<template>
    <div class="timeline-container">
      <div class="timeline">
        <div v-for="slot in slots" :key="slot.year" class="timeline-slot">
          <div class="slot-year">{{ slot.year }}</div>
          <draggable
            :list="slot.images"
            class="draggable-list"
            group="images"
            @end="checkOrder"
          >
            <div v-for="image in slot.images" :key="image.id" class="image-slot">
              <img :src="image.src" :alt="image.title" class="image"/>
            </div>
          </draggable>
        </div>
      </div>
      <button @click="verifyOrder">Verify Order</button>
      <div v-if="orderFeedback" class="feedback">{{ orderFeedback }}</div>
    </div>
  </template>
  
  <script>
  import draggable from 'vuedraggable';
  
  export default {
    props: {
      slots: {
        type: Array,
        required: true,
      },
    },
    components: {
      draggable,
    },
    data() {
      return {
        orderFeedback: '',
      };
    },
    methods: {
      checkOrder() {
        this.orderFeedback = '';
        this.slots.forEach((slot) => {
          slot.images.forEach((image, index) => {
            image.correct = image.correctIndex === index;
          });
        });
      },
      verifyOrder() {
        let allCorrect = true;
        this.slots.forEach((slot) => {
          slot.images.forEach((image) => {
            if (!image.correct) {
              allCorrect = false;
            }
          });
        });
        if (allCorrect) {
          this.orderFeedback = 'All images are in the correct order!';
        } else {
          this.orderFeedback = 'Some images are in the wrong order. Please try again.';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .timeline-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .timeline {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 20px 0;
  }
  
  .timeline-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .slot-year {
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .draggable-list {
    display: flex;
    flex-direction: column;
  }
  
  .image-slot {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
  }
  
  .image {
    max-width: 100%;
    max-height: 100%;
  }
  
  .feedback {
    margin-top: 20px;
    font-weight: bold;
    color: #ff0000;
  }
  </style>
  
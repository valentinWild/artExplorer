<template>
    <div class="progress-bar">
      <div class="progress-bar-inner correct" :style="{ width: `${correctWidth}%` }"></div>
      <div class="progress-bar-inner incorrect" :style="{ width: `${incorrectWidth}%`, left: `${correctWidth}%` }"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProgressBar',
    props: {
      correct: {
        type: Number,
        required: true
      },
      incorrect: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    },
    computed: {
      correctWidth() {
        return (this.correct / this.total) * 100;
      },
      incorrectWidth() {
        return (this.incorrect / this.total) * 100;
      }
    }
  }
  </script>
  
  <style scoped>
  .progress-bar {
    width: 60%;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    margin-top: 10px; 
    margin: 10px;
  }
  .progress-bar-inner {
    height: 100%;
    position: absolute;
    top: 0;
  }
  .progress-bar-inner.correct {
    background-color: lightgreen;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .progress-bar-inner.incorrect {
    background-color: lightcoral;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  </style>
  
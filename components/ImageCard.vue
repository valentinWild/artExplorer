<template>
    <div class="image-card">
      <img :src="image.src" :alt="image.title" class="image"/>
      <p>{{ image.title }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      image: Object
    }
  }
  </script>
  
  <style scoped>
  .image-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
  }
  
  .image {
    width: 100px;
    height: 100px;
  }
  </style>
  
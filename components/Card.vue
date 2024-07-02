<template>
    <div class="card">
      <img :src="imageSrc" alt="Painting">
      <div class="card-text">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: { 
      imageSrc: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .card {
    background-color: #1a1c28; 
    color: #ffffff; 
    width: 310px;
    overflow: hidden;
    border-radius: 2%;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 35px;
    margin-right: 20px;
    cursor: pointer;
  }
  
  .card img {
    width: 100%;
    height: 190px;
    margin: 0;
  }
  
  .card .card-text {
    padding: 5px 5px;
  }
  
  .card .card-text h2 {
    font-weight: bold;
  }
  
  .card .card-text p {
    font-size: 14px;
    color: #666666;
  }
  </style>
  
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
    background-color: #1e1e2d;
    color: #ffffff; 
    width: 310px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
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
    color: #a8a8a8;
  }

  .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

  </style>
  
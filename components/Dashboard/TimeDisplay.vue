<template>
    <div>{{ currentTime }}</div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentTime: new Date().toLocaleTimeString()
      };
    },
    mounted() {
      this.updateTime();
      setInterval(this.updateTime, 1000);
    },
    methods: {
      updateTime() {
        this.currentTime = new Date().toLocaleTimeString();
      }
    }
  };
  </script>
  
  <style scoped>
  div {
    font-size: 3em;
    font-weight: bold;
    color: white;
  }
  </style>
  
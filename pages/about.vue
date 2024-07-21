<template>
    <section class="about-us">
      <div class="container">
        <h1 class="text-5xl text-cyan-300 font-extrabold tracking-normal font-sans">Meet The Team</h1>
        <p class="font-semibold font-sans text-xl text-stone-100 mb-4">
          Discover art history and learn with us!
        </p>
  
        <div class="team">
          <div class="team-member" v-for="member in teamMembers" :key="member.name">
            <div class="team-member-card">
              <img :src="member.image" :alt="member.name" class="team-member-image">
              <div class="team-member-info">
                <h2 class="team-member-name">{{ member.name }}</h2>
                <p class="team-member-role">{{ member.role }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="about-text">
        <p class="font-normal font-sans text-lg text-stone-100 mt-8">
          We are a group of students working together on a learning platform for art history as part of the E-Assessment & Learning Analytics course. We hope you enjoy exploring the wonderful world of art history with our platform.
        </p>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        teamMembers: [
          {
            name: 'Valentin Wild',
            role: 'LMU Munich',
            image: '/pictures/Valentin.jpg'
          },
          {
            name: 'Petra Laboda',
            role: 'LMU Munich',
            image: '/pictures/Petra.jpg'
          },
          {
            name: 'Annika Voss',
            role: 'LMU Munich',
            image: '/pictures/Annika.jpg'
          },
          {
            name: 'Til Eustachi',
            role: 'LMU Munich',
            image: '/pictures/Til.png'
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  body {
    background-color: #121421;
    font-family: 'Inter', sans-serif;
    margin: 0;
  }
  
  html, body {
    height: 100%;
  }
  
  .about-us {
    min-height: 100vh;
    text-align: center;
    padding: 3rem 2rem; /* Adjust padding to start content higher */
    background-color: #121421;
    color: #fff;
    background-image: url('/pictures/Background.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    text-align: center;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.283);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  .text-5xl {
    margin-bottom: 1rem;
    animation: fadeInDown 1s ease-in-out;
  }
  
  .font-semibold {
    margin-bottom: 2rem;
    animation: fadeInUp 1s ease-in-out;
  }
  
  .team {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }
  
  .team-member {
    background: rgba(255, 255, 255, 0.09);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 2rem;
    text-align: center;
    width: 250px; /* Keep the width consistent */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .team-member:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  .team-member-card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .team-member-image {
    width: 100%; /* Increase the size of the images */
    height: 100%;
    border-radius: 50%;
    margin-bottom: 1rem;
    border: 3px solid #67E8F9;
    transition: transform 0.3s ease;
  }
  
  .team-member:hover .team-member-image {
    transform: scale(1.1);
  }
  
  .team-member-info {
    margin-top: 1rem;
  }
  
  .team-member-name {
    font-size: 1.5rem;
    color: #ffffff;
  }
  
  .team-member-role {
    font-size: 1rem;
    color: #67E8F9;
  }

  .about-text {
  max-width: 800px;
  padding-top: 10px;
  margin: 0 auto;


}
  
  .font-normal {
    margin-top: 2rem;
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  
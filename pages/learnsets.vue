  <template>
    <body>
      <div>
        <div class="container">
          <header>
            <h1>Learning Sets</h1>
            <input v-model="searchQuery" type="text" placeholder="Search ..." />
          </header>
          <div class="options-container">
            <Card
              v-for="item in filteredCardItems"
              :key="item.id"
              :image-src="item.imageSrc"
              :title="item.title"
              :description="item.description"
              @click="openQuiz(item.title)"
            />
          </div>
        </div>
      </div>
    </body>
  </template>

  <script>
  import Card from '~/components/Card.vue';

  export default {
    components: {
      Card
    },
    data() {
      return {
        searchQuery: '',
        cardItems: [
          {
            id: 1,
            imageSrc: 'https://www.artic.edu/iiif/2/381b2912-9769-1e17-8145-0016368f0cc4/full/1686,/0/default.jpg',
            title: 'Renaissance',
            description: '10 questions'
          },
          {
            id: 2,
            imageSrc: 'https://www.artic.edu/iiif/2/a38e2828-ec6f-ece1-a30f-70243449197b/full/1686,/0/default.jpg',
            title: 'Impressionism',
            description: '10 questions'
          },
          {
            id: 3,
            imageSrc: 'https://www.artic.edu/iiif/2/92da7102-0562-f4da-55f9-1d29828b20d7/full/843,/0/default.jpg',
            title: 'Modernism',
            description: '10 questions'
          },
          {
            id: 4,
            imageSrc: 'https://www.artic.edu/iiif/2/2843f22e-8ef1-2cd5-b53e-6712cd664e9a/full/843,/0/default.jpg',
            title: 'Surrealism',
            description: '10 questions'
          },
          {
            id: 5,
            imageSrc: 'https://www.artic.edu/iiif/2/249173c2-0013-4624-211c-3e8fcf335048/full/843,/0/default.jpg',
            title: 'Pop Art',
            description: '10 questions'
          },
          {
            id: 6,
            imageSrc: 'https://www.artic.edu/iiif/2/a52c0c03-9668-ae2b-d780-dc928a9d16c1/full/843,/0/default.jpg',
            title: '21st Century',
            description: '10 questions'
          }
        ]
      };
    },
    computed: {
      filteredCardItems() {
        if (!this.searchQuery) {
          return this.cardItems;
        }
        const query = this.searchQuery.toLowerCase();
        return this.cardItems.filter(item => item.title.toLowerCase().includes(query));
      }
    }
  };
  </script>

<script setup>

const router = useRouter();
const quizPath = '/quiz';

const openQuiz = (styleTitle) => {
  const params = {style_category: styleTitle}
  navigateTo({ path: quizPath, query: params });
}



</script>

  <style scoped>
  body {
    background-color: #121421;
    color: #ffffff; 
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  header {
    background-color: #121421;
    margin-bottom: 10px;
    margin-top: 30px;
    display: flex;
    align-items: center;
  }

  header h1 {
    font-size: x-large;
    font-weight: bold;
    margin-right: 20px;
  }

  header input {
    border: none;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 10px;
    border-radius: 5px;
    color: #ffffff;
    width: 200px;
    transition: background-color 0.3s ease;
  }

  header input::placeholder {
    color: #ccc;
  }

  header input:focus {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .options-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 40px;
    justify-content: center;
  }

  </style>
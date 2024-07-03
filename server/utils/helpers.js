// Function to shuffle an array
const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

const getRandomItems = (items, amount) => {
    const randomItems = [];
    const totalItems = items.length;
  
    // Generate random indices
    const randomIndices = [];
    while (randomIndices.length < amount) {
      const randomIndex = Math.floor(Math.random() * totalItems);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
  
    // Get random artworks
    randomIndices.forEach(index => {
      randomItems.push(items[index]);
    });
  
    return randomItems;
  };


export default {
    shuffleArray,
    getRandomItems,
}

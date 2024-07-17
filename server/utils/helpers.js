// Function to shuffle an array
const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

const getRandomItemsOld = (items, amount) => {
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

const getRandomItems = (array, numItems) => {
  // Check if numItems is valid
  if (numItems < 0 || numItems > array.length) {
      throw new RangeError("numItems must be between 0 and the length of the array");
  }

  // Create a copy of the array to avoid modifying the original array
  const arrCopy = array.slice();

  // Fisher-Yates shuffle
  for (let i = arrCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
  }

  // Return the first numItems elements from the shuffled array
  return arrCopy.slice(0, numItems);
}

const getRandomIndices = (words, num, minWordLength) => {
  const indices = [];
  while (indices.length < num) {
    const index = Math.floor(Math.random() * words.length);
    if (!indices.includes(index) && words[index].length > minWordLength && !words[index].includes('<')) {
      indices.push(index);
    }
  }
  return indices.sort((a, b) => a - b);
};




export default {
  getRandomIndices,
    shuffleArray,
    getRandomItems,
}



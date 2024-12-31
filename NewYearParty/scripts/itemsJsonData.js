// JSON list with categories

const originalJsonData = {
    "logo": [
        "Amazon.png",
        "Apple.png",
        "McDonalds.png",
        "MrBeast.png" 
    ],
    "kitchenObject": [
        "Fork.png",
        "Spoon.png",
        "Blender.png",
        "Napkin.png",
        "Glass.png",
        "RollingPin.png",
        "Knife.png",
        "Spatula.png",
        "Shredder.png",
        "Pan.png",
        "HandBlender.png"
    ],
    "animals": [
        "Cat.png",
        "Cheetah.png",
        "Chimpanzee.png",
        "Donkey.png",
        "Fox.png",
        "Hippopotamus.png",
        "Koala.png",
        "Lama.png",
        "Penguin.png",
        "PolarBear.png",
        "Rabbit.png",
        "Rhinoceros.png",
        "Sheep.png",
        "Tiger.png",
        "Zebra.png",
        "pig.png"
    ],
    "movieNameFromHerosPic": [
        "Lion.png"
    ],
    "movieNameFromPoster": [
        "Lion.png"
    ],
    "seeds": [
        "Lion.png"
    ]

};


function shuffleObjectArrays(obj) {
    const shuffledObj = {};
  
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        shuffledObj[key] = [...obj[key]].sort(() => 0.5 - Math.random()); 
      } else {
        shuffledObj[key] = obj[key]; // Keep non-array values as they are
      }
    }
  
    return shuffledObj;
  }
  
  function shuffleJsonDataObject() {
    jsonData = shuffleObjectArrays(originalJsonData)  
  }

  shuffleJsonDataObject();
// JSON list with categories


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
export const compareWords = (text: string, searchText: string) => {
  const wordsInText = text.split(' ');

  if (searchText.indexOf(' ') < 1) {
    for (let i = 0; i < wordsInText.length; i++) {
      if (
        wordsInText[i].slice(0, searchText.length).toLowerCase() ===
        searchText.toLowerCase()
      ) {
        return true;
      }
    }
  } else {
    //split text in search to words
    const wordsInSearchText = searchText.split(' ');
    for (let i = 0; i < wordsInText.length; i++) {
      for (let j = 0; j < wordsInSearchText.length; j++) {
        if (
          wordsInText[i].slice(0, wordsInSearchText[j].length).toLowerCase() ===
            wordsInSearchText[j].toLowerCase() &&
          wordsInSearchText[j].length > 1
        ) {
          return true;
        }
      }
    }
  }
};

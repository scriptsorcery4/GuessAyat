function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fetchData() {
  const randomAyahNumber = getRandomNumber(1, 114);
  const apiUrl = `https://quranenc.com/api/v1/translation/sura/bosnian_rwwad/${randomAyahNumber}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network error: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      
      const ranAyah = getRandomNumber(0, data.result.length-1);
      
      let idd = 0
      if(randomAyahNumber === 1){
         idd = data.result[ranAyah].id
      }else{
        idd = parseInt(data.result[ranAyah].id) ;
      }
      
      const api = `https://api.alquran.cloud/v1/ayah/${idd}/editions/ar.alafasy,en.asad`;
      
      fetch(api)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network error: ' + response.statusText);
          }
          return response.json();
        })
        .then(d => {
         
          let ar = document.querySelector('#ayat_ar');
          let en = document.querySelector('#ayat_en');
          let surahDataInput = document.querySelector('#cor');
          let ns = randomAyahNumber;
          let na = ranAyah+1;
          let n = d.data[0].surah.englishName;
          let combinedData = `${ns},${na},${n}`;
          surahDataInput.value = combinedData;
          const audioSource = document.querySelector('#audio-source');
          audioSource.src = d.data[0].audio;
          let ar_c = document.querySelector('#loading_ar');
          let en_c = document.querySelector('#loading_en');
          ar_c.remove();
          en_c.remove();
          ar.innerHTML = d.data[0].text;
          en.innerHTML = data.result[ranAyah].translation;

        })
        .catch(error => {
          console.error('Error', error);
        });
    })
    .catch(error => {
      console.error('Error', error);
    });
}

fetchData();

function checkData(event) {
  event.preventDefault();  

  let corInput = document.querySelector('#cor').value;
  let numSurahInput = document.querySelector('#numsurah').value;
  let numAyatInput = document.querySelector('#numayat').value;

  let corData = corInput.split(',');
  let nsInput = parseInt(corData[0]);
  let naInput = parseInt(corData[1]);
  let nInput = corData[2];

  handleOpen();
  let con = document.querySelector('.content');

  if (nsInput === parseInt(numSurahInput) && naInput === parseInt(numAyatInput)) {
    con.innerHTML = `
      <div class="emoji">✅</div>
      <div class="mess">
        <h3>Mashallah, brother! You guessed correctly!</h3>
        <p>It is surah ${nsInput} (${nInput}) and ayat ${naInput}</p>
      </div>
      <div class="CTA">
        <a href="/app.html" class="fill-btn">TRY AGAIN</a>
        <a href="/" class="outline-btn">BACK TO HOME</a>
      </div>`;
  } else {
    con.innerHTML = `
      <div class="emoji">❌</div>
      <div class="mess">
        <h3>Incorrect, try again. Inshallah, you will get it next time.</h3>
        <p>It is surah ${nsInput} (${nInput}) and ayat ${naInput}</p>
      </div>
      <div class="CTA">
        <a href="/app.html" class="fill-btn">TRY AGAIN</a>
        <a href="/" class="outline-btn">BACK TO HOME</a>
      </div>`;
  }
}

document.querySelector('form').addEventListener('submit', checkData);

function handleExit() {
  let modal = document.querySelector('.modal');
  modal.style.display = 'none';
}

function handleOpen() {
  let modal = document.querySelector('.modal');
  modal.style.display = 'flex';
}

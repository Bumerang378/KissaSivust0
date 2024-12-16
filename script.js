const apiKey = 'live_ONS8GVpT0mPPNw86KkddjgIe2MspGJI6dCiGLeyKuHY2JWLJN6iTetoeRpavs47s'; 
const gallery = document.getElementById('cat-gallery');
const favoritesGallery = document.getElementById('favorites-gallery');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Hae useita kissakuvia API-avaimella
function fetchCatImages(count = 5) {
  fetch(`https://api.thecatapi.com/v1/images/search?limit=${count}`, {
    headers: {
      'x-api-key': apiKey
    }
  })
    .then(response => response.json())
    .then(data => {
      gallery.innerHTML = '';
      data.forEach(cat => {
        const img = document.createElement('img');
        img.src = cat.url;
        img.alt = 'Ihana kissa 🐱';
        img.title = `ID: ${cat.id}`;
        img.dataset.url = cat.url;
        img.dataset.id = cat.id;
        img.onclick = () => saveToFavorites(cat);
        gallery.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Virhe kissakuvien hakemisessa:', error);
      alert('Kissakuvien lataaminen epäonnistui. Yritä uudelleen!');
    });
}

// Tallenna suosikkeihin ja päivitä suosikkigalleria
function saveToFavorites(cat) {
  if (!favorites.find(fav => fav.id === cat.id)) {
    favorites.push(cat);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Kissa lisätty suosikkeihin! ❤️');
    updateFavoritesGallery();  // Päivitä suosikkigalleria heti
  } else {
    alert('Tämä kissa on jo suosikeissasi! 😸');
  }
}

// Päivitä suosikkigalleria
function updateFavoritesGallery() {
  favoritesGallery.innerHTML = ''; // Tyhjennä suosikkigalleria
  if (favorites.length === 0) {
    favoritesGallery.innerHTML = '<p>Ei suosikkikissoja vielä. 🐾</p>';
  } else {
    // Lisää suosikit uusimmasta alkaen
    favorites.slice().reverse().forEach(cat => {
      const img = document.createElement('img');
      img.src = cat.url;
      img.alt = 'Suosikki kissa ❤️';
      img.title = `ID: ${cat.id}`;
      img.dataset.url = cat.url;
      img.dataset.id = cat.id;
      favoritesGallery.appendChild(img);
    });
  }
}

// Poista kaikki suosikit
function clearFavorites() {
    if (confirm('Haluatko varmasti poistaa kaikki suosikit?')) {
      favorites = [];
      localStorage.removeItem('favorites');
      favoritesGallery.innerHTML = '<p>Ei suosikkikissoja vielä. 🐾</p>';
      alert('Kaikki suosikit on poistettu.');
    }
}
  
// Lisää tapahtumakuuntelija "Poista suosikit" -napille
document.getElementById('clear-favorites').addEventListener('click', clearFavorites);
// Tapahtumakuuntelijat
document.getElementById('new-cat').addEventListener('click', () => fetchCatImages());
document.getElementById('show-favorites').addEventListener('click', updateFavoritesGallery);

// Alkuperäinen haku
fetchCatImages();

// Päivitä suosikkigalleria aluksi (näyttää olemassa olevat suosikit)
updateFavoritesGallery();
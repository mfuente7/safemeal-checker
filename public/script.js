const foodInput = document.getElementById('foodInput');
const barcodeInput = document.getElementById('barcodeInput');
const searchBtn = document.getElementById('searchBtn');
const barcodeBtn = document.getElementById('barcodeBtn');
const loadFavoritesBtn = document.getElementById('loadFavoritesBtn');

const results = document.getElementById('results');
const message = document.getElementById('message');
const favorites = document.getElementById('favorites');

let chart;

const swiper = new Swiper('.swiper', {
  slidesPerView: 2,
  spaceBetween: 15,
  loop: true
});

searchBtn.addEventListener('click', async () => {
  const food = foodInput.value.trim();

  if (food === '') {
    message.innerHTML = '<p>Please type in a food first.</p>';
    return;
  }

  message.innerHTML = '<p>Loading food results...</p>';
  results.innerHTML = '';

  const response = await fetch(`/api/search?food=${food}`);
  const data = await response.json();

  showProducts(data);
});

barcodeBtn.addEventListener('click', async () => {
  const barcode = barcodeInput.value.trim();

  if (barcode === '') {
    message.innerHTML = '<p>Please enter a barcode first.</p>';
    return;
  }

  message.innerHTML = '<p>Searching barcode...</p>';
  results.innerHTML = '';

  const response = await fetch(`/api/barcode/${barcode}`);
  const data = await response.json();

  if (data.message) {
    message.innerHTML = `<p>${data.message}</p>`;
    return;
  }

  showProducts([data]);
});

loadFavoritesBtn.addEventListener('click', async () => {
  favorites.innerHTML = '<p>Loading favorites...</p>';

  const response = await fetch('/api/favorites');
  const data = await response.json();

  favorites.innerHTML = '';

  if (!data || data.length === 0) {
    favorites.innerHTML = '<p>No favorites saved yet.</p>';
    return;
  }

  data.forEach((item) => {
    const favoriteCard = document.createElement('div');
    favoriteCard.className = 'favorite-card';

    favoriteCard.innerHTML = `
      <h3>${item.product_name}</h3>
      <p>${item.brand}</p>
      <p>Grade: ${item.grade || 'N/A'}</p>
    `;

    favorites.appendChild(favoriteCard);
  });
});

function showProducts(products) {
  results.innerHTML = '';
  message.innerHTML = '';

  if (!products || products.length === 0) {
    message.innerHTML = '<p>No products were found.</p>';
    return;
  }

  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'food-card';

    const warning = getWarning(product.allergens);

    card.innerHTML = `
      <img src="${product.image}" alt="food product">
      <h3>${product.name}</h3>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Nutrition Grade:</strong> ${product.grade}</p>
      <p><strong>Allergens:</strong> ${product.allergens}</p>
      <p><strong>Ingredients:</strong> ${product.ingredients}</p>
      <p class="${warning.className}">${warning.text}</p>
      <button class="save-btn">Save Favorite</button>
    `;

    const saveBtn = card.querySelector('.save-btn');

    saveBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      saveFavorite(product);
    });

    card.addEventListener('click', () => {
      makeChart(product);
    });

    results.appendChild(card);
  });
}

function getWarning(allergens) {
  const allergyText = String(allergens).toLowerCase();

  if (
    allergyText.includes('milk') ||
    allergyText.includes('nuts') ||
    allergyText.includes('peanuts') ||
    allergyText.includes('gluten') ||
    allergyText.includes('soy')
  ) {
    return {
      text: 'Warning: This product may contain a common allergen.',
      className: 'bad-warning'
    };
  }

  return {
    text: 'No major allergen warning found from the listed data.',
    className: 'good-warning'
  };
}

async function saveFavorite(product) {
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: product.name,
      brand: product.brand,
      image: product.image,
      grade: product.grade
    })
  });

  if (response.ok) {
    alert('Product saved to favorites.');
  } else {
    alert('Favorite could not be saved.');
  }
}

function makeChart(product) {
  const chartSpot = document.getElementById('foodChart');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartSpot, {
    type: 'bar',
    data: {
      labels: ['Sugar', 'Fat', 'Protein'],
      datasets: [
        {
          label: product.name,
          data: [
            Number(product.sugar) || 0,
            Number(product.fat) || 0,
            Number(product.protein) || 0
          ]
        }
      ]
    }
  });
}
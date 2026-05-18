const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

const app = express();
const port = 3000;

dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url_here') {
  supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);
}
app.get('/api/search', async (req, res) => {
  const food = req.query.food;

  if (!food) {
    return res.status(400).json({ message: 'Please enter a food name.' });
  }

  try {
    const foodUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${food}&search_simple=1&action=process&json=1`;

    const response = await fetch(foodUrl);
    const data = await response.json();

    const products = data.products.slice(0, 10).map((item) => {
      return {
        name: item.product_name || 'Name not listed',
        brand: item.brands || 'Brand not listed',
        image: item.image_front_url || '',
        grade: item.nutrition_grades || 'N/A',
        allergens: item.allergens || 'No allergens listed',
        ingredients: item.ingredients_text || 'Ingredients not listed',
        sugar: item.nutriments?.sugars || 0,
        fat: item.nutriments?.fat || 0,
        protein: item.nutriments?.proteins || 0
      };
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Food search did not work.' });
  }
});

app.get('/api/barcode/:code', async (req, res) => {
  const barcode = req.params.code;

  try {
    const barcodeUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}`;

    const response = await fetch(barcodeUrl);
    const data = await response.json();

    if (!data.product) {
      return res.status(404).json({ message: 'Product was not found.' });
    }

    const product = data.product;

    res.json({
      name: product.product_name || 'Name not listed',
      brand: product.brands || 'Brand not listed',
      image: product.image_front_url || '',
      grade: product.nutrition_grades || 'N/A',
      allergens: product.allergens || 'No allergens listed',
      ingredients: product.ingredients_text || 'Ingredients not listed',
      sugar: product.nutriments?.sugars || 0,
      fat: product.nutriments?.fat || 0,
      protein: product.nutriments?.proteins || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Barcode search did not work.' });
  }
});

app.post('/api/favorites', async (req, res) => {
  const { name, brand, image, grade } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Missing product name.' });
  }

  const { data, error } = await supabase
    .from('favorites')
    .insert([
      {
        id: Date.now().toString(),
        product_name: name,
        brand: brand || 'Brand not listed',
        image: image || '',
        grade: grade || 'N/A'
      }
    ])
    .select();

  if (error) {
    return res.status(500).json({ message: 'Favorite could not be saved.' });
  }

  res.json(data);
});

app.get('/api/favorites', async (req, res) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*');

  if (error) {
    return res.status(500).json({ message: 'Favorites could not be loaded.' });
  }

  res.json(data);
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
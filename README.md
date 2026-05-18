# SafeMeal Checker

## About The Project

SafeMeal Checker is a website that helps users search food products and quickly view information like ingredients, allergens, nutrition grades, and nutrition facts. Users can search by food name or barcode.

The project uses the Open Food Facts API to get food product information and Supabase to save favorite foods. The project was created for INST377 using HTML, CSS, JavaScript, Node.js, and Express.

## Browser Tested

The project was mainly tested using Google Chrome.

## Developer Manual

This project uses a Node.js backend with Express and a frontend built using HTML, CSS, and JavaScript.

Main technologies used:

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Supabase
- Open Food Facts API
- Chart.js
- Swiper.js

## Project Structure

The public folder contains all frontend files including index.html, about.html, help.html, style.css, and script.js.

The index.js file handles the backend routes and API requests.

Other files used in the project include package.json, vercel.json, README.md, and the .env file for Supabase keys.

## Running The Project

First install the dependencies by running npm install in the terminal.

After that, start the server using npm start.

The project should then open on localhost port 3000.

## API Routes

The project uses these routes:

- /api/search
- /api/barcode/:code
- /api/favorites

The project uses GET and POST requests to retrieve and save data.

## Tests

I tested the project by running it locally and making sure food searches, barcode searches, favorite saving, and favorite loading all worked correctly.

## Libraries Used

- Chart.js
- Swiper.js

Chart.js was used to display nutrition information in chart form. Swiper.js was used for the featured food slider on the homepage.

## Database

This project uses Supabase to save favorite food products.

The table used is called favorites.

## Known Issues

Some products may not have complete information because the data depends on what is available in Open Food Facts. Some barcode searches may also not return a result.

## Future Improvements

Some future improvements for the project could include:

- Barcode scanner using a phone camera
- Better allergy filters
- User login system
- Dark mode
- Personalized recommendations

## Deployment

The project was uploaded to GitHub and deployed using Vercel.

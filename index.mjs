import express from 'express';
import path from 'path';
import axios from 'axios';
import { generate } from 'random-words';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const WEATHER_API_KEY = '9781c925582048856028452a6cf07219';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper function using node package
function makeTripCode() {
  return generate({ exactly: 3, join: '-' });
}

// Route 1: Home
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Travel Explorer',
    tripCode: makeTripCode()
  });
});

// Route 2: Country form page
app.get('/country', (req, res) => {
  res.render('country-form', {
    title: 'Find a Country',
    tripCode: makeTripCode()
  });
});

// Route 3: Country result page (uses user input + Web API on server)
app.post('/country', async (req, res) => {
  const countryName = req.body.countryName;

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
    const country = response.data[0];

    res.render('country-result', {
      title: 'Country Results',
      country,
      tripCode: makeTripCode()
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      message: 'Sorry, country information could not be found.'
    });
  }
});

// Route 4: Weather form page
app.get('/weather', (req, res) => {
  res.render('weather-form', {
    title: 'Check Weather',
    tripCode: makeTripCode()
  });
});

// Route 5: Weather result page (uses user input + Web API on server)
app.post('/weather', async (req, res) => {
  const city = req.body.city;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=imperial`;
    const response = await axios.get(url);
    const weather = response.data;

    let weatherImage = '/images/mild.png';

    if (weather.main.temp < 45) {
      weatherImage = 'https://images.unsplash.com/photo-1511131341194-24e2eeeebb09?auto=format&fit=crop&w=900&q=80';
    } else if (weather.main.temp > 80) {
      weatherImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80';
    } else {
      weatherImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80';
    }

    res.render('weather-result', {
      title: 'Weather Results',
      weather,
      weatherImage,
      tripCode: makeTripCode()
    });
  } catch (error) {
    res.render('error', {
      title: 'Error',
      message: 'Sorry, weather data could not be retrieved. Check the city name and API key.'
    });
  }
});

// Route 6: Travel ideas page
app.get('/ideas', (req, res) => {
  const ideas = [
    'Visit a local museum in a nearby town.',
    'Plan a one-day beach trip.',
    'Try food from a country you want to visit.',
    'Create a packing checklist for a future trip.',
    'Take photos of landmarks in your city.'
  ];

  res.render('ideas', {
    title: 'Travel Ideas',
    ideas,
    tripCode: makeTripCode()
  });
});

// Route 7: About page
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About This App',
    tripCode: makeTripCode()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
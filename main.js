const form = document.getElementById('runForm');
const runList = document.getElementById('runList');
const weatherBox = document.getElementById('weatherInfo');
const apiKey = "ab63bd2638cb30de5bd2d8a1cf8d372b"; // Replace with your actual API key

// Load runs from localStorage on page load
window.onload = () => {
  const savedRuns = JSON.parse(localStorage.getItem('runTrackerData')) || [];
  savedRuns.forEach(renderRun);
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const distance = document.getElementById('distance').value;
  const duration = document.getElementById('duration').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const location = document.getElementById('location').value;

  const datetime = new Date(`${date}T${time}`);
  const timestamp = Math.floor(datetime.getTime() / 1000);

  try {
    const coords = await getCoordinates(location);
    const weather = await getWeather(coords.lat, coords.lon, timestamp);

    const runData = {
      distance,
      duration,
      date,
      time,
      location,
      weather: {
        temp: weather.temp,
        conditions: weather.description
      }
    };

    saveRun(runData);
    renderRun(runData);
    showWeather(weather);
    form.reset();
  } catch (err) {
    alert('Error fetching weather or location. Please check your input.');
    console.error(err);
  }
});

function saveRun(run) {
  const runs = JSON.parse(localStorage.getItem('runTrackerData')) || [];
  runs.unshift(run);
  localStorage.setItem('runTrackerData', JSON.stringify(runs));
}

function renderRun(run) {
  const card = document.createElement('div');
  card.className = 'run-card';

  card.innerHTML = `
    <h3>${run.date} – ${run.distance} mi</h3>
    <p>Duration: ${run.duration}</p>
    <p>Location: ${run.location}</p>
    <p>Weather: ${run.weather.temp}°F, ${run.weather.conditions}</p>
  `;

  runList.prepend(card);
}

function showWeather(weather) {
  weatherBox.style.display = 'block';
  weatherBox.textContent = `Fetched weather: ${weather.temp}°F, ${weather.description}`;
}

async function getCoordinates(location) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`
  );
  const data = await response.json();
  if (!data.length) throw new Error('Location not found.');
  return { lat: data[0].lat, lon: data[0].lon };
}

async function getWeather(lat, lon, timestamp) {
  const response = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&units=imperial&appid=${apiKey}`
  );
  const data = await response.json();
  if (!data.data || !data.data.length) throw new Error('No weather data found.');
  const weather = data.data[0].weather[0];
  return {
    temp: data.data[0].temp,
    description: weather.description
  };
}

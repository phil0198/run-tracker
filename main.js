const form = document.getElementById('runForm');
const runList = document.getElementById('runList');
const weatherBox = document.getElementById('weatherInfo');

// Load runs from localStorage on page load
window.onload = () => {
  const savedRuns = JSON.parse(localStorage.getItem('runTrackerData')) || [];
  savedRuns.forEach(renderRun);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log("Form submitted");

  const distance = document.getElementById('distance').value;
  const duration = document.getElementById('duration').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const location = document.getElementById('location').value;
  const manualTemp = document.getElementById('manualTemp').value;
  const manualConditions = document.getElementById('manualConditions').value;

  if (!date || !time || !location) {
    alert("Please fill out the date, time, and location fields.");
    return;
  }

  const weather = manualTemp && manualConditions
    ? { temp: manualTemp, conditions: manualConditions }
    : getEstimatedWeather(getSeason(new Date(date).getMonth()));

  const runData = {
    distance,
    duration,
    date,
    time,
    location,
    weather
  };

  saveRun(runData);
  renderRun(runData);
  showWeather(runData.weather);
  form.reset();
});

function getSeason(month) {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

function getEstimatedWeather(season) {
  const weatherOptions = {
    spring: { temp: '55°F', conditions: 'Partly cloudy' },
    summer: { temp: '75°F', conditions: 'Sunny' },
    fall: { temp: '60°F', conditions: 'Overcast' },
    winter: { temp: '35°F', conditions: 'Snowy' }
  };
  return weatherOptions[season];
}

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
    <p>Weather: ${run.weather.temp}, ${run.weather.conditions}</p>
  `;

  runList.prepend(card);
}

function showWeather(weather) {
  weatherBox.style.display = 'block';
  weatherBox.textContent = `Weather: ${weather.temp}, ${weather.conditions}`;
}  

/**
 * getWeather
 * @param loc object || ""; data from https://geoip.nekudo.com/api/
 *
 * https://www.weatherbit.io/api
 * Get current weather object from weatherbit.io
 */
const getWeather = function(loc = "") {
  if(loc == "") return;
  const openweatherPromise = fetch(`https://api.weatherbit.io/v1.0/current?lat=${loc.location.latitude}&lon=${loc.location.longitude}&key=be54add8ecae4d75bab3b5aefe065fb1`);
  openweatherPromise
    .then((data) => data.json())
    // .then((data) => console.log(data))
    .then((data) => render(data))
    .catch((err) => console.log(err));
}

/**
 * https://geoip.nekudo.com/api/
 * Get geo ip info object from geoip.nekudo.com
 */
const ipPromise = fetch('https://geoip.nekudo.com/api/');
ipPromise
  .then((data) => data.json())
  // .then((data) => console.log(data))
  // .then((data) => getWeather(data))
  .catch((err) => console.error(err));
// Unfortunately all free ip lookup api’s that provide geo information currently do not support ssl. let's set a default lat. lng.
getWeather({
  'location': {
    'latitude': 42.346425,
    'longitude': -71.097625,
  }
});


/**
 * findIcon
 * @param weatherCode Number
 * 
 * https://www.weatherbit.io/api/codes
 */
const findIcon = function(weatherCode) {
  switch(Number(weatherCode)) {
    case 800: return 'clear-sky';
    case 801: return 'few-clouds';
    case 802: return 'scattered-clouds';
    case 803: case 804: return 'broken-clouds';
    case 900: case 300: case 301: case 302: return 'shower-rain';
    case 500: case 501: case 502: case 511: case 520: case 521: case 522: return 'rain';
    case 200: case 201: case 202: case 230: case 231: case 232: case 233: return 'thunderstorm';
    case 600: case 601: case 602: case 610: case 611: 
    case 612: case 621: case 622: case 623: return 'snow';
    case 700: case 711: case 721: case 731: case 741: case 751: return 'mist';
    default: return 'clear-sky';
  }
}

/**
 * dayOrNight
 *
 * add a class to #wrapper base on the current time
 * to show a dark/night or a light/day theme
 */
const dayOrNight = function() {
  const currentHour = new Date().getHours();
  const wrapper = document.querySelector('#wrapper');
  wrapper.classList = (currentHour < 6 || currentHour >= 18) ? 'night' : 'day';  
}

/**
 * render 
 * @param weather object
 *
 * print values in the dom.
 */
const render = function(weather) {
  const location = document.querySelector('#location');
  location.textContent = `${weather.data[0].city_name}, ${weather.data[0].country_code}`;
  
  const ow = document.querySelector(`#${findIcon(weather.data[0].weather.code)}`);
  ow.style.display = `block`;
  
  const temperture = Array.from(document.querySelectorAll('#temp .value'))[0];
  temperture.textContent = `${Math.round(weather.data[0].temp)}`;
  
  const description = Array.from(document.querySelectorAll('#desc .value'))[0];
  console.log([description]);
  description.innerHTML = `${weather.data[0].weather.description}`;
  description.innerHTML += ` <br><small>Unfortunately all free ip lookup api’s that provide geo information currently do not support ssl therefor your location can not be determined</small>`;
  
  const theme = dayOrNight();
}

/**
 * tempUnitToggle
 *
 * Get the current temperture from the dom and calculate the
 * value for Celsius or Farenheit
 */
const tempUnitToggle = function() {
  const temperture = Array.from(document.querySelectorAll('#temp .value'))[0];
  const unit = Array.from(document.querySelectorAll('#temp .unit'))[0];
  
  if(temperture.textContent === '__') return;
  
  if(unit.textContent === 'C') {
    unit.textContent = 'F';
    temperture.textContent = `${Math.round( Number(temperture.textContent) * 1.8 + 32 )}`;
  } else {
    unit.textContent = 'C';
    temperture.textContent = `${Math.round( (Number(temperture.textContent) - 32) /  1.8 )}`;
  }
}
const toggle = document.querySelector('#temp').addEventListener('click', tempUnitToggle);

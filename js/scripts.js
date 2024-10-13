const apiKey = "your api key here";

const cityInput = document.querySelector("#city-input");
const cityComponent = document.querySelector("#city");
const tempComponent = document.querySelector("#temp-value");
const descComponent = document.querySelector("#desc");
const countryComponent = document.querySelector("#country");
const humidityComponent = document.querySelector("#humidity span");
const windComponent = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data");
const descIconComponent = document.querySelector("#desc-icon");

const gradients = {};

const updateBackground = (mainWeather, icon) => {
  const body = document.querySelector("body");
  const mainContainer = document.querySelector(".main-container");
  const isDay = icon.endsWith("d"); // Verifica se é dia ('d') ou noite ('n')

  // Define o background padrão (std.svg) caso os parâmetros estejam ausentes ou não carreguem
  if (!mainWeather || !icon) {
    body.style.backgroundImage = 'url("/css/imagens/std.svg")';
    mainContainer.style.backgroundImage =
      "linear-gradient(135deg, #efeb0a66 25%, #e76e04db 100%)";
    body.classList.remove("night-theme");
    return;
  }

  if (mainWeather.toLowerCase() === "clouds") {
    // Se o clima for nublado
    if (isDay) {
      body.style.backgroundImage = 'url("/css/imagens/cloudy-day.svg")';
      mainContainer.style.backgroundImage =
        "linear-gradient(135deg, #efeb0a66 25%, #e76e04db 100%)";
      body.classList.remove("night-theme");
    } else {
      body.style.backgroundImage = 'url("/css/imagens/cloudy-night.svg")';
      mainContainer.style.backgroundImage =
        "linear-gradient(to top, #001122b8 25%, #000f1edb 100%)";
      body.classList.add("night-theme");
    }
  } else {
    // Se o clima for claro
    if (isDay) {
      body.style.backgroundImage = 'url("/css/imagens/clear-day.svg")';
      mainContainer.style.backgroundImage =
        "linear-gradient(135deg, #efeb0a66 25%, #e76e04db 100%)";
      body.classList.remove("night-theme");
    } else {
      body.style.backgroundImage = 'url("/css/imagens/clear-night.svg")';
      mainContainer.style.backgroundImage =
        "linear-gradient(to top, #001122b8 25%, #000f1edb 100%)";
      body.classList.add("night-theme");
    }
  }
};

const checkComponents = () => {
  if (!cityComponent) console.error("Elemento #city não encontrado");
  if (!tempComponent) console.error("Elemento #temp-value span não encontrado");
  if (!descComponent) console.error("Elemento #desc não encontrado");
  if (!descIconComponent) console.error("Elemento #desc-icon não encontrado");
  if (!countryComponent) console.error("Elemento #country não encontrado");
  if (!humidityComponent)
    console.error("Elemento #umidity span não encontrado");
  if (!windComponent) console.error("Elemento #wind span não encontrado");
};

checkComponents();

const fetchData = async (city) => {
  try {
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
    const response = await fetch(weatherApi);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error: ", error);
    alert("Erro ao buscar dados. Verifique a cidade e tente novamente.");
  }
};

const displayData = async (city) => {
  const data = await fetchData(city);

  if (!data || !data.weather) {
    updateBackground(); // Define o fundo padrão caso não haja dados
    return;
  }

  const iconCode = data.weather[0].icon;
  const mainWeather = data.weather[0].main;

  cityComponent.innerText = data.name;
  tempComponent.innerText = parseFloat(data.main.temp.toFixed(1));
  descComponent.innerText = data.weather[0].description;
  humidityComponent.innerText = `${data.main.humidity}%`;
  windComponent.innerText = `${data.wind.speed}km/h`;
  descIconComponent.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconCode}.png`
  );

  updateBackground(mainWeather, iconCode); // Atualiza o fundo com os novos dados

  const components = [
    cityComponent,
    tempComponent,
    descComponent,
    humidityComponent,
    windComponent,
    descIconComponent,
    countryComponent,
  ];

  components.forEach((component) => {
    component.classList.add("animate__animated", "animate__fadeInLeft");
  });

  weatherContainer.classList.remove("hidden");
};

// Função para obter a localização do usuário e exibir dados do clima
const getLocationAndDisplayWeather = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // Converta a latitude e longitude em nome de cidade usando uma API ou serviço adicional
        // Aqui você pode usar uma API de geocodificação reversa, como a do OpenWeatherMap
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt_br`
        )
          .then((response) => response.json())
          .then((data) => {
            const city = data.name;
            displayData(city); // Chama a função existente com a cidade obtida
          })
          .catch((error) => {
            console.error("Erro ao obter dados da localização:", error);
          });
      },
      (error) => {
        console.error("Erro ao obter a localização:", error);
      }
    );
  } else {
    alert("Geolocalização não é suportada pelo seu navegador.");
  }
};

// Solicitar a localização ao carregar a página
window.addEventListener("load", getLocationAndDisplayWeather);

cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    console.log("Enter");
    const city = e.target.value;
    displayData(city);
  }
});

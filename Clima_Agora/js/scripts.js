const apiKey = "";
const apiUnsplash = "https://source.unsplash.com/1600x900/?";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data");
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");
const suggestionsContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Loader

const toggleLoader = () => {
    loader.classList.toggle("hide");
};

// Funções


// Obtendo a bandeira pela sigla do pais
async function getFlagUrlByCode(code){
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    const data = await response.json();
    const flagUrl = data[0].flags.png || null;
    return flagUrl;
}
function removeEspacos(texto) { //Incluindo para retirar os espaços no inicio e no final do texto
    return texto.trim();
}

const getWeatherData = async (city) => {
    var cidade = removeEspacos(city); // incluido para chamar a função de retirar espaço.

    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${apiKey}&lang=pt_br`;

    const res = await fetch(apiWeatherURL);
    const data = await res.json();

    // Novo código incluido obtendo a sigla do pais na API atual e busco ela na outra API.

    var sigla_pais = data.sys.country;
    getFlagUrlByCode(sigla_pais).then(flagUrl => {
        
        const divImg = document.querySelector('#country');
        divImg.innerHTML = '<img src="'+flagUrl+'"alt="Descrição da imagem" style="max-width: 50px; height: auto; margin-left: 6px; margin-top: -10px;">';
    }).catch(error => console.error(error));




    return data;
};

// Tratamento de erro

const showErrorMessage = () => {
    errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
    errorMessageContainer.classList.add("hide");
    weatherContainer.classList.add("hide");

    suggestionsContainer.classList.add("hide");
};




const showWeatherData = async (city) => {
    hideInformation();

    const data = await getWeatherData(city);

    if (data.cod === "404") {
        showErrorMessage();
        return;
    }

    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    weatherIconElement.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed}km/h`;

    // Troca a imagem de fundo.
    document.body.style.backgroundImage = `url("${apiUnsplash + city}")`;

    weatherContainer.classList.remove("hide");

};


// Eventos
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();


    const city = cityInput.value;




    showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        const city = e.target.value;

        showWeatherData(city);
    }



});

// Sugestões

suggestionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const city = btn.getAttribute("id");

        showWeatherData(city);
    });
});

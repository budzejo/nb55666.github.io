"use strict";

document.weatherApp={
    apiKey:"d799c5bb3fda8208a479dcd4ce548bf3",
    init: function () {
        let btn=document.getElementById("getWeatherBtn");
        let input=document.getElementById("cityInput");
        btn.addEventListener("click",() => {
            let city=input.value.trim();
            if (city) {
                this.getCurrentWeather(city);
                this.getForecast(city);
            }
        });
    },
    getCurrentWeather:function (city){
        let url=`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&lang=pl`;
        let req=new XMLHttpRequest();
        req.open("GET",url,true);
        req.addEventListener("load",()=> {
            if (req.status===200){
                let data=JSON.parse(req.responseText);
                console.log("Current Weather Response (XMLHttpRequest):",data);
                this.renderCurrentWeather(data);
            } else {
                console.error("Błąd pobierania bieżącej pogody:",req.status,req.statusText);
                alert("Nie udało się pobrać bieżącej pogody dla podanego miasta.");
            }
        });
        req.send(null);
    },
    getForecast: function (city) {
        let url=`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&lang=pl`;
        fetch(url)
            .then((response)=>{
                if (!response.ok) {
                    throw new Error("Błąd sieci lub niepoprawne miasto");
                }
                return response.json();
            })
            .then((data)=>{
                console.log("Forecast Response (Fetch API):",data);
                this.renderForecast(data);
            })
            .catch((error) => {
                console.error("Błąd pobierania prognozy:",error);
            });
    },
    renderCurrentWeather: function (data) {
        let container=document.getElementById("currentWeatherContainer");
        let date=new Date(data.dt * 1000).toLocaleString("pl-PL");
        let iconUrl=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        container.innerHTML=`
            <div class="currentCard">
                <img src="${iconUrl}" alt="${data.weather[0].description}" class="weatherIcon">
                <div>
                    <div>${date} (${data.name})</div>
                    <div class="temp">${data.main.temp.toFixed(1)} °C</div>
                    <div>Odczuwalna: ${data.main.feels_like.toFixed(1)} °C</div>
                    <div style="text-transform: capitalize;">${data.weather[0].description}</div>
                </div>
            </div>
        `;
    },
    renderForecast: function (data) {
        let container=document.getElementById("forecastContainer");
        container.innerHTML="";
        for (let item of data.list) {
            let card = document.createElement("div");
            card.className = "forecastCard";
            let iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
            card.innerHTML = `
                <div class="date">${item.dt_txt}</div>
                <img src="${iconUrl}" alt="${item.weather[0].description}" class="weatherIcon">
                <div class="temp">${item.main.temp.toFixed(1)} °C</div>
                <div>Odczuwalna: ${item.main.feels_like.toFixed(1)} °C</div>
                <div class="desc">${item.weather[0].description}</div>
            `;
            container.appendChild(card);
        }
    }
};
document.addEventListener("DOMContentLoaded",() => {
    document.weatherApp.init();
});

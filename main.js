async function sendRequest(request)
{
     var requestHeader = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 8d432d87acf6b2a4e36ee21cd41d5821cb1db3133b673e79dd0f6f0b80cca53f' 
    });

     var inputCity = document.getElementById("inputCity");
     inputCity = inputCity.value;
     const response = await fetch(`https://api.meteo-concept.com/api/location/cities?token=8d432d87acf6b2a4e36ee21cd41d5821cb1db3133b673e79dd0f6f0b80cca53f&search=${inputCity}`,
        {
            method: 'GET',
            headers: requestHeader,
            mode:'cors'
        });
}

function createRequest()
{
     var inputCity = document.getElementById("inputCity");
     var inputDate = document.getElementById("inputDate");
     inputCity = inputCity.value;
     inputDate = inputDate.value;
     console.log([inputCity,inputDate]);
     var request = "http://api.meteo-concept.com/api/location/cities?token=8d432d87acf6b2a4e36ee21cd41d5821cb1db3133b673e79dd0f6f0b80cca53f&search="+inputCity;
     console.log(request);
     sendRequest(request);
}

function updateDisplay(temperature,sky,wind)
{
     // Temperature
     var temperatureElement = document.getElementById("temperature").childNodes[1];
     temperatureElement.innerHTML = temperature + "°C";
     if (temperature <= 10)
     {
          document.body.style.backgroundColor = "rgb(51, 204, 255)";
     }
     else if (temperature <= 21)
     {
          document.body.style.backgroundColor = "rgb(255, 204, 102)";
     }
     else
     {
          document.body.style.backgroundColor = "rgb(255, 51, 0)";
     }
     // Sky
     var skyElementImage = document.getElementById("sky").childNodes[1];
     skyElementImage.src = sky + ".png";
     skyElementImage.alt = sky + " icon";
     var skyElementText = document.getElementById("sky").childNodes[3];
     skyElementText.innerHTML = sky;
     // Wind
     var windElementImage = document.getElementById("wind").childNodes[1];
     windElementImage.style.transform = "rotate(70deg)";
     var windElementText = document.getElementById("wind").childNodes[3];
     windElementText.innerHTML = wind +"km/h";
}

updateDisplay(-10,"rain",30)

var searchButton = document.getElementById("search");
searchButton.addEventListener('click',sendRequest);
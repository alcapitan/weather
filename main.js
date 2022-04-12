async function sendRequest(city)
{
     // Header des requêtes
     var requestHeader = new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 8d432d87acf6b2a4e36ee21cd41d5821cb1db3133b673e79dd0f6f0b80cca53f' 
     });
     // Réception villes possibles parmi recherche
     var response = await fetch(`https://api.meteo-concept.com/api/location/cities?token=8d432d87acf6b2a4e36ee21cd41d5821cb1db3133b673e79dd0f6f0b80cca53f&search=${city}`,
     {
          method: 'GET',
          headers: requestHeader,
          mode:'cors'
     });
     var content = await response.json(); // Converti la réponse en JSON
     var insee = content.cities[0]["insee"]; // Révèle l'INSEE de la ville en premier résultat
     // Réception des infos sur la ville
     var responseInsee = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=8d432d87acf6b2a4e36ee21cd41d5821cb1db3133b673e79dd0f6f0b80cca53f&insee=${insee}`,
     {
          method: 'GET',
          headers: requestHeader,
          mode:'cors'
     });
     var contentInsee = await responseInsee.json(); // Converti la réponse en JSON
     var result = {}; // Créé un objet avec toutes les infos nécessaires
     result["codePostal"] = contentInsee.forecast[0]["cp"];
     result["kmwind"] = contentInsee.forecast[0]["wind10m"];
     result["dirwind"] = contentInsee.forecast[0]["dirwind10m"];
     result["weather"] = contentInsee.forecast[0]["weather"];
     result["temperature"] = (contentInsee.forecast[0]["tmin"] + contentInsee.forecast[0]["tmax"]) / 2;
     updateDisplay(result);
}

function createRequest()
{
     var inputCity = document.getElementById("inputCity");
     inputCity = inputCity.value;
     sendRequest(inputCity);
}

function updateDisplay(infos)
{
     // Temperature
     var temperatureElement = document.getElementById("temperature").childNodes[1];
     temperatureElement.innerHTML = infos["temperature"] + "°C";
     if (infos["temperature"] <= 10)
     {
          document.body.style.backgroundColor = "rgb(51, 204, 255)";
     }
     else if (infos["temperature"] <= 21)
     {
          document.body.style.backgroundColor = "rgb(255, 204, 102)";
     }
     else
     {
          document.body.style.backgroundColor = "rgb(255, 51, 0)";
     }
     // Sky
     var skyElementImage = document.getElementById("sky").childNodes[1];
     skyElementImage.src = infos["weather"] + ".png";
     skyElementImage.alt = infos["weather"] + " icon";
     var skyElementText = document.getElementById("sky").childNodes[3];
     skyElementText.innerHTML = infos["weather"];
     // Wind
     var windElementImage = document.getElementById("wind").childNodes[1];
     windElementImage.style.transform = "rotate(" + infos["dirwind"] + "deg)";
     var windElementText = document.getElementById("wind").childNodes[3];
     windElementText.innerHTML = infos["kmwind"] +"km/h";
}

var searchButton = document.getElementById("search");
searchButton.addEventListener('click',createRequest);
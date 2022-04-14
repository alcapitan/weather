// Lance une requête quand touche Entrée est pressé
function pressEnter(e)
{
     if (e.code == "Enter")
     {
          createRequest()
     }
}

// AFfiche message d'erreur
function error(message)
{
     document.body.style.background = "radial-gradient(rgb(51, 204, 204),rgb(0, 204, 153))";
     errorsText.innerHTML = message;
     errorsContainer.style.display = "block";
     document.getElementById("body").style.display = "none";
     document.getElementById("footer").style.display = "none";
}


// Récupère la ville entrée pour envoyer la requête
function createRequest()
{
     if (navigator.onLine == false)
     {
          error("Vous n'êtes pas connecté à Internet.");
          return
     }
     let inputCity = document.getElementById("inputCity");
     inputCity = inputCity.value;
     sendRequest(inputCity);
}

// Exécute les requêtes et renvoie des données lisibles pour l'affichage
async function sendRequest(city)
{
     const token = "3a319049d37a193ddb11713cf607d4a27d5f5e0dd80f9214ccb97aeeddae2a6a";
     // Header des requêtes
     const requestHeader = new Headers({  
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 3a319049d37a193ddb11713cf607d4a27d5f5e0dd80f9214ccb97aeeddae2a6a' 
     });
     // Réception villes possibles parmi recherche
     const response = await fetch(`https://api.meteo-concept.com/api/location/cities?token=${token}&search=${city}`,
     {
          method: 'GET',
          headers: requestHeader,
          mode:'cors'
     });
     const content = await response.json(); // Converti la réponse en JSON
     if (content.cities["length"] == 0)
     {
          error("Aucune ville n'a été trouvée.");
          return
     }
     const insee = content.cities[0]["insee"]; // Révèle l'INSEE de la ville en premier résultat
     // Réception des infos sur la ville
     const responseInsee = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${insee}`,
     {
          method: 'GET',
          headers: requestHeader,
          mode:'cors'
     });
     const contentInsee = await responseInsee.json(); // Converti la réponse en JSON
     inputCity.value = contentInsee.city["name"] + " (" + contentInsee.city["cp"] + ")";
     let result = {}; // Créé un objet avec toutes les infos nécessaires
     result["codePostal"] = contentInsee.forecast[0]["cp"];
     result["kmwind"] = contentInsee.forecast[0]["wind10m"];
     result["kmgust"] = contentInsee.forecast[0]["gust10m"];
     result["dirwind"] = contentInsee.forecast[0]["dirwind10m"];
     result["weather"] = contentInsee.forecast[0]["weather"];
     result["temp"] = (contentInsee.forecast[0]["tmin"] + contentInsee.forecast[0]["tmax"]) / 2;
     result["tempmin"] = contentInsee.forecast[0]["tmin"];
     result["tempmax"] = contentInsee.forecast[0]["tmax"];
     result["probarain"] = contentInsee.forecast[0]["probarain"];
     result["rr10"] = contentInsee.forecast[0]["rr10"];
     updateDisplay(result);
}

// Converti les numéros de l'API en texte fonctionnel pour l'affichage
function convertInfos(sky)
{
     const transform = {0:"sun",1:"partly-cloudy",2:"partly-cloudy",3:"clouds",4:"clouds",5:"clouds",6:"haze",7:"haze",10:"rain",11:"heavy-rain",12:"torrential-rain",13:"rain",14:"heavy-rain",15:"torrential-rain",16:"haze",20:"light-snow",21:"snow",22:"snow-storm",30:"rain",31:"heavy-rain",32:"torrential-rain",40:"rain",41:"heavy-rain",42:"torrential-rain",43:"rain",44:"heavy-rain",45:"torrential-rain",46:"rain",47:"heavy-rain",48:"torrential-rain",60:"light-snow",61:"snow",62:"snow-storm",63:"light-snow",64:"snow",65:"snow-storm",66:"light-snow",67:"snow",68:"snow-storm",70:"rain",71:"heavy-rain",72:"torrential-rain",73:"rain",74:"heavy-rain",75:"torrential-rain",76:"rain",77:"heavy-rain",78:"torrential-rain",100:"cloud-lightning",100:"cloud-lightning",100:"cloud-lightning",100:"cloud-lightning",100:"cloud-lightning",100:"cloud-lightning",100:"cloud-lightning",101:"cloud-lightning",102:"cloud-lightning",103:"cloud-lightning",104:"cloud-lightning",105:"cloud-lightning",106:"cloud-lightning",107:"cloud-lightning",108:"cloud-lightning",120:"cloud-lightning",121:"cloud-lightning",122:"cloud-lightning",123:"cloud-lightning",124:"cloud-lightning",125:"cloud-lightning",126:"cloud-lightning",127:"cloud-lightning",128:"cloud-lightning",130:"cloud-lightning",131:"cloud-lightning",132:"cloud-lightning",133:"cloud-lightning",134:"cloud-lightning",135:"cloud-lightning",136:"cloud-lightning",137:"cloud-lightning",138:"cloud-lightning",140:"cloud-lightning",141:"cloud-lightning",142:"cloud-lightning",210:"rain",211:"heavy-rain",212:"torrential-rain",220:"light-snow",221:"snow",222:"snow-storm",230:"rain",231:"heavy-rain",232:"torrential-rain",235:"hail"};
     return transform[sky]
}

// Modifie l'affichage avec les infos données
function updateDisplay(infos)
{
     // Affiche les résultats
     errorsContainer.style.display = "none";
     document.getElementById("body").style.display = "grid";
     document.getElementById("footer").style.display = "flex";
     // Temperature
     const temperatureElementMin = document.getElementById("temperature").childNodes[1].childNodes[1];
     temperatureElementMin.innerHTML = "Min : " + infos["tempmin"] + " °C";
     const temperatureElementMax = document.getElementById("temperature").childNodes[1].childNodes[3];
     temperatureElementMax.innerHTML = "Max : " + infos["tempmax"] + " °C";
     if (infos["temp"] <= 10)
     {
          document.body.style.background = "radial-gradient(at bottom left,rgb(51,204,255),rgb(0,102,255))";
     }
     else if (infos["temp"] <= 21)
     {
          document.body.style.background = "radial-gradient(at bottom left,rgb(255,204,102),rgb(255,102,0))";
     }
     else
     {
          document.body.style.background = "radial-gradient(at bottom left,rgb(255,51,0),rgb(204,0,0))";
     }
     // Sky
     const skyElementImage = document.getElementById("sky").childNodes[1];
     skyElementImage.src = "medias/" + convertInfos(infos["weather"]) + ".png";
     skyElementImage.alt = convertInfos(infos["weather"]) + " icon";
     const skyElementText = document.getElementById("sky").childNodes[3];
     skyElementTextValue = convertInfos(infos["weather"]);
     skyElementTextValue = skyElementTextValue.replace("-"," ");
     skyElementText.innerHTML = skyElementTextValue;
     const rainElementText = document.getElementById("sky").childNodes[5];
     if (infos["probarain"] > 0)
     {
          rainElementText.innerHTML = infos["probarain"] + "%";
     }
     if (infos["rr10"] > 0)
     {
          rainElementText.innerHTML = rainElementText.innerHTML + " | " + infos["rr10"] + "mm";
     }
     // Wind
     const windElementImage = document.getElementById("wind").childNodes[1];
     windElementImage.style.transform = "rotate(" + infos["dirwind"] + "deg)";
     const windElementText = document.getElementById("wind").childNodes[3];
     windElementText.innerHTML = infos["kmwind"] + " km/h";
     const gustElementText = document.getElementById("wind").childNodes[5];
     gustElementText.innerHTML = infos["kmgust"] + " km/h";
}

// Choix catégorie d'information
function changeCategorie(elem)
{
     for (let i=0;i<3;i++)
     {
          categories[i].id = "";
     }
     console.log(elem);
}

// Rends dynamique les catégories
const categories = [document.getElementById("footer").childNodes[1],document.getElementById("footer").childNodes[3],document.getElementById("footer").childNodes[5]];
for (let i=0;i<3;i++)
{
     categories[i].addEventListener("click",changeCategorie(i));
}

// Démarre le processus par le lancement de la recherche
const searchButton = document.getElementById("search");
searchButton.addEventListener('click',createRequest);
document.addEventListener('keyup', pressEnter);

// Gestion d'erreurs
const errorsContainer = document.getElementById("errors");
const errorsText = errorsContainer.childNodes[1];
errorsText.innerHTML = "Saisissez une ville.";


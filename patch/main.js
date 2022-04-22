// Lance une requête quand touche Entrée est pressé
function pressEnter(e)
{
     if (e.code == "Enter")
     {
          createRequest()
     }
}

// Affiche message d'erreur
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
     let contentInsee = await responseInsee.json(); // Converti la réponse en JSON
     inputCity.value = contentInsee.city["name"] + " (" + contentInsee.city["cp"] + ")";
     let result = []; // Créé un objet avec toutes les infos nécessaires
     for (i=0;i<8;i++)
     {
          result[i] = {};
          contentInsee.forecast[i]["datetime"] = new Date(contentInsee.forecast[i]["datetime"]);
          result[i]["date"] = [convertDay(contentInsee.forecast[i]["datetime"].getDay()),contentInsee.forecast[i]["datetime"].getDate(),convertMonth(contentInsee.forecast[i]["datetime"].getMonth())];
          result[i]["kmwind"] = contentInsee.forecast[i]["wind10m"];
          result[i]["kmgust"] = contentInsee.forecast[i]["gust10m"];
          result[i]["dirwind"] = contentInsee.forecast[i]["dirwind10m"];
          result[i]["weather"] = contentInsee.forecast[i]["weather"];
          result[i]["temp"] = (contentInsee.forecast[i]["tmin"] + contentInsee.forecast[i]["tmax"]) / 2;
          result[i]["tempmin"] = contentInsee.forecast[i]["tmin"];
          result[i]["tempmax"] = contentInsee.forecast[i]["tmax"];
          result[i]["probarain"] = contentInsee.forecast[i]["probarain"];
          result[i]["rr10"] = contentInsee.forecast[i]["rr10"];
     }
     updateDisplay(result);
}

// Converti les numéros de date (JavaScript) en string
function convertDay(num)
{
     const transform = {0:'Dimanche',1:'Lundi',2:'Mardi',3:'Mercredi',4:'Jeudi',5:'Vendredi',6:'Samedi'};
     return transform[num]
}

function convertMonth(num)
{
     const transform = {0:'Janvier',1:'Février',2:'Mars',3:'Avril',4:'Mai',5:'Juin',6:'Juillet',7:'Août',8:'Septembre',9:'Octobre',10:'Novembre',11:'Décembre'};
     return transform[num]
}

// Converti les numéros de l'API en texte fonctionnel pour l'affichage
function convertInfos(sky)
{
     const transform = {0:["sun","ensoleillé"],1:["partly-cloudy","éclaircies"],2:["partly-cloudy","éclaircies"],3:["clouds","nuageux"],4:["clouds","nuageux"],5:["clouds","nuageux"],6:["haze","brouillard"],7:["haze","brouillard"],10:["rain","pluie fine"],11:["heavy-rain","pluie"],12:["torrential-rain","tempête pluvieuse"],13:["rain","pluie fine"],14:["heavy-rain","pluie"],15:["torrential-rain","tempête pluvieuse"],16:["haze","brouillard"],20:["light-snow","neige légère"],21:["snow","neige"],22:["snow-storm","tempête de neige"],30:["rain","pluie fine"],31:["heavy-rain","pluie"],32:["torrential-rain","tempête pluvieuse"],40:["rain","pluie fine"],41:["heavy-rain","pluie"],42:["torrential-rain","tempête pluvieuse"],43:["rain","pluie fine"],44:["heavy-rain","pluie"],45:["torrential-rain","tempête pluvieuse"],46:["rain","pluie fine"],47:["heavy-rain","pluie"],48:["torrential-rain","tempête pluvieuse"],60:["light-snow","neige légère"],61:["snow","neige"],62:["snow-storm","tempête de neige"],63:["light-snow","neige légère"],64:["snow","neige"],65:["snow-storm","tempête de neige"],66:["light-snow","neige légère"],67:["snow","neige"],68:["snow-storm","tempête de neige"],70:["rain","pluie fine"],71:["heavy-rain","pluie"],72:["torrential-rain","tempête pluvieuse"],73:["rain","pluie fine"],74:["heavy-rain","pluie"],75:["torrential-rain","tempête pluvieuse"],76:["rain","pluie fine"],77:["heavy-rain","pluie"],78:["torrential-rain","tempête pluvieuse"],100:["cloud-lightning","orages"],100:["cloud-lightning","orages"],100:["cloud-lightning","orages"],100:["cloud-lightning","orages"],100:["cloud-lightning","orages"],100:["cloud-lightning","orages"],100:["cloud-lightning","orages"],101:["cloud-lightning","orages"],102:["cloud-lightning","orages"],103:["cloud-lightning","orages"],104:["cloud-lightning","orages"],105:["cloud-lightning","orages"],106:["cloud-lightning","orages"],107:["cloud-lightning","orages"],108:["cloud-lightning","orages"],120:["cloud-lightning","orages"],121:["cloud-lightning","orages"],122:["cloud-lightning","orages"],123:["cloud-lightning","orages"],124:["cloud-lightning","orages"],125:["cloud-lightning","orages"],126:["cloud-lightning","orages"],127:["cloud-lightning","orages"],128:["cloud-lightning","orages"],130:["cloud-lightning","orages"],131:["cloud-lightning","orages"],132:["cloud-lightning","orages"],133:["cloud-lightning","orages"],134:["cloud-lightning","orages"],135:["cloud-lightning","orages"],136:["cloud-lightning","orages"],137:["cloud-lightning","orages"],138:["cloud-lightning","orages"],140:["cloud-lightning","orages"],141:["cloud-lightning","orages"],142:["cloud-lightning","orages"],210:["rain","pluie fine"],211:["heavy-rain","pluie"],212:["torrential-rain","tempête pluvieuse"],220:["light-snow","neige légère"],221:["snow","neige"],222:["snow-storm","tempête de neige"],230:["rain","pluie fine"],231:["heavy-rain","pluie"],232:["torrential-rain","tempête pluvieuse"],235:["hail","grêle"]};
     return transform[sky]
}

// Modifie l'affichage avec les infos données
function updateDisplay(infos)
{
     // Affiche les résultats
     errorsContainer.style.display = "none";
     document.getElementById("body").style.display = "block";
     document.getElementById("footer").style.display = "flex";

     /* Today */
     // Temperature
     let temperatureElementMin = document.getElementById("today").childNodes[1].childNodes[1].childNodes[1];
     temperatureElementMin.innerHTML = "Min : " + infos[0]["tempmin"] + " °C";
     let temperatureElementMax = document.getElementById("today").childNodes[1].childNodes[1].childNodes[3];
     temperatureElementMax.innerHTML = "Max : " + infos[0]["tempmax"] + " °C";
     if (infos[0]["temp"] <= 10)
     {
          document.body.style.background = "radial-gradient(at bottom left,rgb(51,204,255),rgb(0,102,255))";
     }
     else if (infos[0]["temp"] <= 21)
     {
          document.body.style.background = "radial-gradient(at bottom left,rgb(255,204,102),rgb(255,102,0))";
     }
     else
     {
          document.body.style.background = "radial-gradient(at bottom left,rgb(255,51,0),rgb(204,0,0))";
     }
     // Sky
     let skyElementImage = document.getElementById("sky").childNodes[1];
     skyElementImage.src = "medias/" + convertInfos(infos[0]["weather"])[0] + ".png";
     skyElementImage.alt = "Icône " + convertInfos(infos[0]["weather"])[1];
     const skyElementText = document.getElementById("sky").childNodes[3];
     skyElementTextValue = convertInfos(infos[0]["weather"])[1];
     skyElementText.innerHTML = skyElementTextValue;
     const rainElementText = document.getElementById("sky").childNodes[5];
     if (infos[0]["probarain"] > 0)
     {
          rainElementText.innerHTML = infos[0]["probarain"] + "%";
     }
     if (infos[0]["rr10"] > 0)
     {
          rainElementText.innerHTML = rainElementText.innerHTML + " | " + infos[0]["rr10"] + "mm";
     }
     // Wind
     let windElementImage = document.getElementById("wind").childNodes[1];
     windElementImage.style.transform = "rotate(" + infos[0]["dirwind"] + "deg)";
     let windElementText = document.getElementById("wind").childNodes[3];
     windElementText.innerHTML = infos[0]["kmwind"] + " km/h";
     const gustElementText = document.getElementById("wind").childNodes[5];
     gustElementText.innerHTML = infos[0]["kmgust"] + " km/h";

     /* Three days */
     let j = 1;
     for (i=1;i<4;i++)
     {
          // Date
          let dateString = document.getElementById("threeDays").childNodes[j].childNodes[1];
          dateString.innerHTML = infos[i]["date"][0] + " " + infos[i]["date"][1] + " " + infos[i]["date"][2];
          // Sky
          skyElementImage = document.getElementById("threeDays").childNodes[j].childNodes[3];
          skyElementImage.src = "medias/" + convertInfos(infos[i]["weather"])[0] + ".png";
          skyElementImage.alt = "Icône " + convertInfos(infos[i]["weather"])[1];
          // Temperature
          temperatureElementMin = document.getElementById("threeDays").childNodes[j].childNodes[5].childNodes[1];
          temperatureElementMin.innerHTML = infos[i]["tempmin"] + " °C";
          temperatureElementMax = document.getElementById("threeDays").childNodes[j].childNodes[5].childNodes[3];
          temperatureElementMax.innerHTML = infos[i]["tempmax"] + " °C";
          // Wind
          windElementImage = document.getElementById("threeDays").childNodes[j].childNodes[7].childNodes[3];
          windElementImage.style.transform = "rotate(" + infos[i]["dirwind"] + "deg)";
          windElementText = document.getElementById("threeDays").childNodes[j].childNodes[7].childNodes[1];
          windElementText.innerHTML = infos[i]["kmwind"] + " km/h";
          j = j + 2;  
     }

     /* Week */
     j = 1;
     for (i=4;i<8;i++)
     {
          // Date
          let dateString = document.getElementById("week").childNodes[j].childNodes[1];
          dateString.innerHTML = infos[i]["date"][0] + " " + infos[i]["date"][1] + " " + infos[i]["date"][2];
          // Sky
          skyElementImage = document.getElementById("week").childNodes[j].childNodes[3];
          skyElementImage.src = "medias/" + convertInfos(infos[i]["weather"])[0] + ".png";
          skyElementImage.alt = "Icône " + convertInfos(infos[i]["weather"])[1];
          // Temperature
          temperatureElementMin = document.getElementById("week").childNodes[j].childNodes[5].childNodes[1];
          temperatureElementMin.innerHTML = infos[i]["tempmin"] + " °C";
          temperatureElementMax = document.getElementById("week").childNodes[j].childNodes[5].childNodes[3];
          temperatureElementMax.innerHTML = infos[i]["tempmax"] + " °C";
          // Wind
          windElementImage = document.getElementById("week").childNodes[j].childNodes[7].childNodes[3];
          windElementImage.style.transform = "rotate(" + infos[i]["dirwind"] + "deg)";
          windElementText = document.getElementById("week").childNodes[j].childNodes[7].childNodes[1];
          windElementText.innerHTML = infos[i]["kmwind"] + " km/h";
          j = j + 2;  
     }
}

// Choix catégorie d'information
function changeCategorie(elem)
{
     for (let i=0;i<3;i++)
     {
          categories[i].id = "";
     }
     for (let i=0;i<3;i++)
     {
          document.getElementById("body").childNodes[(i*2)+1].style.display = "none";
     }
     categories[elem].id="categorieActive";
     document.getElementById("body").childNodes[(elem*2)+1].style.display = "grid";
}

// Rends dynamique les catégories
const categories = [document.getElementById("footer").childNodes[1],document.getElementById("footer").childNodes[3],document.getElementById("footer").childNodes[5]];
for (let i=0;i<3;i++)
{
     categories[i].addEventListener("click",function(){changeCategorie(i)});
}

// Démarre le processus par le lancement de la recherche
const searchButton = document.getElementById("search");
searchButton.addEventListener('click',createRequest);
document.addEventListener('keyup', pressEnter);

// Gestion d'erreurs
const errorsContainer = document.getElementById("errors");
const errorsText = errorsContainer.childNodes[1];
errorsText.innerHTML = "Saisissez une ville.";

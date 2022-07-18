/* ATUI Features */
atuiKernel_FooterLastedited(18,7,2022);
atuiKernel_ColorschemeGeneratorAuto([64, 191, 128]);


/* Link searchbar to sending process */
const searchButton = document.getElementById("atuiSearchservices_Submit");
searchButton.addEventListener('click',createRequest);

document.addEventListener('keyup',pressEnter);
function pressEnter(e)
{
     if (e.code == "Enter")
     {
          createRequest()
     }
}


/* Logs */
const logText = document.getElementById("log");
logText.innerHTML = "Recherchez une ville en France métropolitaine.";
function log(message)
{
     document.getElementById("atuiKernel_Header").style.background = "auto";
     logText.innerHTML = message;
     logText.style.display = "block";
     document.getElementById("today").style.display = "none";
     document.getElementById("dataTable").style.display = "none";
}


/* Searchbar */
let inputCity = document.getElementById("atuiSearchservices_Input");
inputCity.addEventListener('input',function(){updateSuggestions(inputCity.value)});

function createRequest() // Get infos with non-suggested search
{
     if (!navigator.onLine)
     {
          log("Non connecté à Internet.");
          return
     }
     sendRequest(inputCity.value);
}


/* Common requests */
const requestHeader = new Headers({  
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     'Authorization': 'Bearer 8d432d87acf6b2a4e36ee21cd41d5821cb1db3133b673e79dd0f6f0b80cca53f' 
});
const token = "8d432d87acf6b2a4e36ee21cd41d5821cb1db3133b673e79dd0f6f0b80cca53f";


/* Update suggestions */

async function updateSuggestions(search)
{
     log("Recherche de villes (0/2)");
     try
     {
          const response = await fetch(`https://api.meteo-concept.com/api/location/cities?token=${token}&search=${search}`,
          {
               method: 'GET',
               headers: requestHeader,
               mode:'cors'
          });
     }
     catch
     {
          log("Le service de l'API est indisponible.");
     }
     const content = await response.json(); // Converti la réponse en JSON
     log("Traitement (1/2)");
     let suggested = [];
     let result;
     for (let counter = 0;counter < 5;counter++)
     {
          try
          {
               result = [content.cities[counter]["name"] + " (" + content.cities[counter]["cp"] + ")",content.cities[counter]["cp"]];
          }
          catch
          {
               result = "";
          }
          suggested.push(result);
     }
     atuiSearchservices_HeaderPropositionsGenerate(undefined,suggested);
     log("Sélectionnez une ville.");
}


/* Send requests */

async function sendRequest(city)
{
     // Recherche des villes
     log("Recherche des villes (0/3)");
     try
     {
          const response = await fetch(`https://api.meteo-concept.com/api/location/cities?token=${token}&search=${city}`,
          {
               method: 'GET',
               headers: requestHeader,
               mode:'cors'
          });
     }
     catch
     {
          log("Le service de l'API est indisponible.");
     }
     const content = await response.json(); // Converti la réponse en JSON
     if (content.cities["length"] == 0)
     {
          log("Aucune ville trouvée.");
          return
     }

     // Réception des infos sur la ville
     log("Réception des données météo (1/3)");
     const insee = content.cities[0]["insee"]; // Révèle l'INSEE de la ville en premier résultat
     try
     {
          const responseInsee = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${insee}`,
          {
               method: 'GET',
               headers: requestHeader,
               mode:'cors'
          });
     }
     catch
     {
          log("Le service de l'API est indisponible.");
     }
     let contentInsee = await responseInsee.json(); // Converti la réponse en JSON

     // Organisation des données
     log("Traitement (2/3)");
     document.getElementById("cityToday").textContent = contentInsee.city["name"] + " (" + contentInsee.city["cp"] + ")";
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
     console.log(result);
     updateWebpage(result);
}


/* Convert dates from number to string */
function convertDay(num)
{
     const transform = {
          0:'Dimanche',
          1:'Lundi',
          2:'Mardi',
          3:'Mercredi',
          4:'Jeudi',
          5:'Vendredi',
          6:'Samedi'
     };
     return transform[num]
}

function convertMonth(num)
{
     const transform = {
          0:'Janvier',
          1:'Février',
          2:'Mars',
          3:'Avril',
          4:'Mai',
          5:'Juin',
          6:'Juillet',
          7:'Août',
          8:'Septembre',
          9:'Octobre',
          10:'Novembre',
          11:'Décembre'
     };
     return transform[num]
}


/* Converti API numbers to string for user */
function convertInfos(sky)
{
     const transform = {
          0:["sun","ensoleillé"],
          1:["partly-cloudy","éclaircies"],
          2:["partly-cloudy","éclaircies"],
          3:["clouds","nuageux"],
          4:["clouds","nuageux"],
          5:["clouds","nuageux"],
          6:["haze","brouillard"],
          7:["haze","brouillard"],
          10:["rain","pluie fine"],
          11:["heavy-rain","pluie"],
          12:["torrential-rain","tempête pluvieuse"],
          13:["rain","pluie fine"],
          14:["heavy-rain","pluie"],
          15:["torrential-rain","tempête pluvieuse"],
          16:["haze","brouillard"],
          20:["light-snow","neige légère"],
          21:["snow","neige"],
          22:["snow-storm","tempête de neige"],
          30:["rain","pluie fine"],
          31:["heavy-rain","pluie"],
          32:["torrential-rain","tempête pluvieuse"],
          40:["rain","pluie fine"],
          41:["heavy-rain","pluie"],
          42:["torrential-rain","tempête pluvieuse"],
          43:["rain","pluie fine"],
          44:["heavy-rain","pluie"],
          45:["torrential-rain","tempête pluvieuse"],
          46:["rain","pluie fine"],
          47:["heavy-rain","pluie"],
          48:["torrential-rain","tempête pluvieuse"],
          60:["light-snow","neige légère"],
          61:["snow","neige"],
          62:["snow-storm","tempête de neige"],
          63:["light-snow","neige légère"],
          64:["snow","neige"],
          65:["snow-storm","tempête de neige"],
          66:["light-snow","neige légère"],
          67:["snow","neige"],
          68:["snow-storm","tempête de neige"],
          70:["rain","pluie fine"],
          71:["heavy-rain","pluie"],
          72:["torrential-rain","tempête pluvieuse"],
          73:["rain","pluie fine"],
          74:["heavy-rain","pluie"],
          75:["torrential-rain","tempête pluvieuse"],
          76:["rain","pluie fine"],
          77:["heavy-rain","pluie"],
          78:["torrential-rain","tempête pluvieuse"],
          100:["cloud-lighting","orages"],
          100:["cloud-lighting","orages"],
          101:["cloud-lighting","orages"],
          102:["cloud-lighting","orages"],
          103:["cloud-lighting","orages"],
          104:["cloud-lighting","orages"],
          105:["cloud-lighting","orages"],
          106:["cloud-lighting","orages"],
          107:["cloud-lighting","orages"],
          108:["cloud-lighting","orages"],
          120:["cloud-lighting","orages"],
          121:["cloud-lighting","orages"],
          122:["cloud-lighting","orages"],
          123:["cloud-lighting","orages"],
          124:["cloud-lighting","orages"],
          125:["cloud-lighting","orages"],
          126:["cloud-lighting","orages"],
          127:["cloud-lighting","orages"],
          128:["cloud-lighting","orages"],
          130:["cloud-lighting","orages"],
          131:["cloud-lighting","orages"],
          132:["cloud-lighting","orages"],
          133:["cloud-lighting","orages"],
          134:["cloud-lighting","orages"],
          135:["cloud-lighting","orages"],
          136:["cloud-lighting","orages"],
          137:["cloud-lighting","orages"],
          138:["cloud-lighting","orages"],
          140:["cloud-lighting","orages"],
          141:["cloud-lighting","orages"],
          142:["cloud-lighting","orages"],
          210:["rain","pluie fine"],
          211:["heavy-rain","pluie"],
          212:["torrential-rain","tempête pluvieuse"],
          220:["light-snow","neige légère"],
          221:["snow","neige"],
          222:["snow-storm","tempête de neige"],
          230:["rain","pluie fine"],
          231:["heavy-rain","pluie"],
          232:["torrential-rain","tempête pluvieuse"],
          235:["hail","grêle"]
     };
     return transform[sky]
}


/* Update webpage with data */
function updateWebpage(infos)
{
     logText.style.display = "none";
     
     /* Today */
     document.getElementById("today").style.display = "flex";

     // Temperature
     let temperatureElementMin = document.getElementById("tempTodayMin");
     temperatureElementMin.textContent = "Min : " + infos[0]["tempmin"] + " °C";
     let temperatureElementMax = document.getElementById("tempTodayMax");
     temperatureElementMax.textContent = "Max : " + infos[0]["tempmax"] + " °C";
     if (infos[0]["temp"] <= 5)
     {
          document.getElementById("atuiKernel_Header").style.background = "var(--veryCold)";
     }
     else if (infos[0]["temp"] <= 15)
     {
          document.getElementById("atuiKernel_Header").style.background = "var(--cold)";
     }
     else if (infos[0]["temp"] <= 25)
     {
          document.getElementById("atuiKernel_Header").style.background = "var(--lukewarm)";
     }
     else if (infos[0]["temp"] <= 35)
     {
          document.getElementById("atuiKernel_Header").style.background = "var(--hot)";
     }
     else if (infos[0]["temp"] >= 36)
     {
          document.getElementById("atuiKernel_Header").style.background = "var(--veryHot)";
     }

     // Sky
     let skyElementImage = document.getElementById("skyTodayImg");
     skyElementImage.src = "medias/" + convertInfos(infos[0]["weather"])[0] + ".png";
     skyElementImage.alt = "Icône " + convertInfos(infos[0]["weather"])[1];
     if (infos[0]["probarain"] > 0)
     {
          document.getElementById('skyTodayProbarain').textContent = infos[0]["probarain"] + "%";
     }
     if (infos[0]["rr10"] > 0)
     {
          document.getElementById('skyTodayAccumurain').textContent = rainElementText.innerHTML + " | " + infos[0]["rr10"] + "mm";
     }

     // Wind
     let windElementImage = document.getElementById("windTodayImg");
     windElementImage.style.transform = "rotate(" + infos[0]["dirwind"] + "deg)";
     let windElementText = document.getElementById("windTodayMin");
     windElementText.textContent = infos[0]["kmwind"] + " km/h";
     const gustElementText = document.getElementById("windTodayMax");
     gustElementText.textContent = infos[0]["kmgust"] + " km/h";
     
     /* Three days */
     //document.getElementById("dataTable").style.display = "grid";
     /*let j = 1;
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
     }*/
     
     /* Week */
     /*j = 1;
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
     }*/
}


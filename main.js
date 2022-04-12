function sendRequest(request)
{
     var rep;
     var request = new XMLHttpRequest();
     request.open('GET',request);
     request.responseType = 'json';
     request.onload = function() {
          rep = request.response;
        };
        console.log("rep:",rep);
     request.send()
}

function createRequest()
{
     var inputVille = document.getElementById("inputVille");
     var inputDate = document.getElementById("inputDate");
     inputVille = inputVille.value;
     inputDate = inputDate.value;
     console.log([inputVille,inputDate]);
     var request = "http://api.meteo-concept.com/api/location/cities?token=8d432d87acf6b2a4e36ee21cd41d5821cb1db3133b673e79dd0f6f0b80cca53f&search="+inputVille;
     console.log(request);
     sendRequest(request);
}

var searchButton = document.getElementById("search");
searchButton.addEventListener('click',createRequest);
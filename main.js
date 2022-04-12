function sendRequest(request)
{
     var requestHeader = new Headers();
     requestHeader.append('Content-Type', 'application/json');
     requestHeader.append('Access-Control-Allow-Origin', 'no-cors');
     requestHeader.append('method', 'GET');
     requestHeader.get('Content-Type');
     requestHeader.get('Access-Control-Allow-Origin');
     requestHeader.get('method');
     console.log(requestHeader);
     fetch(request,{requestHeader});
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

var searchButton = document.getElementById("search");
searchButton.addEventListener('click',createRequest);
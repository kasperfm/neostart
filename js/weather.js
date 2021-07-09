// Requires: jQuery
// To use this feature, you have to sign up for your own Weatherbit API key.
// This can be done for free here: https://www.weatherbit.io

function getWeather(location, unit) {
    var url = 'https://api.weatherbit.io/v2.0/current';
    var httpMethod = 'GET';
    var api_key = 'YOUR_API_KEY';
    var position = location.split(',', 2);
    var query = {'lat': position[0], 'lon': position[1], 'key': api_key, 'units': unit};

    var responseCopy;
    return fetch(url + '?' + $.param(query), {
        method: httpMethod
    }).then(function (response) {
            responseCopy = response.clone();
            return response.json();
        }).then(function (weather) {
		var weatherText = weather.data[0].temp + '\xB0 in ' + weather.data[0].city_name;
            $("#weather").text(weatherText);
        });
}
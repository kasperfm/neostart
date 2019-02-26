// Requires: jQuery and crypto-js (v3.1.9)
// To use this feature, you have to sign up for your own Yahoo Weather API keys.
// This can be done here: https://developer.yahoo.com/weather/

function getWeather(location, unit, lookupByLatLon = true) {
    var url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
    var method = 'GET';
    var app_id = 'THE_APP_ID';
    var consumer_key = 'YOUR_CONSUMER_KEY';
    var consumer_secret = 'YOUR_CONSUMER_SECRET';
    var concat = '&';

    if(lookupByLatLon){
        var position = location.split(',', 2);
        var query = {'lat': position[0], 'lon': position[1], 'format': 'json', 'u' : unit};
    }else{
        var query = {'location': location, 'format': 'json', 'u' : unit};
    }

    var oauth = {
        'oauth_consumer_key': consumer_key,
        'oauth_nonce': Math.random().toString(36).substring(2),
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
        'oauth_version': '1.0'
    };

    var merged = {};
    $.extend(merged, query, oauth);
// Note the sorting here is required
    var merged_arr = Object.keys(merged).sort().map(function (k) {
        return [k + '=' + encodeURIComponent(merged[k])];
    });
    var signature_base_str = method
        + concat + encodeURIComponent(url)
        + concat + encodeURIComponent(merged_arr.join(concat));

    var composite_key = encodeURIComponent(consumer_secret) + concat;
    var hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
    var signature = hash.toString(CryptoJS.enc.Base64);

    oauth['oauth_signature'] = signature;
    var auth_header = 'OAuth ' + Object.keys(oauth).map(function (k) {
        return [k + '="' + oauth[k] + '"'];
    }).join(',');

    var responseCopy;
    return fetch(url + '?' + $.param(query), {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            'Authorization': auth_header,
            'Yahoo-App-Id': app_id
        })
    }).then(function (response) {
            responseCopy = response.clone();
            return response.json();
        }).then(function (weather) {
            var weatherText = 'It is ' + weather.current_observation.condition.temperature + '\xB0 in ' + weather.location.city;
            $("#weather").text(weatherText);
        });
}
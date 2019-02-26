// Configuration
var unsplashCollectionID = 1369542;
var enableWeather = true;
var defaultWeatherLocation = 'Viborg';
var weatherTemperatureUnit = 'c';
var defaultSearchBaseURL = 'https://encrypted.google.com/search?q=';

function initLocation() {
    if ("geolocation" in navigator) {
        var options = {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0
        };

        function success(pos) {
            getWeather(pos.coords.latitude + ',' + pos.coords.longitude, weatherTemperatureUnit);
        }

        function error(err) {
            console.error("Location error: " + err.message);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
       getWeather(defaultWeatherLocation, 'c', false);
    }
}

function timedQuotes() {
    var day = new Date();
    var hr = day.getHours();

    if (hr == 1) {
        return "Good evening :) Are you still coding?!";
    }
    if (hr == 2) {
        return "Good night. You should go to bed...";
    }
    if (hr == 3) {
        return "Life is too short to be offline... Or sleep!";
    }
    if (hr == 4) {
        return "The time is 4 AM... zzZZz...";
    }
    if (hr == 5) {
        return "Damn, How can you keep going?";
    }
    if (hr == 6) {
        return "Hey! It is too early to be online";
    }
    if ((hr == 7) || (hr == 8) || (hr == 9)) {
        return "Good morning handsome guy <3";
    }
    if (hr == 10) {
        return "Wake up, and write some awesome code!";
    }
    if (hr == 11) {
        return "Remember to take a break :-)";
    }
    if (hr == 12) {
        return "Go get some lunch. It's sandwich time!";
    }
    if (hr == 14) {
        return "It would be nice with a powernap";
    }
    if ((hr == 15) || (hr == 16) || (hr == 13)) {
        return "Hello ^_^ Enjoy your trip on the interwebz";
    }
    if ((hr == 17) || (hr == 18) || (hr == 19) || (hr == 20) || (hr == 21) || (hr == 22)) {
        return "Good evening, and welcome to the internet";
    }
    if (hr == 23) {
        return "It's soon midnight! Dude, go to sleep";
    }
    if (hr == 0) {
        return "It is past midnight. Was that a Werewolf?";
    }
}

function loadRandomBackgroundImage() {
    var imageSrc = 'https://source.unsplash.com/collection/' + unsplashCollectionID + '/1920x1200';
    $('body').css('background-image', 'url(' + imageSrc + ')');
}

$(function() {
    loadRandomBackgroundImage();

    var Clock = {
        el: document.getElementById('js-time'),

        init: function() {
            Clock.setTime();
            setInterval(Clock.setTime, 1000);
        },

        zeros: function(num) {
            return ('0' + num.toString()).slice(-2);
        },

        setTime: function() {
            var date = new Date();
            var hours = Clock.zeros(date.getHours());
            var minutes = Clock.zeros(date.getMinutes());
            var time = hours + ' ' + minutes;

            Clock.el.innerHTML = time;
        }
    };

    var Cmdr = {
        searchForm: document.getElementById('js-search'),
        searchText: document.getElementById('js-search-text'),
        searchHelp: document.getElementById('js-help'),

        init: function(opts) {
            Cmdr.default = opts.default;
            Cmdr.commands = opts.commands;
            Cmdr.searchForm.addEventListener('submit', Cmdr.search, false);
        },

        search: function(e) {
            var q = Cmdr.searchText.value;
            q = q.toLowerCase();
			
			if (q.search( 'www.' ) == 0){
				window.location.href = 'https://' + q;
				e.preventDefault();
				return false;
			}
			
            if (q === '?') {
                Cmdr.commands.forEach(function(command) {
                    Cmdr.searchHelp.innerHTML += command.key + ': ' + command.name + '\n';
                });

                Cmdr.searchHelp.style.height = Math.ceil(Cmdr.commands.length / 2) + 'rem';
                Cmdr.searchText.value = '';
            } else {
                Cmdr.location = Cmdr.default + encodeURIComponent(q);
                q = q.split(':');

                Cmdr.commands.forEach(function(command) {
                    if (q[0] === command.key) {
                        Cmdr.location = command.url;

                        if (q[1] && command.search) {
                            q.shift();
                            var searchText = encodeURIComponent(q.join(':').trim());
                            Cmdr.location = command.url + command.search + searchText;
                        }
                    }
                });

                window.location.href = Cmdr.location;
            }

            e.preventDefault();
        }
    };

    Clock.init();
    Cmdr.init({
        default: defaultSearchBaseURL,
        commands: [
            { key: 'a', name: 'AliExpress', url: 'https://www.aliexpress.com', search: '/wholesale?SearchText=' },
            { key: 'f', name: 'Facebook', url: 'https://www.facebook.com', search: '/search/top/?q=' },
            { key: 'g', name: 'GitHub', url: 'https://github.com', search: '/search?q=' },
            { key: 'k', name: 'Keep', url: 'https://keep.google.com', search: '/#search/text=' },
            { key: 'm', name: 'GMail', url: 'https://mail.google.com', search: '/mail/u/0/#search/' },
            { key: 'p', name: 'Plex', url: 'https://app.plex.tv/desktop'},
            { key: 'r', name: 'Reddit', url: 'https://www.reddit.com', search: '/search?q=' },
            { key: 's', name: 'Spotify', url: 'https://play.spotify.com', search: '/search/' },
            { key: 't', name: 'Twitter', url: 'https://twitter.com', search: '/search?q=' },
            { key: 'y', name: 'YouTube', url: 'https://www.youtube.com', search: '/results?search_query=' },
        ]
    });

    $('#quotes').text(timedQuotes());

    if(enableWeather) {
        initLocation();
    }
}());

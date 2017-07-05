var recognition = null;
var isRunning = null;
var locale = 'en-US';
var toLocale = 'ko-KR';

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        recognition = new SpeechRecognition();
        isRunning = false;

        recognition.onsoundstart = function() {
            $('#status').text('Listening...');
            $('#result').text('');
            $('#translation').text('');
        };

        recognition.onresult = function(e) {
            if (e.results.length > 0) {
                app.google_translate(e.results[0][0].transcript);
            }
        };

        recognition.onend = function() {
            isRunning = false;

            $('#status').text('Idle');
        };

        recognition.onerror = function(e) {
            isRunning = false;

            alert('Oops! Something went wrong... Please make sure you are connected to the internet.');
        };

        $('#btnStartListening').click(function() {
            if(isRunning) {
                recognition.stop();

                isRunning = false;
            } else {
                locale = $('#locale-picker').val().split(':')[0];
                toLocale = $('#locale-picker').val().split(':')[1];

                recognition.lang = locale;

                recognition.start();

                $('#status').text('Waiting...');

                isRunning = true;
            }
        });
    },
    google_translate: function(what) {
        showLoader();

        $.ajax({
            url: 'https://translation.googleapis.com/language/translate/v2',
            method: 'GET',
            data: {
                key: googleApiKey,
                q: what,
                target: toLocale.split('-')[0],
                format: 'text'
            },
            dataType: 'json',
            success: function(response) {
                hideLoader();

                var translation = response.data.translations[0].translatedText;

                $('#result').text(what);
                $('#translation').text(translation);

                TTS.speak({
                    text: translation,
                    locale: toLocale,
                    rate: 1
                }, function() {}, function(reason) {
                    alert('Oops! Something went wrong. TTS Error: ' + reason);
                });
            },
            error: function(arg1, arg2, arg3) {
                alert('Oops! Something went wrong. Request Error:' + arg1.responseText);
            }
        });

        return false;
    }
};

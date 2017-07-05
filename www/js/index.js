var recognition = null;
var isRunning = null;
var userResponse = '';
var aiResponse = '';
var locale = 'en-US';

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        recognition = new SpeechRecognition();
        recognition.lang = locale;

        recognition.onsoundstart = function() {
            $('#content-block').append('<div id="listening" class="card-panel center-align"><h5><span class="fa fa-ellipsis-h"></span></h5></div>');
        };

        recognition.onsoundend = function() {
            $('#listening').remove();
        };

        recognition.onresult = function(e) {
            if(e.results.length > 0) {
                userResponse = e.results[0][0].transcript;

                $('#content-block').append('<div class="card-panel"><h5>' + e.results[0][0].transcript + '</h5></div>');
            }

            aiResponse = 'This is a test message.';

            $('#content-block').append('<div class="card-panel light-blue lighten-4"><h5>' + aiResponse + '</h5></div>').promise().done(function() {
                app.speak(aiResponse, locale);
            });
        };

        recognition.onnomatch = function(e) {
            aiResponse = 'Sorry. What was that again?';

            $('#content-block').append('<div class="card-panel light-blue lighten-4"><h5>' + aiResponse + '</h5></div>').promise().done(function() {
                app.speak(aiResponse, locale);
            });
        };

        recognition.onend = function() {
            isRunning = false;
        };

        recognition.onerror = function(e) {
            isRunning = false;
        };

        $('#btnStartListening').click(function() {
            if(isRunning) {
                recognition.stop();

                isRunning = false;
            } else {
                recognition.start();

                isRunning = true;
            }
        });
    },
    speak: function(text, lang, callback) {
        if(typeof callback !== 'function') {
            callback = function() {}
        }

        TTS.speak({
            text: text,
            locale: lang,
            rate: 1
        }, callback, function(reason) {
            alert('Oops! Something went wrong. TTS Error: ' + reason);
        });
    },
    reply: function(text) {
    }
};

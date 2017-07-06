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
            var link = '';

            showLoader();

            if(e.results.length > 0) {
                userResponse = e.results[0][0].transcript;

                $('#content-block').append('<div class="card-panel"><h5>' + userResponse + '</h5></div>');
            }

            aiResponse = app.reply(userResponse);

            if(objectKeyExists(aiResponse, 'data')) {
                if(objectKeyExists(aiResponse.data, 'link') && (aiResponse.data.link !== undefined || aiResponse.data.link !== null || aiResponse.data.link !== '')) {
                    link = '<div><a href="' + aiResponse.data.link + '">' + aiResponse.data.link + '</a></div>';
                }
            }

            $('#content-block').append('<div class="card-panel light-blue lighten-4"><h5>' + aiResponse.message + '</h5></div>').promise().done(function() {
                hideLoader();
                app.speak(aiResponse.message, locale);
            });
        };

        recognition.onnomatch = function(e) {
            aiResponse = app.reply('');

            $('#content-block').append('<div class="card-panel light-blue lighten-4"><h5>' + aiResponse.message + '</h5></div>').promise().done(function() {
                app.speak(aiResponse.message, locale);
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
        var words = text.toLowerCase().split(' ');
        var uri = '';
        var responseData = null;

        if(words[0] === 'search') {
            if(words[1] === 'for') {
                if(words[2] !== undefined || words[2] !== null) {
                    uri = app.searchWeb('google', getPhrase(words, 2));

                    responseData = {
                        message: 'This is what I found on Google.',
                        data: {
                            link: uri
                        }
                    };
                } else {
                    responseData = {
                        message: 'Sorry. What was that again?'
                    };
                }
            } else if(words[1] !== '') {
                if(words[2] === 'for') {
                    if(words[3] !== undefined || words[3] !== null) {
                        uri = app.searchWeb(words[1], getPhrase(words, 3));

                        responseData = {
                            message: 'This is what I found on ' + ucfl(words[1]) + '.',
                            data: {
                                link: uri
                            }
                        };
                    } else {
                        responseData = {
                            message: 'Sorry. What was that again?'
                        };
                    }
                } else {
                    responseData = {
                        message: 'Sorry. What was that again?'
                    };
                }
            } else {
                responseData = {
                    message: 'Sorry. What was that again?'
                };
            }
        } else {
            responseData = {
                message: 'Sorry. What was that again?'
            };
        }

        return responseData;
    },
    searchWeb: function(where, what) {
        var link = false;

        switch(where.toLowerCase()) {
            case 'google':
                link = 'https://www.google.com/?gfe_rd=cr&ei=YhRdWcSMH7TEXvz8nqAN&gws_rd=ssl#q=' + encodeURI(what)

                break;
            case 'yahoo':
                link = 'https://search.yahoo.com/search;_ylt=AwrwNF2SJF1ZjJ0AA0izRwx.;_ylc=X1MDMjExNDczNDAwMwRfcgMyBGZyA3lmcC10LTcxMQRncHJpZANQdFRYSUVWa1FfV3E3TzFLS1lnUnBBBG5fcnNsdAMwBG5fc3VnZwMwBG9yaWdpbgNwaC5zZWFyY2gueWFob28uY29tBHBvcwMwBHBxc3RyAwRwcXN0cmwDBHFzdHJsAzM5BHF1ZXJ5A3lhaG9vJTIwc2VhcmNoJTIwYXBpJTIwZm9yJTIwamF2YXNjcmlwdAR0X3N0bXADMTQ5OTI3NjQ0Mw--?p=' + encodeURI(what);

                break;
            default:
                link = false;

                break;
        }

        if(link !== false) {
            window.open(link, '_self', 'location=no');
        }

        return link;
    },
    google_search: function(what) {
        $.ajax({
            url: 'https://www.googleapis.com/customsearch/v1',
            method: 'GET',
            data: {
                key: googleApiKey,
                cx: googleCustomSearchID,
                q: what
            },
            dataType: 'json',
            success: function(response) {
                alert(response);
            }
        });

        return false;
    }
};

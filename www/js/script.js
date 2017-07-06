function objectLength(obj) {
    return Object.keys(obj).length;
}

function objectKeyExists(obj, key) {
    return obj.hasOwnProperty(key);
}

function showLoader() {
    $('.ttmLoader').fadeIn(250);
}

function hideLoader() {
    $('.ttmLoader').fadeOut(250);
}

function ucfl(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

function getPhrase(words, start) {
    var phrase = '';

    for(var i = start; i < words.length; i++) {
        phrase += words[i];

        if(i !== words.length - 1) {
            phrase += ' ';
        }
    }

    return phrase;
}

var googleApiKey = 'AIzaSyCe5mqPweAAxOSjvllzxjWtN3re9Lp1a0Y';
var googleCustomSearchID = '004632487785828615457:xl5mketijie';

// declaration of variables
const form = document.getElementById('form');
const submit = document.getElementById('submit');
const play = document.getElementById('play');
const pause = document.getElementById('pause');
const stopped = document.getElementById('stop');
const counter = document.getElementById('counter');
let player, url;
// END declaration of variables

// Loads the IFrame Player API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// END Loads the IFrame Player API

// this function embeds a YouTube player on the website
function embedVideo(e) {
    play.className='invisible';
    pause.className='invisible';
    stopped.className='invisible';
    counter.className='invisible';
    
    e.preventDefault();

    if (player) {
        clearInterval(time);
        player.destroy();
    }

    // creates YouTube player
    url = document.getElementById('videoId').value;
    var parsed = ytParser(url);

    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: { autoplay: 1 },
        videoId: parsed,
        events: {
            'onError': onPlayerError,
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    // END creates YouTube player
}
// END function

function onYouTubeIframeAPIReady() {

}

// this function validates the entered url or video id
function ytParser(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11,11}).*/;
    var match = url.match(regExp);
    if (match && match.length >= 2) {
        return match[2];
    } else return url;
}
// END function

// this function is performed if video is not available
function onPlayerError(event) {
    if (event.data == 2) {
        play.className='invisible';
        pause.className='invisible';
        stopped.className='invisible';
        counter.className='invisible';
        
        player.destroy();
        alert("Nie ma takiego filmu!");
    }
}
// END funtion

// this functions is performed when the video starts
function onPlayerReady() {
    play.className='';
    stopped.className='';
    player.playVideo();
}

function playVideo() {
    play.className='invisible';
    pause.className='';
    player.playVideo();
}
//END functions

// this function is performed when the video is paused
function pauseVideo() {
    play.className='';
    pause.className='invisible';
    clearInterval(time);
    player.pauseVideo();
}
// END function

// this function is performed when the video is stopped
function stopVideo() {
    play.className='';
    pause.className='invisible';
    clearInterval(time);
    player.stopVideo();
    counter.innerHTML = "00:00:00";
}
// END function

// the API calls this function when the player's state changes
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        playVideo();
        counter.className='';
        time = setInterval(saveTime, 1000);
    }

    if (event.data == YT.PlayerState.PAUSED) {
        pauseVideo();
    }

    if (event.data == YT.PlayerState.ENDED) {
        play.className='';
        pause.className='invisible';
        clearInterval(time);
    }
}
// END function

// this function that calculates the remaining time until the end of the video
function saveTime() {
    if (YT.PlayerState.PLAYING) {
        durationTime = parseInt(player.getDuration());
        currentTime = parseInt(player.getCurrentTime());
        distance = durationTime - currentTime;
        hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
        minutes = Math.floor((distance % (60 * 60)) / (60));
        seconds = Math.floor((distance % (60)));
        counter.innerHTML = ((hours>9) ? hours : "0" + hours) + ":" + ((minutes>9) ? minutes : "0" + minutes) + ":" + ((seconds>9) ? seconds : "0" + seconds);
    }
}
// END function

// event observers
form.addEventListener('submit', embedVideo, false);
play.addEventListener('click', playVideo, false);
pause.addEventListener('click', pauseVideo, false);
stopped.addEventListener('click', stopVideo, false);
// END event observers
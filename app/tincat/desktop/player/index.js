window.onload = function()
{
    var index = location.href.indexOf("url=");
    var url = decodeURIComponent(location.href.substring(index + 4));
    console.log("url = " + url);

    var source = document.querySelector("#source");
    source.src = url;

    var player = videojs("player");
    player.play();
};
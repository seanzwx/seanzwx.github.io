(function()
{
    if(!window.vidcat)
    {
        window.vidcat = {};
    }

    window.vidcat.hasVideo = function()
    {
        var video = document.querySelector("video");
        if(video)
        {
            return true;
        }
        return false;
    };
})();
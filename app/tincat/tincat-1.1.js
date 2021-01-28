(function()
{
    if(!window.tincat)
    {
        window.tincat = {};
    }

    /** 改变返回 **/
    if(!window.tincat.historyGo)
    {
        window.tincat.historyGo = window.history.go;

        window.history.back = function()
        {
            window.TincatPlusNative.back();
        };
        window.history.go = function(numberOrUrl)
        {
            if(!isNaN(numberOrUrl))
            {
                if(numberOrUrl < 0)
                {
                    window.TincatPlusNative.back();
                    return;
                }
            }
            window.tincat.historyGo(numberOrUrl);
        }
    }

    /** 自动填充 **/
    window.tincat.autofill = function(usernameValue, passwordValue)
    {
        var username = document.querySelector("input[id=username]");
        if(!username)
        {
            username = document.querySelector("input[name=username]");
        }
        if(!username)
        {
            username = document.querySelector("input");
        }
        var password = document.querySelector("input[type=password]");

        if(password)
        {
            if(username)
            {
                username.value = usernameValue;
            }

            if(password)
            {
                password.value = passwordValue;
                password.focus();
            }
        }
    };

    /** 全局长按 **/
    document.body.ontouchstart = function(e)
    {
        window.tincat.touchDomHref = null;
        var dom = e.target;
        var a = null;
        while(true)
        {
            if(dom.tagName.toLowerCase() === "body")
            {
                break;
            }
            if(dom.tagName.toLowerCase() === "a")
            {
                a = dom;
                break;
            }

            dom = dom.parentNode;
        }

        var link = null;
        if(a && a.href)
        {
            if(a.href.toLowerCase().indexOf("javascript") !== 0)
            {
                link = a.href;
            }
        }

        window.tincat.touchDomHref = link;
    };
    window.tincat.getTouchDomHref = function()
    {
        var data = {
            "touchDomHref": window.tincat.touchDomHref
        };
        return data;
    };

    /** 媒体资源抓取 **/
    window.tincat.selectResources = function()
    {
        window.extractor.extract(function(videoList)
        {
            var videoArray = new Array();
            var imageArray = new Array();
            var audioArray = new Array();

            for(var i = 0; i < videoList.length; i++)
            {
                var video = videoList[i];
                videoArray.push({
                    url: video.url,
                    quality: video.quality,
                    preciseVideo: true
                });
            }

            var documents = [document];
            var iframes = document.querySelectorAll("iframe");
            for(var i = 0; i < iframes.length; i++)
            {
                try
                {
                    if(iframes[i].contentDocument)
                    {
                        documents.push(iframes[i].contentDocument);
                    }
                }
                catch(e)
                {
                    if(e)
                    {
                        console.log(JSON.stringify(e));
                    }
                }
            }

            for(var k = 0; k < documents.length; k++)
            {
                var doc = documents[k];

                var videos = doc.querySelectorAll("video");
                for(var i = 0; i < videos.length; i++)
                {
                    var video = videos[i];
                    if(video.src && video.src.indexOf("http") === 0)
                    {
                        videoArray.push({
                            url: video.src
                        });
                    }

                    var sources = video.querySelectorAll("source");
                    for(var j = 0; j < sources.length; j++)
                    {
                        var source = sources[j];
                        if(source.src && source.src.indexOf("http") === 0)
                        {
                            videoArray.push({
                                url: source.src
                            });
                        }
                    }
                }

                var imgs = doc.querySelectorAll("img");
                for(var i = 0; i < imgs.length; i++)
                {
                    var img = imgs[i];
                    if(img.src && img.src.indexOf("http") === 0)
                    {
                        imageArray.push({
                            url: img.src
                        });
                    }
                }

                var audios = doc.querySelectorAll("audio");
                for(var i = 0; i < audios.length; i++)
                {
                    var audio = audios[i];
                    if(audio.src && audio.src.indexOf("http") === 0)
                    {
                        audioArray.push({
                            url: audio.src
                        });
                    }

                    var sources = audio.querySelectorAll("source");
                    for(var j = 0; j < sources.length; j++)
                    {
                        var source = sources[j];
                        if(source.src && source.src.indexOf("http") === 0)
                        {
                            audioArray.push({
                                url: source.src
                            });
                        }
                    }
                }
            }

            var data = {
                videoArray: videoArray,
                imageArray: imageArray,
                audioArray: audioArray
            };
            window.TincatPlusNative.onMediaResourceExtract(JSON.stringify(data));
        });
    };
})();
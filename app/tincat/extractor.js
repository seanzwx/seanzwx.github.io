(function()
{
    if(!window.tincat)
    {
        window.tincat = {};
    }

    window.tincat.extractVideos = function(callback)
    {
        var host = location.host;
        var videoList = [];

        if(host.indexOf("pornhub.com") >= 0)
        {
            for(var key in window)
            {
                if(key.indexOf("flashvars") === 0)
                {
                    var flashvars = window[key];
                    var mediaDefinitions = flashvars.mediaDefinitions;
                    if(mediaDefinitions)
                    {
                        for(var i = 0; i < mediaDefinitions.length; i++)
                        {
                            var it = mediaDefinitions[i];
                            if(it.videoUrl)
                            {
                                if("hls" === it.format && "hls" !== it.quality)
                                {
                                    videoList.push({
                                        quality: it.quality + "P",
                                        url: it.videoUrl
                                    });
                                }
                            }
                        }
                    }
                }
            }

            callback(videoList);
            return;
        }

        if(host.indexOf("xvideos.com") >= 0 || host.indexOf("xnxx.com") >= 0)
        {
            if(html5player && html5player.url_hls)
            {
                var url_hls = html5player.url_hls;
                $.ajax({
                    url: url_hls,
                    type: "get",
                    success: function(jsonstr)
                    {
                        try
                        {
                            var index = url_hls.lastIndexOf("/");
                            var baseUrl = url_hls.substring(0, index) + "/";

                            var lines = jsonstr.split("\n");
                            for(var i = 0; i < lines.length; i++)
                            {
                                var line = lines[i];
                                if(line)
                                {
                                    if(line.indexOf("#") === 0)
                                    {
                                        continue;
                                    }

                                    videoList.push({
                                        quality: line.split(".")[0].split("-")[1].toUpperCase(),
                                        url: baseUrl + line
                                    });
                                }
                            }
                            callback(videoList);
                        }
                        catch(e)
                        {
                            callback(videoList);
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown)
                    {
                        callback(videoList);
                    },
                });
            }
            else
            {
                callback(videoList);
            }
            return;
        }

        if(host.indexOf("spankbang.com") >= 0)
        {
            var video = $("#video");
            if(video)
            {
                var id = video.attr("data-streamkey");
                if(id)
                {
                    $.ajax({
                        url: "https://m.spankbang.com/api/videos/stream",
                        type: "post",
                        data: {
                            id: id
                        },
                        success: function(jsonstr)
                        {
                            try
                            {
                                for(var key in jsonstr)
                                {
                                    if(key.indexOf("m3u8") === 0 && key.indexOf("_") >= 0)
                                    {
                                        var videoArray = jsonstr[key];
                                        if(videoArray.length > 0)
                                        {
                                            videoList.push({
                                                quality: key.split("_")[1].toUpperCase(),
                                                url: videoArray[0]
                                            });
                                        }
                                    }
                                }

                                callback(videoList);
                            }
                            catch(e)
                            {
                                callback(videoList);
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown)
                        {
                            callback(videoList);
                        },
                    });
                }
            }

            return;
        }

        if(host.indexOf("facebook.com") >= 0)
        {
            try
            {
                var div = document.querySelectorAll("[data-sigil=inlineVideo]");
                for(var i = 0; i < div.length; i++)
                {
                    var it = div[i];
                    var dataStore = it.getAttribute("data-store");
                    if(dataStore)
                    {
                        var json = JSON.parse(dataStore);
                        if(json.src)
                        {
                            videoList.push({
                                url: json.src
                            });
                        }
                    }
                }

                callback(videoList);
            }
            catch(e)
            {
                callback(videoList);
            }
            return;
        }

        if(host.indexOf("dailymotion.com") >= 0)
        {
            var pathname = location.pathname;
            if(pathname.indexOf("/video/") === 0)
            {
                $.ajax({
                    url: "https://www.dailymotion.com/player/metadata" + pathname,
                    type: "get",
                    success: function(jsonstr)
                    {
                        var master = null;
                        try
                        {
                            var master = jsonstr.qualities.auto[0].url;
                        }
                        catch(e)
                        {
                            callback(videoList);
                            return;
                        }

                        $.ajax({
                            url: master,
                            type: "get",
                            success: function(jsonstr)
                            {
                                try
                                {
                                    var quality = "";
                                    var videoQuality = {};

                                    var lines = jsonstr.split("\n");
                                    for(var i = 0; i < lines.length; i++)
                                    {
                                        var line = lines[i];
                                        if(line === "")
                                        {
                                            continue;
                                        }

                                        if(line.indexOf("#EXT-X-STREAM-INF") === 0)
                                        {
                                            var tmp = line.split(",");
                                            for(var j = 0; j < tmp.length; j++)
                                            {
                                                var kv = tmp[j];
                                                if(kv.indexOf("NAME") === 0)
                                                {
                                                    quality = kv.split("=")[1].replace(/\"/g, "") + "P";
                                                }
                                            }
                                        }

                                        if(line.indexOf("#") !== 0)
                                        {
                                            videoQuality[quality] = line.trim();
                                        }
                                    }

                                    for(var key in videoQuality)
                                    {
                                        videoList.push({
                                            quality: key,
                                            url: videoQuality[key]
                                        });
                                    }
                                    callback(videoList);
                                }
                                catch(e)
                                {
                                    callback(videoList);
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown)
                            {
                                callback(videoList);
                            },
                        });
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown)
                    {
                        callback(videoList);
                    },
                });
            }
            else
            {
                callback(videoList);
            }
            return;
        }

        if(host.indexOf("vimeo.com") >= 0)
        {
            var div = document.querySelector("div[data-config-url]");
            if(div)
            {
                var configUrl = div.getAttribute("data-config-url");
                if(configUrl)
                {
                    var httpclient = new XMLHttpRequest();
                    httpclient.onreadystatechange = function()
                    {
                        if(httpclient.readyState == 4)
                        {
                            if(httpclient.status == 200)
                            {
                                var responseText = httpclient.responseText;
                                try
                                {
                                    var videoQuality = {};
                                    var data = JSON.parse(responseText);
                                    var progressive = data.request.files.progressive;
                                    for(var i = 0; i < progressive.length; i++)
                                    {
                                        var it = progressive[i];
                                        videoQuality[it.height + "P"] = it.url;
                                    }

                                    for(var key in videoQuality)
                                    {
                                        videoList.push({
                                            quality: key,
                                            url: videoQuality[key]
                                        });
                                    }
                                    callback(videoList);
                                }
                                catch(e)
                                {
                                    callback(videoList);
                                }
                            }
                            else
                            {
                                callback(videoList);
                            }
                        }
                    };
                    httpclient.open("GET", configUrl, true);
                    httpclient.send(null);
                    return;
                }
            }
            callback(videoList);
            return;
        }

        if(host.indexOf("twitter.com") >= 0)
        {
            if(!window.TincatPlusNative.getInterceptVideoList)
            {
                callback(videoList);
                return;
            }

            var interceptVideo = window.TincatPlusNative.getInterceptVideoList();
            interceptVideo = JSON.parse(interceptVideo);
            if(interceptVideo.length > 0)
            {
                var master;
                for(var i = 0; i < interceptVideo.length; i++)
                {
                    var url = interceptVideo[i];
                    var tmp = url.split("/");
                    for(var j = 0; j < tmp.length; j++)
                    {
                        if(tmp[j] === "pl")
                        {
                            var next = tmp[j + 1];
                            if(next.indexOf("m3u8") >= 0)
                            {
                                master = url;
                                break;
                            }
                        }
                    }
                }
                if(master)
                {
                    var httpclient = new XMLHttpRequest();
                    httpclient.onreadystatechange = function()
                    {
                        if(httpclient.readyState == 4)
                        {
                            if(httpclient.status == 200)
                            {
                                try
                                {
                                    var quality;
                                    var lines = httpclient.responseText.split("\n");
                                    for(var i = 0; i < lines.length; i++)
                                    {
                                        var line = lines[i];
                                        if(line === "")
                                        {
                                            continue;
                                        }

                                        if(line.indexOf("#EXT-X-STREAM-INF") === 0)
                                        {
                                            var tmp = line.split(",");
                                            for(var j = 0; j < tmp.length; j++)
                                            {
                                                var kv = tmp[j];
                                                if(kv.indexOf("RESOLUTION") === 0)
                                                {
                                                    quality = kv.split("=")[1];
                                                }
                                            }
                                        }

                                        if(line.indexOf("#") !== 0)
                                        {
                                            videoList.push({
                                                quality: quality,
                                                url: "https://video.twimg.com" + line.trim()
                                            });
                                        }
                                    }
                                    callback(videoList);
                                }
                                catch(e)
                                {
                                    callback(videoList);
                                }
                            }
                            else
                            {
                                callback(videoList);
                            }
                        }
                    };
                    httpclient.open("GET", master, true);
                    httpclient.send(null);
                    return;
                }
            }
            callback(videoList);
            return;
        }

        callback(videoList);
    };
})();
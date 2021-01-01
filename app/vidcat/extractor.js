(function()
{
    if(!window.vidcat)
    {
        window.vidcat = {};
    }

    var responseVideoList = function(callback, videoList)
    {
        if(!videoList)
        {
            videoList = [];
        }
        callback(videoList);
    };

    var extractM3U8Master = function(masterUrl, callback)
    {
        console.log("master地址:" + masterUrl);
        if(!masterUrl)
        {
            responseVideoList(callback);
            return;
        }

        var httpclient = new XMLHttpRequest();
        httpclient.onreadystatechange = function()
        {
            if(httpclient.readyState == 4)
            {
                if(httpclient.status != 200)
                {
                    responseVideoList(callback);
                    return;
                }

                try
                {
                    console.log(httpclient.responseText);
                    var isMaster = false;
                    var videoList = [];
                    var quality;
                    var lines = httpclient.responseText.split("\n");

                    for(var i = 0; i < lines.length; i++)
                    {
                        var line = lines[i].trim();
                        if(line === "")
                        {
                            continue;
                        }

                        if(line.indexOf("#EXT-X-STREAM-INF") === 0)
                        {
                            isMaster = true;

                            var tmp = line.split(",");
                            for(var j = 0; j < tmp.length; j++)
                            {
                                var kv = tmp[j].trim();
                                if(kv.toUpperCase().indexOf("RESOLUTION") === 0)
                                {
                                    quality = kv.split("=")[1].trim();
                                }
                            }
                        }

                        if(line.indexOf("#") !== 0)
                        {
                            var masterURL = new URL(masterUrl);
                            var m3u8Url = line;
                            var url = null;

                            if(m3u8Url.indexOf("http") === 0)
                            {
                                url = m3u8Url;
                            }
                            else if(m3u8Url.indexOf("/") === 0)
                            {
                                url = masterURL.protocol + "//" + masterURL.host + m3u8Url;
                            }
                            else
                            {
                                url = masterURL.protocol + "//" + masterURL.host;
                                var tmp = masterURL.pathname.split("/");
                                for(var j = 0; j < tmp.length - 1; j++)
                                {
                                    url += tmp[j] + "/";
                                }
                                url += m3u8Url;
                            }

                            if(!quality)
                            {
                                quality = "unknown";
                            }
                            if(quality.toLowerCase().indexOf("x") !== -1)
                            {
                                quality = quality.toLowerCase().split("x")[1].trim() + "P";
                            }

                            videoList.push({
                                quality: quality,
                                url: url
                            });
                        }
                    }

                    if(isMaster)
                    {
                        responseVideoList(callback, videoList);
                    }
                    else
                    {
                        responseVideoList(callback, [{
                            url: masterUrl,
                            quality: "unknown"
                        }]);
                    }
                }
                catch(e)
                {
                    console.log(e);
                    responseVideoList(callback);
                }
            }
        };
        httpclient.open("GET", masterUrl, true);
        httpclient.send(null);
    };

    var extractM3U8 = function(callback)
    {
        var host = location.host;

        if(host.indexOf("pornhub.com") >= 0)
        {
            try
            {
                var videoList = [];
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
                responseVideoList(callback, videoList);
            }
            catch(e)
            {
                responseVideoList(callback);
            }
            return;
        }

        if(host.indexOf("xvideos.com") >= 0 || host.indexOf("xnxx.com") >= 0)
        {
            if(!html5player || !html5player.url_hls)
            {
                responseVideoList(callback);
                return;
            }

            extractM3U8Master(html5player.url_hls, callback);
            return;
        }

        if(host.indexOf("spankbang.com") >= 0)
        {
            if(!stream_data || !stream_data.m3u8)
            {
                responseVideoList(callback);
                return;
            }

            extractM3U8Master(stream_data.m3u8, callback);
            return;
        }

        if(host.indexOf("facebook.com") >= 0)
        {
            try
            {
                var videoList = [];
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
                responseVideoList(callback, videoList);
            }
            catch(e)
            {
                responseVideoList(callback);
            }
            return;
        }

        if(host.indexOf("dailymotion.com") >= 0)
        {
            var pathname = location.pathname;
            if(pathname.indexOf("/video/") !== 0)
            {
                responseVideoList(callback);
                return;
            }

            var httpclient = new XMLHttpRequest();
            httpclient.onreadystatechange = function()
            {
                if(httpclient.readyState == 4)
                {
                    if(httpclient.status == 200)
                    {
                        try
                        {
                            var data = JSON.parse(httpclient.responseText);
                            var master = data.qualities.auto[0].url;
                            extractM3U8Master(master, callback);
                        }
                        catch(e)
                        {
                            responseVideoList(callback);
                        }
                    }
                    else
                    {
                        responseVideoList(callback);
                    }
                }
            };
            var url = "https://www.dailymotion.com/player/metadata" + pathname;
            httpclient.open("GET", url, true);
            httpclient.send(null);
            return;
        }

        if(host.indexOf("vimeo.com") >= 0)
        {
            var div = document.querySelector("div[data-config-url]");
            if(!div)
            {
                responseVideoList(callback);
                return;
            }

            var configUrl = div.getAttribute("data-config-url");
            var httpclient = new XMLHttpRequest();
            httpclient.onreadystatechange = function()
            {
                if(httpclient.readyState == 4)
                {
                    if(httpclient.status == 200)
                    {
                        try
                        {
                            var videoList = [];
                            var videoQuality = {};
                            var data = JSON.parse(httpclient.responseText);
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
                            responseVideoList(callback, videoList);
                        }
                        catch(e)
                        {
                            responseVideoList(callback);
                        }
                    }
                    else
                    {
                        responseVideoList(callback);
                    }
                }
            };
            httpclient.open("GET", configUrl, true);
            httpclient.send(null);
            return;
        }

        if(host.indexOf("metacafe.com") >= 0)
        {
            var video = document.querySelector("video");
            if(!video)
            {
                responseVideoList(callback);
                return;
            }

            extractM3U8Master(video.src, callback);
            return;
        }

        if(host.indexOf("lang.live") >= 0)
        {
            var pathname = location.pathname;
            if(pathname.indexOf("/room/") !== 0)
            {
                responseVideoList(callback);
                return;
            }

            var roomId = pathname.split("/")[2];
            var url = "https://langapi.lv-show.com/langweb/v1/room/liveinfo?room_id=" + roomId;
            var httpclient = new XMLHttpRequest();
            httpclient.onreadystatechange = function()
            {
                if(httpclient.readyState == 4)
                {
                    if(httpclient.status == 200)
                    {
                        try
                        {
                            var data = JSON.parse(httpclient.responseText);
                            var master = data.data.live_info.liveurl_hls;
                            extractM3U8Master(master, callback);
                        }
                        catch(e)
                        {
                            responseVideoList(callback);
                        }
                    }
                    else
                    {
                        responseVideoList(callback);
                    }
                }
            };
            httpclient.open("GET", url, true);
            httpclient.send(null);
            return;
        }

        if(host.indexOf("xhamster") >= 0)
        {
            try
            {
                var master = location.protocol + "//" + location.hostname + window.initials.xplayerSettings.sources.hls.fallback;
                extractM3U8Master(master, callback);
            }
            catch(e)
            {
                responseVideoList(callback);
            }
            return;
        }

        responseVideoList(callback);
    };

    window.vidcat.extractVideos = function(callback)
    {
        extractM3U8(callback);
    };
})();
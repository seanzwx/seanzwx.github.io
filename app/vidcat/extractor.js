(function()
{
    if(!window.vidcat)
    {
        window.vidcat = {};
    }
    var Native = window.VidcatPlusNative;

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
                    var sortable = false;
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
                                sortable = true;
                            }
                            else
                            {
                                sortable = false;
                            }
                            var exists = false;
                            for(var j = 0; j < videoList.length; j++)
                            {
                                var it = videoList[j];
                                if(it.quality === quality)
                                {
                                    exists = true;
                                    break;
                                }
                            }
                            if(!exists)
                            {
                                videoList.push({
                                    quality: quality,
                                    url: url
                                });
                            }
                        }
                    }

                    if(isMaster)
                    {
                        if(videoList.length > 1 && sortable)
                        {
                            for(i = 0; i < videoList.length - 1; i++)
                            {
                                for(j = 0; j < videoList.length - 1 - i; j++)
                                {
                                    var curr = parseInt(videoList[j].quality.replace("P", ""));
                                    var next = parseInt(videoList[j + 1].quality.replace("P", ""));
                                    if(curr < next)
                                    {
                                        var temp = videoList[j];
                                        videoList[j] = videoList[j + 1];
                                        videoList[j + 1] = temp;
                                    }
                                }
                            }
                        }
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

    window.vidcat.extractVideos = function(callback)
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

            $.ajax({
                url: "https://www.dailymotion.com/player/metadata" + pathname,
                type: "get",
                success: function(jsonstr)
                {
                    try
                    {
                        var master = jsonstr.qualities.auto[0].url;
                        extractM3U8Master(master, callback);
                    }
                    catch(e)
                    {
                        responseVideoList(callback);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown)
                {
                    responseVideoList(callback);
                },
            });
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

        if(host.indexOf("twitter.com") >= 0)
        {
            if(!Native.getInterceptVideoList)
            {
                responseVideoList(callback);
                return;
            }

            var interceptVideo = Native.getInterceptVideoList();
            interceptVideo = JSON.parse(interceptVideo);
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
            extractM3U8Master(master, callback);
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

        if(host.indexOf("twitch.tv") >= 0)
        {
            if(!Native.getInterceptVideoList)
            {
                responseVideoList(callback);
                return;
            }

            var interceptVideo = Native.getInterceptVideoList();
            interceptVideo = JSON.parse(interceptVideo);
            var videoId = location.pathname.replace("/", "") + ".m3u8";
            var master;
            for(var i = 0; i < interceptVideo.length; i++)
            {
                var url = interceptVideo[i];
                if(url.indexOf(videoId) > 0)
                {
                    master = url;
                    break;
                }
            }
            extractM3U8Master(master, callback);
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

        responseVideoList(callback);
    };
})();
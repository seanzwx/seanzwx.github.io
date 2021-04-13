(function()
{
    window.extractor = {
        responseVideoList: function(callback, videoList)
        {
            if(!videoList)
            {
                videoList = [];
            }
            callback(videoList);
        },

        getFullUrl: function(baseUrl, url)
        {
            var base = new URL(baseUrl);

            if(url.indexOf("http") === 0)
            {
                return url;
            }
            else if(url.indexOf("/") === 0)
            {
                var fullUrl = base.protocol + "//" + base.host;
                if(base.port)
                {
                    fullUrl += ":" + base.port;
                }
                return fullUrl + url;
            }
            else
            {
                var fullUrl = base.protocol + "//" + base.host;
                if(base.port)
                {
                    fullUrl += ":" + base.port;
                }
                fullUrl += base.pathname;

                var index = fullUrl.lastIndexOf("/");
                fullUrl = fullUrl.substring(0, index) + "/" + url;
                return fullUrl;
            }
        },

        httpGet: function(callback, url, response)
        {
            console.log("解析 -> 发起http请求:" + url);
            if(!url)
            {
                window.extractor.responseVideoList(callback);
                return;
            }

            var httpclient = new XMLHttpRequest();
            httpclient.onreadystatechange = function()
            {
                if(httpclient.readyState == 4)
                {
                    if(httpclient.status == 200)
                    {
                        console.log("解析 -> http请求响应:\n" + httpclient.responseText);
                        try
                        {
                            response(httpclient.responseText);
                        }
                        catch(e)
                        {
                            console.log("解析 -> http响应执行错误:" + e);
                            window.extractor.responseVideoList(callback);
                        }
                    }
                    else
                    {
                        console.log("解析 -> http请求失败:\n" + httpclient.responseText);
                        window.extractor.responseVideoList(callback);
                    }
                }
            };
            httpclient.open("GET", url, true);
            httpclient.send(null);
        },

        extractM3U8Master: function(masterUrl, callback)
        {
            masterUrl = window.extractor.getFullUrl(location.href, masterUrl);

            console.log("解析 -> m3u8 master:" + masterUrl);
            if(!masterUrl)
            {
                window.extractor.responseVideoList(callback);
                return;
            }

            window.extractor.httpGet(callback, masterUrl, function(responseText)
            {
                var isMaster = false;
                var videoList = [];
                var quality;
                var lines = responseText.split("\n");

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
                            url: window.extractor.getFullUrl(masterUrl, line)
                        });
                    }
                }

                if(isMaster)
                {
                    window.extractor.responseVideoList(callback, videoList);
                }
                else
                {
                    window.extractor.responseVideoList(callback, [{
                        url: masterUrl,
                        quality: "unknown"
                    }]);
                }
            });
        },

        extract: function(callback)
        {
            var host = location.host;

            try
            {
                if(host.indexOf("youtube.com") >= 0)
                {
                    alert("Unable to download videos due to youtube policy. You can send an email to us and we will help you.");
                    return;
                }

                if(host.indexOf("pornhub.com") >= 0)
                {
                    var flashVarsKey;
                    for(var key in window)
                    {
                        if(key.indexOf("flashvars") === 0)
                        {
                            flashVarsKey = key;
                            break;
                        }
                    }

                    var videoUrl;
                    for(var i = 0; i < window[flashVarsKey].mediaDefinitions.length; i++)
                    {
                        var it = window[flashVarsKey].mediaDefinitions[i];
                        if(it.format === "hls")
                        {
                            videoUrl = it.videoUrl;
                            break;
                        }
                    }

                    if(!videoUrl)
                    {
                        window.extractor.responseVideoList(callback);
                        return;
                    }

                    window.extractor.httpGet(callback, videoUrl, function(responseText)
                    {
                        var videoList = [];
                        var array = JSON.parse(responseText);
                        for(var i = 0; i < array.length; i++)
                        {
                            var it = array[i];
                            if(it.videoUrl)
                            {
                                videoList.push({
                                    url: it.videoUrl,
                                    quality: it.quality + "P"
                                });
                            }
                        }
                        window.extractor.responseVideoList(callback, videoList);
                    });
                    return;
                }

                if(host.indexOf("xvideos.com") >= 0 || host.indexOf("xnxx.com") >= 0)
                {
                    window.extractor.extractM3U8Master(html5player.url_hls, callback);
                    return;
                }

                if(host.indexOf("spankbang.com") >= 0)
                {
                    window.extractor.extractM3U8Master(stream_data.m3u8[0], callback);
                    return;
                }

                if(host.indexOf("facebook.com") >= 0)
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
                    window.extractor.responseVideoList(callback, videoList);
                    return;
                }

                if(host.indexOf("dailymotion.com") >= 0)
                {
                    var pathname = location.pathname;
                    if(pathname.indexOf("/video/") !== 0)
                    {
                        window.extractor.responseVideoList(callback);
                        return;
                    }

                    var url = "https://www.dailymotion.com/player/metadata" + pathname;
                    window.extractor.httpGet(callback, url, function(responseText)
                    {
                        var data = JSON.parse(responseText);
                        var master = data.qualities.auto[0].url;
                        window.extractor.extractM3U8Master(master, callback);
                    });
                    return;
                }

                if(host.indexOf("vimeo.com") >= 0)
                {
                    var div = document.querySelector("div[data-config-url]");
                    var url = div.getAttribute("data-config-url");
                    window.extractor.httpGet(callback, url, function(responseText)
                    {
                        var videoList = [];
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
                        window.extractor.responseVideoList(callback, videoList);
                    });
                    return;
                }

                if(host.indexOf("metacafe.com") >= 0)
                {
                    var video = document.querySelector("video");
                    window.extractor.extractM3U8Master(video.src, callback);
                    return;
                }

                if(host.indexOf("lang.live") >= 0)
                {
                    var pathname = location.pathname;
                    if(pathname.indexOf("/room/") !== 0)
                    {
                        window.extractor.responseVideoList(callback);
                        return;
                    }

                    var roomId = pathname.split("/")[2];
                    var url = "https://langapi.lv-show.com/langweb/v1/room/liveinfo?room_id=" + roomId;
                    window.extractor.httpGet(callback, url, function(responseText)
                    {
                        var data = JSON.parse(responseText);
                        var master = data.data.live_info.liveurl_hls;
                        window.extractor.extractM3U8Master(master, callback);
                    });
                    return;
                }

                if(host.indexOf("xhamster") >= 0)
                {
                    var master = window.initials.xplayerSettings.sources.hls.fallback;
                    window.extractor.extractM3U8Master(master, callback);
                    return;
                }

                if(host.indexOf("chaturbate.com") >= 0)
                {
                    var master = JSON.parse(window.initialRoomDossier).hls_source;
                    window.extractor.extractM3U8Master(master, callback);
                    return;
                }

                if(host.indexOf("youporn.com") >= 0)
                {
                    var videoList = [];
                    var mediaDefinition = page_params.videoPlayer.mediaDefinition;
                    for(var i = 0; i < mediaDefinition.length; i++)
                    {
                        var it = mediaDefinition[i];
                        videoList.push({
                            quality: it.quality + "P",
                            url: it.videoUrl
                        });
                    }
                    window.extractor.responseVideoList(callback, videoList);
                    return;
                }

                if(host.indexOf("redtube.com") >= 0)
                {
                    var videoId = document.querySelector("#redtube-player").getAttribute("data-video-id");
                    var mediaDefinition = page_params.video_player_setup["playerDiv_" + videoId].playervars.mediaDefinitions;
                    var videoList = [];
                    for(var i = 0; i < mediaDefinition.length; i++)
                    {
                        var it = mediaDefinition[i];
                        if("hls" === it.format)
                        {
                            videoList.push({
                                quality: it.quality + "P",
                                url: it.videoUrl
                            });
                        }
                    }
                    window.extractor.responseVideoList(callback, videoList);
                    return;
                }

                if(host.indexOf("vidio.com") >= 0)
                {
                    if(location.href.indexOf("vidio.com/live") >= 0)
                    {
                        var videoId = document.querySelector("meta[data-id]").getAttribute("data-id");
                        var url = "https://m.vidio.com/live/" + videoId + "/tokens";
                        window.extractor.httpGet(callback, url, function(responseText)
                        {
                            var data = JSON.parse(responseText);
                            var master = document.querySelector("[data-vjs-clip-hls-url]").getAttribute("data-vjs-clip-hls-url");
                            var master = master + "?" + data.token;
                            window.extractor.extractM3U8Master(master, callback);
                        });
                    }
                    else
                    {
                        var master = document.querySelector("[data-vjs-clip-hls-url]").getAttribute("data-vjs-clip-hls-url");
                        window.extractor.extractM3U8Master(master, callback);
                    }
                    return;
                }
            }
            catch(e)
            {
                console.log(e);
                window.extractor.responseVideoList(callback);
                return;
            }

            window.extractor.responseVideoList(callback);
        }
    };

    var test = false;
    if(test)
    {
        window.extractor.extract(function(videoList)
        {
            console.log(JSON.stringify(videoList, null, 3));
        });
    }
})();
(function()
{
    window.tincat.extractVideos = function(callback)
    {
        var host = location.href.replace("http://", "").replace("https://", "").split("/")[0];
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

        callback(videoList);
    };
})();
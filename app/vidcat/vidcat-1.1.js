(function()
{
    if(!window.vidcat)
    {
        window.vidcat = {};
    }

    /** 视频资源抓取 **/
    window.vidcat.selectVideos = function()
    {
        window.extractor.extract(function(videoList)
        {
            var videoArray = new Array();

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
            }

            var data = {
                videoArray: videoArray
            };
            window.VidcatPlusNative.onMediaResourceExtract(JSON.stringify(data));
        });
    };
})();
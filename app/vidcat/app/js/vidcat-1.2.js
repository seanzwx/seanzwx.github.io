(function()
{
    var enableAdBlocker = "${EnableAdBlocker}";

    if(!window.vidcat)
    {
        window.vidcat = {};
    }

    /** 开启adblocker **/
    if("true" === enableAdBlocker)
    {
        var defRules = [
            "iframe[src*='pos.baidu.com']",
            "iframe[src*='amazon-adsystem.com']"
        ];
        var siteRules = {
            ".baidu.com": [".fengchao-banner", ".top-ad-beneath-title", ".detail-bottom-ad", ".n-item-ad", ".ad-item"]
        };

        var classes = "";
        for(var i = 0; i < defRules.length; i++)
        {
            classes += defRules[i] + "{display:none !important}";
        }
        var host = location.hostname;
        for(var key in siteRules)
        {
            if(host.indexOf(key) > -1)
            {
                var rules = siteRules[key];
                for(var i = 0; i < rules.length; i++)
                {
                    classes += rules[i] + "{display:none !important}";
                }
            }
        }

        console.log(classes);
        var style = document.createElement("style");
        style.innerHTML = classes;
        document.getElementsByTagName("HEAD").item(0).appendChild(style);
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
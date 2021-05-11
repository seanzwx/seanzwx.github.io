(function()
{
    var enableAdBlocker = "${EnableAdBlocker}";

    if(!window.tincat)
    {
        window.tincat = {};
    }

    /** 开启adblocker **/
    if("true" === enableAdBlocker)
    {
        var defRules = [
            "iframe[src*='pos.baidu.com']"
        ];

        var classes = "";
        for(var i = 0; i < defRules.length; i++)
        {
            classes += defRules[i] + "{display:none !important}";
        }
        var style = document.createElement("style");
        style.innerHTML = classes;
        document.getElementsByTagName("HEAD").item(0).appendChild(style);
    }
})();
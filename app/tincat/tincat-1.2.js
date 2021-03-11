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
        var sites = [
            {
                title: "y2mate",
                hosts: ["www.y2mate.com"],
                rules: [
                    "#adInstallAndroid",
                    "#ads_spot1",
                    ".navbar",
                    ".box-guide",
                    ".ads-social-box",
                    "iframe",
                    ".homepage-grid",
                    ".hidden-md",
                    ".ads-place-download"
                ]
            },
            {
                title: "xnxx",
                hosts: ["www.xnxx.com"],
                rules: [
                    "#x-home-messages",
                    "#content-ad-top-zone-contener",
                    "#cookies-use-alert",
                    "#ad-footer",
                    "#ad-header-mobile-contener",
                    ".thumb-ad"
                ]
            },
            {
                title: "xvideos",
                hosts: ["www.xvideos.com"],
                rules: [
                    "#x-messages",
                    "#ad-footer",
                    "#x-x-messages-btn",
                    "#subs-home-toggle-cont",
                    "#ad-header-mobile-contener",
                    ".video-ad"
                ]
            },
            {
                title: "pornhub",
                hosts: ["www.pornhub.com"],
                rules: [
                    ".adContainer"
                ]
            },
            {
                title: "spankbang",
                hosts: ["m.spankbang.com"],
                rules: [
                    ".ptgncdn_holder"
                ]
            },
            {
                title: "redtube",
                hosts: ["www.redtube.com"],
                rules: [
                    ".adContainer"
                ]
            }
        ];

        var hosts = {};
        for(var i = 0; i < sites.length; i++)
        {
            var site = sites[i];
            for(var k = 0; k < site.hosts.length; k++)
            {
                hosts[site.hosts[k]] = site.rules;
            }
        }

        var classes = "";
        for(var i = 0; i < defRules.length; i++)
        {
            classes += defRules[i] + "{display:none !important}";
        }
        var host = location.href.replace("http://", "").replace("https://", "").split("/")[0];
        var rules = hosts[host];
        if(rules)
        {
            for(var i = 0; i < rules.length; i++)
            {
                classes += rules[i] + "{display:none !important}";
            }
        }
        var style = document.createElement("style");
        style.innerHTML = classes;
        document.getElementsByTagName("HEAD").item(0).appendChild(style);
    }
})();
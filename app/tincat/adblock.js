(function()
{
    var sites = [
        {
            title: "扎客",
            hosts: ["app.myzaker.com"],
            rules: [
                ".zk_top_barwrap",
                ".fixed-comment-bottom-bar",
                "iframe"
            ]
        },
        {
            title: "美团",
            hosts: ["i.meituan.com", "meishi.meituan.com"],
            rules: [
                ".banner-download",
            ]
        },
        {
            title: "爱奇艺",
            hosts: ["m.iqiyi.com"],
            rules: [
                ".ChannelHomeBanner_m-long-HDVideo_15nnb",
                ".header-app",
                ".c-guide-img",
                ".m-iqylink-diversion",
                ".hotWords-wrap"
            ]
        },
        {
            title: "好看视频",
            hosts: ["haokan.baidu.com"],
            rules: [
                ".navigation-download",
                ".open-app-top-banner",
                ".open-app-middle-banner",
                ".open-app-bottom",
                ".comment-open-app"
            ]
        },
        {
            title: "哔哩哔哩",
            hosts: ["m.bilibili.com"],
            rules: [
                ".index__openAppBtn__src-commonComponent-topArea-",
                ".index__container__src-commonComponent-bottomOpenApp-",
                ".index__svgaOpenAppBtn__src-videoPage-svgaOpenAppBtn-",
                ".index__downLoadBtn__src-videoPage-commentArea-",
                ".index__floatOpenBtn__src-videoPage-floatOpenBtn-",
                ".open-app-bar",
                ".bili-app"
            ]
        },
        {
            title: "网易",
            hosts: ["3g.163.com"],
            rules: [
                ".wap-header-wrap",
                ".wakeup_client"
            ]
        },
        {
            title: "优酷",
            hosts: ["m.youku.com"],
            rules: [
                ".h5-detail-guide",
                ".h5-detail-ad",
                ".Corner-container",
                ".smartBannerBtn",
                ".cmt-more-cont"
            ]
        },
        {
            title: "土豆",
            hosts: ["compaign.tudou.com"],
            rules: [
                "#footer-normal-download",
                ".header-btn",
                "#topbar-slider",
                ".td-h5__player__appguide"
            ]
        },
        {
            title: "途虎养车",
            hosts: ["wx.tuhu.cn"],
            rules: [
                ".wx_download",
                ".tcmlink"
            ]
        },
        {
            title: "影视大全",
            hosts: ["ys.km.com", "m.52qumao.com"],
            rules: [
                ".v_btn",
                ".js-run-app-btn",
                ".js-v-ivy",
                ".runApp",
                ".v_bottom_fixed_box",
                ".js-ivy-container"
            ]
        },
        {
            title: "唯品会",
            hosts: ["m.vip.com"],
            rules: [
                ".download-container",
                "#J-download-bar"
            ]
        },
        {
            title: "搜狐视频",
            hosts: ["m.tv.sohu.com"],
            rules: [
                ".js-app-topbanner",
                ".btn-xz-app",
                "#ad_banner",
                ".main-ad-view-box",
                ".btn-comment-app",
                ".js-bottom-app-btn"
            ]
        },
        {
            title: "腾讯视频",
            hosts: ["m.v.qq.com"],
            rules: [
                ".mod_source",
                ".mod_promotion",
                ".mod_game_rec",
                ".tvp_app_banner"
            ]
        },
        {
            title: "不得姐",
            hosts: ["m.budejie.com"],
            rules: [
                "#topBanner"
            ]
        },
        {
            title: "百度贴吧",
            hosts: ["tieba.baidu.com"],
            rules: [
                ".top-guide",
                ".appPromote",
                ".appBottomPromote"
            ]
        },
        {
            title: "知乎",
            hosts: ["www.zhihu.com"],
            rules: [
                ".HotBanner",
                ".ViewAllInappCard",
                "#div-gpt-ad-bannerAd",
                ".OpenInApp",
                ".HotQuestions-bottomButton"
            ]
        },
        {
            title: "中国天气网",
            hosts: ["m.weather.com.cn"],
            rules: [
                "iframe",
                ".ggModel"
            ]
        },
        {
            title: "简书",
            hosts: ["www.jianshu.com"],
            rules: [
                ".download-guide",
                ".comment-open-app-btn-wrap",
                ".note-comment-above-ad-wrap"
            ]
        },
        {
            title: "网易云音乐",
            hosts: ["music.163.com"],
            rules: [
                ".m-homeft",
                ".footer-wrap",
                ".cmt_more_applink"
            ]
        },
        {
            title: "QQ音乐",
            hosts: ["y.qq.com", "i.y.qq.com"],
            rules: [
                ".bottom_bar",
                ".top_operation_bar",
                ".top_operation_box",
                ".btn_download",
                ".js_pg_flotage",
                ".bottom_operation_box"
            ]
        },
        {
            title: "安居客",
            hosts: ["m.anjuke.com"],
            rules: [
                ".top-menu",
                ".open-btn",
                ".AppDownloadBarWrap",
                ".xapp-top-wrap"
            ]
        },
        {
            title: "大众点评",
            hosts: ["m.dianping.com"],
            rules: [
                ".J_download-guide",
                ".red-pocket-small-bg",
                ".downloadLayer",
                ".header-download",
                ".reviewArouse",
                ".app-sticker",
                ".footer_banner"
            ]
        },
        {
            title: "苏宁易购",
            hosts: ["m.suning.com", "shop.m.suning.com"],
            rules: [
                ".to-login",
                ".common-right-d",
                ".result-ad",
                ".headDom"
            ]
        },
        {
            title: "考拉海购",
            hosts: ["m.kaola.com", "m-goods.kaola.com"],
            rules: [
                ".km-banner-top",
                ".km-banner-float"
            ]
        },
        {
            title: "今日头条",
            hosts: ["m.toutiao.com"],
            rules: [
                ".sdk-top-banner",
                ".top-banner-container",
                ".bottom-banner-container"
            ]
        },
        {
            title: "小红书",
            hosts: ["www.xiaohongshu.com"],
            rules: [
                "#navbar",
                ".button-bottom-bar",
            ]
        },
        {
            title: "Bing",
            hosts: ["cn.bing.com"],
            rules: [
                ".BottomAppPro",
            ]
        },
        {
            title: "当当网",
            hosts: ["m.dangdang.com", "product.m.dangdang.com"],
            rules: [
                ".ddapp-wrapper",
                ".j_floor",
                ".app_download"
            ]
        },
        {
            title: "搜搜",
            hosts: ["wap.sogou.com"],
            rules: [
                "#indexAppOne",
            ]
        },
        {
            title: "天涯社区",
            hosts: ["www.tianya.cn", "bbs.tianya.cn"],
            rules: [
                ".gg-item",
            ]
        },
        {
            title: "猫眼电影",
            hosts: ["m.maoyan.com"],
            rules: [
                "#download-header",
                ".download-app-bar",
                ".tip-open-app"
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

    var host = location.href.replace("http://", "").replace("https://", "").split("/")[0];
    var rules = hosts[host];
    if(rules)
    {
        var classes = "";
        for(var i = 0; i < rules.length; i++)
        {
            classes += rules[i] + "{display:none !important}";
        }
        var style = document.createElement("style");
        style.innerHTML = classes;
        document.getElementsByTagName("HEAD").item(0).appendChild(style);
    }
})();
(function()
{
    var gateway = "https://www.netskyx.com";
    window.Api = {
        user_token_create: gateway + "/user/v1/token/create",
        user_token_check: gateway + "/user/v1/token/check",

        push_client_list: gateway + "/push/v1/client/list",

        tincat_bookmark_snapshot: gateway + "/tincat/v1/bookmark/snapshot",
        tincat_app_sendContent: gateway + "/tincat/v1/app/sendContent"
    };

    window.plus = {
        /**
         * 浏览器
         */
        browser: {
            isOpen: true,

            open: function(page)
            {
                this.isOpen = true;
                window.Router.push({path: page});
            },
        },

        /**
         * 用户
         */
        user: {
            getUserInfo: function(callback)
            {
                plus.storage.get("user", null, function(user)
                {
                    callback(user);
                });
            },

            setUserInfo: function(user, callback)
            {
                plus.storage.set("user", user, callback);
            }
        },

        /**
         * 存储
         */
        storage: {
            get: function(key, defaultValue, callback)
            {
                if(chrome && chrome.storage)
                {
                    var kv = {};
                    kv[key] = defaultValue;
                    chrome.storage.local.get(kv, function(result)
                    {
                        callback(result[key]);
                    });
                }
                else
                {
                    var value = localStorage.getItem(key);
                    if(value)
                    {
                        callback(JSON.parse(value));
                        return;
                    }
                    if(callback)
                    {
                        callback(defaultValue);
                    }
                }
            },

            set: function(key, value, callback)
            {
                if(chrome && chrome.storage)
                {
                    var kv = {};
                    kv[key] = value;
                    chrome.storage.local.set(kv, callback);
                }
                else
                {
                    localStorage.setItem(key, JSON.stringify(value));
                    if(callback)
                    {
                        callback();
                    }
                }
            }
        },

        /**
         * http请求
         */
        http: {
            onUnSigninListener: null,

            get: function(requestConfig)
            {
                this._request("GET", requestConfig);
            },

            put: function(requestConfig)
            {
                this._request("PUT", requestConfig);
            },

            post: function(requestConfig)
            {
                this._request("POST", requestConfig);
            },

            delete: function(requestConfig)
            {
                this._request("DELETE", requestConfig);
            },

            _request: function(method, requestConfig)
            {
                var that = this;
                if(!requestConfig.param)
                {
                    requestConfig.param = {};
                }

                var request = function(method, requestConfig)
                {
                    // 接口签名
                    requestConfig.param.timestamp = new Date().getTime();
                    var signParam = JSON.parse(JSON.stringify(requestConfig.param));
                    signParam.key = "d81d1289530132ce0e0544aeea7e8dcf";
                    var tmp = JSON.stringify(signParam).replace(/\n/g, "").replace(/\ +/g, "").replace(/\"+/g, "");
                    var charArray = [];
                    for(var i = 0; i < tmp.length; i++)
                    {
                        charArray.push(tmp[i]);
                    }
                    charArray.sort();
                    var sign = "";
                    for(var i = 0; i < charArray.length; i++)
                    {
                        sign += charArray[i];
                    }
                    requestConfig.param.sign = $.md5(sign);

                    console.log("请求" + JSON.stringify(requestConfig, null, 3));

                    var loading = plus.dialog.createLoading();
                    if(requestConfig.cfg.mask)
                    {
                        loading.show();
                    }

                    var url = requestConfig.url;
                    var data = null;
                    if(method === "POST" || method === "PUT")
                    {
                        data = JSON.stringify(requestConfig.param);
                    }
                    else
                    {
                        var paramString = "";
                        for(var key in requestConfig.param)
                        {
                            if(paramString === "")
                            {
                                paramString += "?" + key + "=" + encodeURIComponent(requestConfig.param[key]);
                            }
                            else
                            {
                                paramString += "&" + key + "=" + encodeURIComponent(requestConfig.param[key]);
                            }
                        }
                        url += paramString;
                    }
                    $.ajax({
                        url: url,
                        type: method,
                        contentType: "application/json",
                        data: data,
                        success: function(result)
                        {
                            loading.dismiss();
                            console.log("响应" + JSON.stringify(result, null, 3));

                            var response = requestConfig.callback;
                            var code = result.code;
                            var data = result.data;
                            var msg = result.msg;

                            switch(code)
                            {
                                case 200:
                                {
                                    // 保存缓存
                                    if(requestConfig.cfg.cache)
                                    {
                                        plus.storage.set(requestConfig.cacheName, JSON.stringify(data));
                                        console.log("保存缓存");
                                    }

                                    if(requestConfig.callback)
                                    {
                                        requestConfig.callback(data, code);
                                    }
                                    break;
                                }
                                case 304:
                                {
                                    // 读取缓存
                                    plus.storage.get(requestConfig.cacheName, null, function(cacheData)
                                    {
                                        if(requestConfig.callback)
                                        {
                                            console.log("返回本地缓存: " + cacheData);
                                            requestConfig.callback(JSON.parse(cacheData), code);
                                        }
                                    });
                                    break;
                                }
                                case 401:
                                {
                                    if(plus.http.onUnSigninListener)
                                    {
                                        plus.http.onUnSigninListener();
                                    }
                                    break;
                                }
                                case 204:
                                case 400:
                                case 500:
                                {
                                    plus.toast(msg);
                                    break;
                                }
                                // 业务异常
                                default:
                                {
                                    if(requestConfig.cfg.care)
                                    {
                                        if(requestConfig.callback)
                                        {
                                            requestConfig.callback(data, code);
                                        }
                                    }
                                    else
                                    {
                                        plus.toast(msg);
                                    }
                                    break;
                                }
                            }
                        },
                        error: function(xmlHttpRequest, textStatus, errorThrown)
                        {
                            loading.dismiss();
                            alert(textStatus + " " + xmlHttpRequest.status);
                        },
                    });
                };

                plus.user.getUserInfo(function(user)
                {
                    if(user)
                    {
                        requestConfig.param.sid = user.sid;
                    }

                    if(!requestConfig.cfg)
                    {
                        requestConfig.cfg = {
                            mask: true,
                            care: false
                        };
                    }

                    // 304缓存
                    if(requestConfig.cfg.cache)
                    {
                        requestConfig.cacheName = $.md5(requestConfig.url + JSON.stringify(requestConfig.param));
                        plus.storage.get(requestConfig.cacheName, null, function(cache)
                        {
                            if(cache)
                            {
                                requestConfig.param["cacheId"] = $.md5(cache);
                            }
                            request(method, requestConfig);
                        });
                    }
                    else
                    {
                        request(method, requestConfig);
                    }
                });
            }
        },

        /**
         * 工具类
         */
        util: {
            /**
             * 读取url参数
             * @param name
             */
            getParameter: function(name)
            {
                var param = {};
                if(location.search)
                {
                    var kv = location.search.substring(1).split("&");
                    for(var i = 0; i < kv.length; i++)
                    {
                        var tmp = kv[i].split("=");
                        if(tmp.length == 2)
                        {
                            param[tmp[0]] = tmp[1];
                        }
                    }
                }
                return param[name];
            }
        },

        /**
         * 时间工具
         */
        time: {
            /**
             * 格式化日期
             * eg: var datestr = T.common.time.format(new Date(), "yyyy-MM-dd HH:mm:ss");
             */
            format: function(date, format)
            {
                format = format.replace("yyyy", date.getFullYear());
                format = format.replace("MM", date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1));
                format = format.replace("dd", date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
                format = format.replace("HH", date.getHours() > 9 ? date.getHours() : "0" + date.getHours());
                format = format.replace("mm", date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes());
                format = format.replace("ss", date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds());
                return format;
            },

            /**
             * 字符串转日期
             * eg: var date = T.common.time.parse("2016-01-01 00:00:00", "yyyy-MM-dd HH:mm:ss");
             */
            parse: function(datestr, format)
            {
                datestr += "";
                var target = [0, 0, 0, 0, 0, 0];
                var sign = ["yyyy", "MM", "dd", "HH", "mm", "ss"];
                for(var i = 0; i < sign.length; i++)
                {
                    var idx = format.indexOf(sign[i]);
                    if(idx > -1)
                    {
                        target[i] = parseInt(datestr.substr(idx, sign[i].length));
                    }
                }
                var date = new Date(target[0], target[1] - 1, target[2], target[3], target[4], target[5]);
                return date;
            }
        },

        /**
         * 自定义弹窗
         */
        dialog: {
            create: function(selector)
            {
                var dialog = {
                    _selector: selector,

                    showCenter: function()
                    {
                        this._show("h5-dialog-center");
                    },

                    showLeft: function()
                    {
                        this._show("h5-dialog-left");
                    },

                    showRight: function()
                    {
                        this._show("h5-dialog-right");
                    },

                    showBottom: function()
                    {
                        this._show("h5-dialog-bottom");
                    },

                    setOnDismissListener: function(onDismissListener)
                    {
                        this._onDismissListener = onDismissListener;
                    },

                    dismiss: function()
                    {
                        var that = this;
                        var mask = $(".h5-mask");
                        var dialog = $(this._selector);

                        dialog.css("animation", this._dialogClass + "-out 0.2s forwards ease-in");
                        mask.css("animation", "h5-mask-out 0.3s forwards ease-in");
                        setTimeout(function()
                        {
                            mask.remove();
                            dialog.attr("class", "");
                            dialog.css("animation", "");
                            dialog.hide();

                            $("body").css("overflow-y", "auto");

                            if(that._onDismissListener)
                            {
                                that._onDismissListener();
                                that._onDismissListener = null;
                            }
                        }, 300);
                    },

                    _show: function(dialogClass)
                    {
                        var that = this;
                        this._dialogClass = dialogClass;

                        $("body").css("overflow-y", "hidden");

                        var maskDom = $("<div class=\"h5-mask\">&nbsp;</div>");
                        $("body").append(maskDom);

                        var dialogDom = $(this._selector);
                        dialogDom.attr("class", dialogClass);

                        setTimeout(function()
                        {
                            dialogDom.show();

                            setTimeout(function()
                            {
                                if("h5-dialog-center" === dialogClass)
                                {
                                    dialogDom.bind("click", function(e)
                                    {
                                        if(e.target === dialogDom.get(0))
                                        {
                                            that.dismiss();
                                            return false;
                                        }
                                    });
                                }
                                else
                                {
                                    maskDom.bind("click", function()
                                    {
                                        that.dismiss();
                                        return false;
                                    });
                                }
                            }, 300);
                        }, 100);
                    }
                };
                return dialog;
            },

            createLoading: function()
            {
                var html =
                    '<div class="h5-loading">' +
                    '<div>' +
                    '<div></div>' +
                    '<div>Loading</div>' +
                    '</div>' +
                    '</div>';

                return {
                    html: html,

                    show: function()
                    {
                        $("body").append($(this.html));
                    },

                    dismiss: function()
                    {
                        $(".h5-loading").remove();
                    }
                };
            }
        },

        /**
         * toast提示
         * @param msg
         */
        toast: function(msg)
        {
            var html = "<div class=\"h5-toast\"><div>" + msg + "</div></div>";
            var htmlDom = $(html);
            $("body").append(htmlDom);

            setTimeout(function()
            {
                $(".h5-toast").css("animation", "h5-toast-out 0.15s forwards ease-in");
                setTimeout(function()
                {
                    $(".h5-toast").remove();
                }, 150);
            }, 2500);
        },

        /**
         * alert提示
         * @param msg
         */
        alert: function(msg)
        {
            var html = '<div id="h5-dialog-alert" style="display: none;">\n' +
                ' <div class="h5-dialog-alert">\n' +
                '      <div>${msg}</div>\n' +
                '        <div>\n' +
                '           <div class="h5-selector">OK</div>\n' +
                '       </div>\n' +
                '    </div>\n' +
                '</div>';
            html = html.replace("${msg}", msg);
            var contentView = $(html);
            $("body").append(contentView);

            var dialog = plus.dialog.create("#h5-dialog-alert");
            dialog.setOnDismissListener(function()
            {
                $("#h5-dialog-alert").remove();
            });
            dialog.showCenter();
            contentView.find(".h5-selector").bind("click", function(e)
            {
                var btn = $(this).html();
                dialog.dismiss();
                onAlertDismissListener();
            });
        },

        /**
         * confirm提示
         * @param msg
         * @param onConfirmDismissListener
         */
        confirm: function(msg, onConfirmDismissListener)
        {
            var html = '<div id="h5-dialog-confirm" style="display: none;">\n' +
                ' <div class="h5-dialog-confirm">\n' +
                '      <div>${msg}</div>\n' +
                '        <div>\n' +
                '           <div class="h5-selector">Cancel</div>\n' +
                '           <div class="h5-selector">OK</div>\n' +
                '       </div>\n' +
                '    </div>\n' +
                '</div>';
            html = html.replace("${msg}", msg);
            var contentView = $(html);
            $("body").append(contentView);

            var dialog = plus.dialog.create("#h5-dialog-confirm");
            dialog.setOnDismissListener(function()
            {
                $("#h5-dialog-confirm").remove();
            });
            dialog.showCenter();
            contentView.find(".h5-selector").bind("click", function(e)
            {
                var btn = $(this).html();
                dialog.dismiss();
                onConfirmDismissListener(btn === "OK");
            });
        },

        /**
         * list选择
         * @param msg
         * @param items
         * @param onListSelectListener
         */
        list: function(msg, items, onListSelectListener)
        {
            var html =
                '<div id="h5-dialog-list" style="display: none;">\n' +
                '    <div class="h5-dialog-list">\n' +
                '      <div>${msg}</div>\n' +
                '      <div>${itemHtml}</div>\n' +
                '      <div>\n' +
                '           <div class="h5-selector">Cancel</div>\n' +
                '      </div>\n' +
                '    </div>\n' +
                '</div>';
            var itemHtml = "";
            for(var i = 0; i < items.length; i++)
            {
                itemHtml += "<div index='" + i + "' class='h5-selector h5-singleline'>" + items[i] + "</div>";
            }
            html = html.replace("${msg}", msg);
            html = html.replace("${itemHtml}", itemHtml);
            var dom = $(html);
            $("body").append(dom);

            var dialog = plus.dialog.create("#h5-dialog-list");
            dialog.setOnDismissListener(function()
            {
                $("#h5-dialog-list").remove();
            });
            dialog.showCenter();
            dom.find(".h5-selector").bind("click", function(e)
            {
                if($(this).html() !== "Cancel")
                {
                    var index = parseInt($(this).attr("index"));
                    onListSelectListener(index);
                }
                dialog.dismiss();
            });
        },
    };
})();
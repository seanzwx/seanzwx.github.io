(function()
{
    window.h5 = {
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
            },

            /**
             * 读取操作系统类型
             * @return android | ios | unknown
             */
            getOSType: function()
            {
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

                if(isAndroid)
                {
                    return "android";
                }
                if(isiOS)
                {
                    return "ios";
                }
                return "unknown";
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

                        dialog.css("animation", this._dialogClass + "-out 0.15s forwards ease-in");
                        mask.css("animation", "h5-mask-out 0.15s forwards ease-in");
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
                        }, 200);
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
                                    dialogDom.bind("touchstart", function(e)
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
                                    maskDom.bind("touchstart", function()
                                    {
                                        that.dismiss();
                                        return false;
                                    });
                                }
                            }, 200);
                        }, 100);
                    }
                };
                return dialog;
            },

            list: function(items, onSelectListener)
            {
                var html =
                    "<div style=\"width: 80%;border-radius: 16px;background-color: #ffffff;\">" +
                    "<div style=\"padding: 16px;font-weight: bold\">Select</div>" +
                    "<div id=\"body\" style=\"border-top: solid 1px #f7f7f7;border-bottom: solid 1px #f7f7f7;\">${items}</div>" +
                    "<div id='close' style=\"padding: 16px;border-radius: 0px 0px 16px 16px;text-align: center;\" class=\"h5-selector\">Close</div>" +
                    "</div>";
                var itemHtml = "";
                for(var i = 0; i < items.length; i++)
                {
                    itemHtml += "<div class=\"h5-selector\" style=\"line-height: 50px;padding: 0px 16px 0px 16px;\">" + items[i] + "</div>";
                }
                html = html.replace("${items}", itemHtml);
                var dialogDom = document.createElement("DIV");
                dialogDom.setAttribute("id", "dialog_list");
                dialogDom.style.display = "none";
                dialogDom.innerHTML = html;
                document.body.appendChild(dialogDom);

                var dialog = this.create("#dialog_list");
                dialog.showCenter();

                dialogDom.querySelector("#close").addEventListener("click", function(e)
                {
                    dialog.dismiss();
                });

                var itemDoms = dialogDom.querySelector("#body").childNodes;
                for(var i = 0; i < itemDoms.length; i++)
                {
                    itemDoms[i].addEventListener("click", function(e)
                    {
                        var button = this.innerHTML;
                        dialog.dismiss();
                        setTimeout(function()
                        {
                            onSelectListener(button);
                        }, 200);
                    });
                }
            }
        }
    };
})();
(function()
{
    window.jsbridge = {
        currCallId: 0,
        callPool: {},

        execute: function(protocol)
        {
            if(!window.__tincat__)
            {
                if(protocol.callback)
                {
                    protocol.callback();
                }
                return;
            }

            if(protocol.callback)
            {
                this.currCallId++;
                this.callPool[this.currCallId + ""] = protocol.callback;
                protocol.callback = "window.jsbridge.callback('" + this.currCallId + "', '${data}');";
            }

            window.__tincat__.execute(JSON.stringify(protocol));
        },

        callback: function(callId, data)
        {
            data = decodeURIComponent(data);
            var callback = this.callPool[callId];
            if(callback)
            {
                delete this.callPool[callId];
                callback(data);
            }
        },
    };

    window.tincat = {
        system: {
            toast: function(msg)
            {
                window.jsbridge.execute({
                    method: "system.toast",
                    param: {
                        msg: msg
                    }
                });
            },

            copy: function(text)
            {
                window.jsbridge.execute({
                    method: "system.copy",
                    param: {
                        text: text
                    }
                });
            },

            paste: function(callback)
            {
                window.jsbridge.execute({
                    method: "system.paste",
                    callback: callback
                });
            },

            download: function(url, fileName)
            {
                window.jsbridge.execute({
                    method: "system.download",
                    param: {
                        url: url,
                        fileName: fileName
                    }
                });
            },

            cast: function(url)
            {
                window.jsbridge.execute({
                    method: "system.cast",
                    param: {
                        url: url
                    }
                });
            },

            share: function(title, text)
            {
                window.jsbridge.execute({
                    method: "system.share",
                    param: {
                        title: title,
                        text: text
                    }
                });
            },
        },

        http: {
            get: function(requestConfig)
            {
                window.tincat.http._request("http.get", requestConfig);
            },

            post: function(requestConfig)
            {
                window.tincat.http._request("http.post", requestConfig);
            },

            restful: function(requestConfig)
            {
                window.jsbridge.execute({
                    method: "http.restful",
                    param: {
                        url: requestConfig.url,
                        body: requestConfig.body,
                        mask: requestConfig.mask
                    },
                    callback: function(value)
                    {
                        var data = JSON.parse(value);
                        if(requestConfig.callback)
                        {
                            requestConfig.callback(data.data);
                        }
                    }
                });
            },

            _request: function(method, requestConfig)
            {
                window.jsbridge.execute({
                    method: method,
                    param: {
                        url: requestConfig.url,
                        body: requestConfig.body,
                        mask: requestConfig.mask
                    },
                    callback: function(value)
                    {
                        var data = JSON.parse(value);
                        if(data.code === 200)
                        {
                            if(requestConfig.callback)
                            {
                                requestConfig.callback(data.content);
                            }
                        }
                        else
                        {
                            if(requestConfig.failCallback)
                            {
                                requestConfig.failCallback(data.content);
                            }
                        }
                    }
                });
            }
        },

        ad: {
            interstitial: function(onAdCloseListener)
            {
                window.jsbridge.execute({
                    method: "ad.interstitial",
                    callback: onAdCloseListener
                });
            }
        },

        user: {
            session: function(callback)
            {
                window.jsbridge.execute({
                    method: "user.session",
                    callback: function(user)
                    {
                        if(!user)
                        {
                            callback(null);
                            return;
                        }
                        callback(JSON.parse(user));
                    }
                });
            }
        }
    };
})();
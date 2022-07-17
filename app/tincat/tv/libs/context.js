var Gateway = "http://47.241.101.128";

window.Api = {
};

window.Channel = {
    getGroupArray: function(callback)
    {
        var defalutValue = [{
            name: "Default",
            channelArray: []
        }];
        h5.storage.get("Channel", defalutValue, function(data)
        {
            callback(data);
        });
    },

    setGroupArray: function(groupArray, callback)
    {
        h5.storage.set("Channel", groupArray, callback);
    },

    addGroup: function(callback)
    {
        var that = this;
        var text = prompt("Group Name");
        if(text)
        {
            that.getGroupArray(function(groupArray)
            {
                groupArray.push({
                    name: text,
                    channelArray: []
                });
                that.setGroupArray(groupArray, callback);
            });
        }
    },

    deleteGroup: function(groupIndex, callback)
    {
        var that = this;
        that.getGroupArray(function(groupArray)
        {
            var newArray = [];
            for(var i = 0; i < groupArray.length; i++)
            {
                if(i !== groupIndex)
                {
                    newArray.push(groupArray[i]);
                }
            }
            that.setGroupArray(newArray, callback);
        });
    },

    addChannels: function(channels)
    {
        var that = this;
        that.getGroupArray(function(groupArray)
        {
            var dialog = h5.dialog.list();
            for(var i = 0; i < groupArray.length; i++)
            {
                var it = groupArray[i];
                dialog.addItem(it.name, function(index)
                {
                    for(var i = 0; i < channels.length; i++)
                    {
                        groupArray[index].channelArray.push(channels[i]);
                    }
                    that.setGroupArray(groupArray, function()
                    {
                        alert("add success, need refresh channel list");
                    });
                });
            }
            dialog.show();
        });
    },

    deleteChannel: function(groupIndex, channelIndex, callback)
    {
        var that = this;
        that.getGroupArray(function(groupArray)
        {
            var channelArray = groupArray[groupIndex].channelArray;
            var newArray = [];
            for(var i = 0; i < channelArray.length; i++)
            {
                if(i !== channelIndex)
                {
                    newArray.push(channelArray[i]);
                }
            }
            groupArray[groupIndex].channelArray = newArray;
            that.setGroupArray(groupArray, callback);
        });
    }
};
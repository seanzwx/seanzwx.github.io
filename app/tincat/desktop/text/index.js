window.onload = function()
{
    plus.storage.get("PushMessage", "", function(text)
    {
        console.log("text = " + text);

        document.querySelector("#close").addEventListener("click", function()
        {
            window.close();
        });

        var clipboard = new Clipboard("#copy", {
            text: function()
            {
                var value = document.querySelector("#text").value;
                if(value)
                {
                    return value;
                }
                return " ";
            }
        });
        clipboard.on("success", function(e)
        {
            plus.toast("copy success");
        });

        clipboard.on("error", function(e)
        {
            plus.toast("copy failed")
        });

        document.querySelector("#text").value = text;
    });
};
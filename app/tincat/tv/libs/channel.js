(function()
{
    var data = [];
    var table = document.querySelectorAll("table")[2];
    var trs = table.querySelectorAll("tbody>tr");
    for(var i = 0; i < trs.length; i++)
    {
        try
        {
            var tr = trs[i];
            var tds = tr.querySelectorAll("td");
            var item = {
                icon: tds[0].querySelector("img").getAttribute("src"),
                country: tds[0].innerHTML.split("&nbsp;")[1],
                channels: parseInt(tds[1].innerHTML),
                url: tds[2].querySelector("code").innerHTML
            };

            if(item.channels >= 10)
            {
                var tmp = item.url.split("/");
                var shortCountry = tmp[tmp.length - 1].split(".")[0];
                tmp = item.icon.split("/");
                var shortIcon = tmp[tmp.length - 1].split(".")[0];

                data.push([shortCountry, item.country, shortIcon, item.channels]);
            }
        }
        catch(e)
        {

        }
    }
    console.log(JSON.stringify(data));
})();
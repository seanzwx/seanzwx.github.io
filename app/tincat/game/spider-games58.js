/**
 * https://games58.com/
 */
(function()
{
    var gameList = {
        trending: [],
        gameArray: []
    };

    // 热门游戏
    var trending = document.querySelectorAll(".gameTrendNewlyItem");
    for(var i = 0; i < trending.length; i++)
    {
        var div = trending[i];

        gameList.trending.push({
            title: div.querySelector(".name").innerHTML,
            icon: div.querySelector("img").getAttribute("data-src"),
            url: "https://games58.com/game.html?channel=vigoo&appid=" + div.id.split("_")[2]
        });
    }

    // 所有游戏
    var allGame = document.querySelectorAll(".gameAllItem");
    for(var i = 0; i < allGame.length; i++)
    {
        var div = allGame[i];

        gameList.gameArray.push({
            title: div.querySelector(".name").innerHTML,
            icon: div.querySelector("img").getAttribute("data-src"),
            url: "https://games58.com/game.html?channel=vigoo&appid=" + div.id.split("_")[2]
        });
    }

    console.log(JSON.stringify(gameList, null, 3));
})();
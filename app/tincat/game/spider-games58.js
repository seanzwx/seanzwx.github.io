/**
 * https://games58.com/
 */
(function()
{
    var gameList = [];

    // 热门游戏
    var trendingGame = {
        title: "Trending Games",
        itemArray: []
    };
    var trending = document.querySelectorAll(".gameTrendNewlyItem");
    for(var i = 0; i < trending.length; i++)
    {
        var div = trending[i];

        trendingGame.itemArray.push({
            title: div.querySelector(".name").innerHTML,
            icon: div.querySelector("img").getAttribute("data-src"),
            url: "https://games58.com/game.html?channel=vigoo&appid=" + div.id.split("_")[2]
        });
    }
    gameList.push(trendingGame);

    // 所有游戏
    var allGame = {
        title: "All Games",
        itemArray: []
    };
    var all = document.querySelectorAll(".gameAllItem");
    for(var i = 0; i < all.length; i++)
    {
        var div = all[i];

        allGame.itemArray.push({
            title: div.querySelector(".name").innerHTML,
            icon: div.querySelector("img").getAttribute("data-src"),
            url: "https://games58.com/game.html?channel=vigoo&appid=" + div.id.split("_")[2]
        });
    }
    gameList.push(allGame);

    console.log(JSON.stringify(gameList, null, 3));
})();
(() =>
{
	/*调整全局页面跳转*/
	document.querySelector("body").onclick = e =>
	{
		let dom = e.target;
		while(dom.tagName.toLowerCase() !== 'body')
		{
			if(dom.tagName.toLowerCase() === 'a' && dom.href)
			{
				e.preventDefault();
				e.stopPropagation();
				location.href = dom.href;
				break;
			}
			dom = dom.parentNode;
		}
	};
})();
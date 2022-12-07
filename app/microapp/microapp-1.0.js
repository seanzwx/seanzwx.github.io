(() =>
{
	let hostname = location.hostname;

	/* youtube */
	if(hostname.indexOf("youtube.com") >= 0)
	{
		document.querySelector("body").onclick = e =>
		{
			let dom = e.target;
			while(dom.tagName.toLowerCase() !== 'body')
			{
				if(dom.tagName.toLowerCase() === 'a' && dom.href)
				{
					e.preventDefault();
					e.stopPropagation();
					alert(dom.href);
					location.href = dom.href;
					break;
				}
				dom = dom.parentNode;
			}
		};
		return;
	}
})();
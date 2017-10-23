// require jQuery 3.x

function tophat_centered_logo_fix()
{
	var centeredLogos = $('.tophat-bar[data-tophat-logo="middle"]');
	if(centeredLogos.length)
	{
		centeredLogos.each(function(){
			var centeredBar = $(this);
			var centeredPart = centeredBar.find('[data-tophat-part-key="middle"]');

			var centeredlogo = centeredPart.find('.tophat-bar-logo');
			centeredlogo.show();

			var centeredLinks = centeredPart.find('.nav-item:visible');
			centeredLinks.each(function(i){
				$(this).css({order:i});
			})
			if(centeredLinks.length>0)
			{
				centeredLinks.css({marginRight:''});
				centeredPart.css({paddingRight:'',paddingLeft:''});

				var niw = 0;
				for(let i=0; i < centeredLinks.length; i++)
				{
					niw += centeredLinks.eq(i).width();
				}
				var niPad = 0;
				var niPadAfter = 0;
				var niPadBeforeW = 0;
				var niPadAfterW = 0;
				for(let i=0; i < centeredLinks.length; i++)
				{
					niPadBeforeW = niPadAfterW;
					niPadAfterW += centeredLinks.eq(i).width();
					niPad = i;
					if(niPadAfterW >= niw/2)
					{
						break;
					}
				}

				var lw = centeredlogo.width();

				var delta = 0;
				var deltaBefore = niPadBeforeW - niw/2;
				var deltaAfter = niPadAfterW - niw/2;
				if(Math.abs(deltaBefore) < Math.abs(deltaAfter))
				{
					delta = Math.round(deltaBefore);
					niPad = Math.max(0,niPad-1);
				}
				else
				{
					delta = Math.round(deltaAfter);
					niPad = niPad;
				}

				centeredlogo.css({
					order:niPad+1,
				});

				centeredPart.css((delta>0 ? 'paddingRight':'paddingLeft'),(2*Math.abs(delta))+'px');
			}
		})
	}
}

$(document).ready(function() {
	setInterval(tophat_centered_logo_fix,500);
});
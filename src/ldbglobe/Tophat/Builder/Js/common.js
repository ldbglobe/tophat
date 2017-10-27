// require jQuery 3.x

function tophat_touch_support()
{
	return window.TouchEvent && 'ontouchstart' in window && 'ontouchend' in document;
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_dropdown(){
	var menuDelay = null;
	var menuToActivate = null;
	$('.tophat-bar-part > .nav-item').on('mouseover click',function(event){
		menuToActivate = this;
		clearTimeout(menuDelay);
		menuDelay = setTimeout(function(){
			if(!$(menuToActivate).hasClass('hover'))
			{
				$('.tophat-bar-part > .nav-item').removeClass('hover');
				$(menuToActivate).addClass('hover');
			}
			else if(tophat_touch_support() && event.type=='click')
			{
				$('.tophat-bar-part > .nav-item').removeClass('hover');
			}
		},150);
	})
	$('.tophat-bar-part > .nav-item').on('mouseout',function(){
		menuToActivate = null;
		clearTimeout(menuDelay);
		menuDelay = setTimeout(function(){
			$('.tophat-bar-part > .nav-item').removeClass('hover');
		},250);
	})
	$('.tophat-bar-part .nav-link').on('mouseover click',function(event){
		if(tophat_touch_support() && !$(this).parent('.nav-item').hasClass('hover'))
		{
			event.preventDefault();
		}
	});
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_centered_logo_refresh()
{
	var centeredLogos = $('.tophat-bar[data-tophat-logo="middle"]');
	if(centeredLogos.length)
	{
		centeredLogos.each(function(){
			var centeredBar = $(this);
			var centeredPart = centeredBar.find('[data-tophat-align="middle"]');

			var centeredlogo = centeredPart.find('.tophat-bar-logo');
			centeredlogo.show();

			var centeredLinks = centeredPart.find('.nav-item:visible');
			centeredLinks.each(function(i){
				$(this).css({order:i});
			})
			if(centeredLinks.length>0)
			{
				centeredPart.css({paddingRight:'',paddingLeft:''});
				var W = centeredPart.width();

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

				if(W - lw - niw - delta < 0)
					delta = 0;

				centeredPart.css((delta>0 ? 'paddingRight':'paddingLeft'),(2*Math.abs(delta))+'px');
			}
		})
	}
}


//----------------------------------------------------------------------
//----------------------------------------------------------------------

var burger_width = 50;
var barPad = 10; // bar lost space compensation
function tophat_burger_menu_refresh(){
	$bars = $('.tophat-bar');
	$bars.each(function(){
		$bar = $(this);
		if(tophat_burger_menu_overall_detection($bar))
		{
			tophat_burger_menu_AI_show($bar)
		}
		else
		{
			tophat_burger_menu_AI_hide($bar)
		}
	});
}

function tophat_burger_menu_item_width($container) {
	let itemWidth = 0;

	var logo = $container.find('.tophat-bar-logo');
	if(logo.length)
		itemWidth += logo.width();

	$container.find('.nav-item:visible').each(function(j){
		let $item = $(this);
		let w = Math.floor($item.outerWidth(true));
		itemWidth += w;
	});
	return itemWidth;
}

function tophat_burger_menu_overall_detection($bar) {

	// on élimine les règles CSS qui conflictuel
	$bar.find('.tophat-bar-part').css({flexWrap:'wrap','paddingLeft':'', 'paddingRight':''});

	$parts = $bar.find('.tophat-bar-part');
	let enough_space = true;
	let itemWidth = 0;
	$parts.each(function(i){
		let $part = $(this);
		let W = Math.floor($part.width());
		//debug('part('+i+') : '+W+'px');

		let iW = 0;
		var logo = $part.find('.tophat-bar-logo');
		if(logo.length)
			iW += logo.width();

		$part.find('.nav-item:visible').each(function(j){
			let $item = $(this);
			let w = Math.floor($item.outerWidth(true));
			iW += w;
			//debug('part('+i+') item('+j+') : '+w+'px (inside a '+W+'px container)');
		})
		itemWidth += iW;
		//debug('part('+i+') totalize '+iW+'px content in a '+W+'px container');
		enough_space = enough_space && iW <= W;
	})

	// puis on remet en place la règle d'alignement de contenu dans le menu
	$bar.find('.tophat-bar-part').css({flexWrap:''});
	return enough_space;
}

function tophat_burger_menu_AI_hide($bar)
{
	debug('tophat_burger_menu_AI_hide');
	if($bar.find('.tophat-bar-part[data-tophat-align="middle"]').length > 0 && $bar.find('.tophat-bar-part').length > 1)
	{
		tophat_burger_menu_AI_hide_width_middle($bar);
		setTimeout(function(){
			$bar.find('.tophat-bar-part').each(function(i){
				debug('part '+i);
				tophat_burger_menu_AI_hide_items($(this));
			})
		},10);
	}
	else
	{
		tophat_burger_menu_AI_hide_items($bar);
	}
}
function tophat_burger_menu_AI_show($bar)
{
	debug('tophat_burger_menu_AI_show');
	if($bar.find('.tophat-bar-part[data-tophat-align="middle"]').length > 0 && $bar.find('.tophat-bar-part').length > 1)
	{
		tophat_burger_menu_AI_show_width_middle($bar);
		setTimeout(function(){
			$bar.find('.tophat-bar-part').each(function(){
				debug('part '+i);
				tophat_burger_menu_AI_show_items($(this));
			})
		},10);
	}
	else
	{
		tophat_burger_menu_AI_show_items($bar);
	}
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
function tophat_burger_menu_AI_hide_items($part)
{
	debug('tophat_burger_menu_AI_hide_items');
	var W = $part.width() - barPad;
	var iW = tophat_burger_menu_item_width($part);
	if(iW <= W)
		return;

	$items = [];
	$part.find('.nav-item:visible').each(function(){
		$items.push($(this));
	});
	$items.reverse();
	$items.sort(function(a,b){ return a.data('tophatLevel') - b.data('tophatLevel'); });
	for(i=0 ; i < $items.length ; i++)
	{
		iW -= $items[i].outerWidth();
		debug(W+' ? '+iW);

		$items[i].hide();
		if(iW <= W)
			break;
	}
}
function tophat_burger_menu_AI_show_items($part)
{
	debug('tophat_burger_menu_AI_show_items');
	var W = $part.width() - barPad;
	var iW = tophat_burger_menu_item_width($part);

	$items = [];
	$part.find('.nav-item:hidden').each(function(){
		$items.push($(this));
	});
	$items.reverse();
	$items.sort(function(a,b){ return a.data('tophatLevel') - b.data('tophatLevel'); });
	$items.reverse();
	for(i=0 ; i < $items.length ; i++)
	{
		iW += $items[i].outerWidth();
		debug(W+' ? '+iW);
		if(iW >= W)
			break;
		$items[i].show();
	}
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
function tophat_burger_menu_AI_hide_width_middle($bar,param)
{
	debug('tophat_burger_menu_AI_hide_width_middle');

	let W = $bar.width();
	let lW = 0;
	let mW = 0;
	let rW = 0;
	$bar.find('.tophat-bar-part[data-tophat-align="left"] > *').each(function(){ lW += $(this).outerWidth(true); });
	$bar.find('.tophat-bar-part[data-tophat-align="middle"] > *').each(function(){ mW += $(this).outerWidth(true); });
	$bar.find('.tophat-bar-part[data-tophat-align="right"] > *').each(function(){ rW += $(this).outerWidth(true); });

	// si la partie centrale fait moins de 1/3 de la largeur total on accorde plus de place sur les cotés
	if(mW / W < 1 / 3)
	{
		debug('new flex ratio for middle part is '+(mW / (W/3)));
		$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:(mW / (W/3))+' 1'});
	}
	// sinon on regarde si les éléments latéraux ont encore de la marge pour accorder de l'espace au centre
	else if(Math.max(lW,rW) / W < 1 / 3)
	{
		debug('new flex ratio for middle part is '+(mW / (W/3)));
		$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:(Math.max(lW,rW) / (W/3))+' 1'});
	}
	else
	{
		debug('new flex ratio for middle part is 1');
		$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:'1 1'});
	}
}
function tophat_burger_menu_AI_show_width_middle($bar,param)
{
	debug('tophat_burger_menu_AI_show_width_middle');
}



//----------------------------------------------------------------------
//----------------------------------------------------------------------
function tophat_cron()
{
	tophat_burger_menu_refresh();
	tophat_centered_logo_refresh();
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function debug(message_or_title,message){
	if(true) return;
	if(typeof message !== 'undefined')
	{
		console.log(message_or_title,message);
	}
	else
		console.log(message_or_title);
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

$(document).ready(function() {
	tophat_burger_menu_refresh
	tophat_dropdown();

	setInterval(tophat_cron,500);
});
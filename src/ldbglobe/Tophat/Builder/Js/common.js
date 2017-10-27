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

var burger_base = '<div class="tophat-burger nav-item" data-tophat-level="9999" data-tophat-skin="burger"><span class="nav-link"><span class="label"><i class="fa fa-bars"></i></span></span><ul class="nav-dropdown" data-tophat-skin="burger"></ul></div>';
function tophat_burger_init()
{
	$('.tophat-bar').each(function(){
		if($(this).find('.tophat-burger').length==0)
		{
			$(this).find('.nav-item').eq(0).before(burger_base);
		}
	})
}

function tophat_burger_refresh()
{
	$bars = $('.tophat-bar');
	$bars.each(function(){
		let $bar = $(this);
		if($bar.find('.nav-item:not(.tophat-burger):hidden').length)
		{
			$bar.find('.tophat-burger').addClass('visible');
		}
		else
		{
			$bar.find('.tophat-burger').removeClass('visible');
		}

		// TODO gérer les sections pour les différencier dans le dropdown burger

		$dropdown = $bar.find('.tophat-burger .nav-dropdown');
		$dropdown.empty();
		$(this).find('.nav-item:hidden').each(function(){
			let $link = $(this).find('.nav-link');
			let $subitems = $(this).find('.nav-dropdown li');
			let $burgerlink = null;
			if($link.attr('href'))
				$burgerlink = $('<a href="'+$link.attr('href')+'"><span class="label">'+$link.find('.label').html()+'</span></a>');
			else if($subitems.length)
				$burgerlink = $('<span><span class="label">'+$link.find('.label').html()+'</span></span>');

			if($burgerlink)
			{
				let $burgeritem = $('<li></li>');
				$burgeritem.append($burgerlink);
				if($subitems.length)
				{
					$subnav = $('<ul></ul>');
					$sublink = null;
					// add dropdown item content as sub item
					$subitems.each(function(){
						let $link = $(this).children();
						if($link.attr('href'))
							$sublink = $('<li><a href="'+$link.attr('href')+'"><span class="label">'+$link.find('.label').html()+'</span></a></li>');
						else
							$sublink = $('<li><span><span class="label">'+$link.find('.label').html()+'</span></span></li>');

						if($sublink)
						{
							$subnav.append($sublink);
						}
					})

					$burgeritem.append($subnav)
				}
				$dropdown.append($burgeritem);
			}
		})
	});
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_container_item_width($container) {
	let itemWidth = 0;

	let logo = $container.find('.tophat-bar-logo');
	if(logo.length)
		itemWidth += logo.width();

	$container.find('.nav-item:visible').each(function(j){
		let $item = $(this);
		let w = Math.floor($item.outerWidth(true));
		itemWidth += w;
	});
	return itemWidth;
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_item_visibility_refresh(){
	$bars = $('.tophat-bar');
	$bars.each(function(){
		let $bar = $(this);
		if(tophat_item_visibility_overall_detection($bar))
		{
			tophat_item_visibility_AI_show($bar)
		}
		else
		{
			tophat_item_visibility_AI_hide($bar)
		}
	});
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

var burger_width = 50;
var barPad = 10; // bar lost space compensation

function tophat_item_visibility_overall_detection($bar) {

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
		let logo = $part.find('.tophat-bar-logo');
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

function tophat_item_visibility_AI_hide($bar)
{
	debug('tophat_item_visibility_AI_hide');
	if($bar.find('.tophat-bar-part[data-tophat-align="middle"]').length > 0 && $bar.find('.tophat-bar-part').length > 1)
	{
		tophat_item_visibility_AI_hide_width_middle($bar);
		$bar.find('.tophat-bar-part').each(function(i){
			debug('part '+i);
			tophat_item_visibility_AI_hide_items($(this));
		})
	}
	else
	{
		tophat_item_visibility_AI_hide_items($bar);
	}
}
function tophat_item_visibility_AI_show($bar)
{
	debug('tophat_item_visibility_AI_show');
	if($bar.find('.tophat-bar-part[data-tophat-align="middle"]').length > 0 && $bar.find('.tophat-bar-part').length > 1)
	{
		tophat_item_visibility_AI_show_width_middle($bar);
		$bar.find('.tophat-bar-part').each(function(i){
			debug('part '+i);
			tophat_item_visibility_AI_show_items($(this));
		})
	}
	else
	{
		tophat_item_visibility_AI_show_items($bar);
	}
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
function tophat_item_visibility_AI_hide_items($container)
{
	debug('tophat_item_visibility_AI_hide_items');
	var W = $container.width() - barPad;
	var iW = tophat_container_item_width($container);
	if(iW <= W)
		return;

	$items = [];
	$container.find('.nav-item:visible').each(function(){
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
function tophat_item_visibility_AI_show_items($container)
{
	debug('tophat_item_visibility_AI_show_items');
	var W = $container.width() - barPad;
	var iW = tophat_container_item_width($container);

	$items = [];
	$container.find('.nav-item:hidden').not('.tophat-burger').each(function(){
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
function tophat_item_visibility_AI_hide_width_middle($bar,param)
{
	debug('tophat_item_visibility_AI_hide_width_middle');

	debug('new flex ratio for middle part is reset to 1 before try some optimisation');
	$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:'1 1'});

	let W = $bar.width();
	let lW = 0;
	let mW = 0;
	let rW = 0;
	$bar.find('.tophat-bar-part[data-tophat-align="left"] > *').each(function(){ lW += $(this).outerWidth(true); });
	$bar.find('.tophat-bar-part[data-tophat-align="middle"] > *').each(function(){ mW += $(this).outerWidth(true); });
	$bar.find('.tophat-bar-part[data-tophat-align="right"] > *').each(function(){ rW += $(this).outerWidth(true); });

	debug(lW+' '+mW+' '+rW);
	let A = (mW / W)*3;
	let B = 1/((2*Math.max(lW,rW)) / W) ;
	// si la partie centrale fait moins de 1/3 de la largeur total on accorde plus de place sur les cotés
	if(A < 1)
	{
		debug('A : new flex ratio for middle part is '+(A));
		$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:(A)+' 1'});
	}
	// sinon on regarde si les éléments latéraux ont encore de la marge pour accorder de l'espace au centre
	else if(B > 1)
	{
		debug('B : new flex ratio for middle part is '+(B));
		$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:(B)+' 1'});
	}
}
function tophat_item_visibility_AI_show_width_middle($bar,param)
{
	debug('tophat_item_visibility_AI_show_width_middle');
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
function tophat_cron()
{
	tophat_item_visibility_refresh();
	tophat_centered_logo_refresh();
	tophat_burger_refresh();
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
	tophat_burger_init();
	tophat_dropdown();

	setInterval(tophat_cron,500);
});
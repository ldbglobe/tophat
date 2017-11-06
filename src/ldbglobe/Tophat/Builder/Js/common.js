// require jQuery 3.x
var TOPHAT_DEBUG = false;

function tophat_touch_support()
{
	return window.TouchEvent && 'ontouchstart' in window && 'ontouchend' in document;
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_dropdown(){
	var menuDelay = null;
	var menuToActivate = null;
	$(document).on('mouseover click','.tophat-bar-part > .nav-item',function(event){
		if(tophat_touch_support() && event.type=='mouseover')
		{
			event.stopPropagation();
			event.preventDefault();
		}
		else
		{
			menuToActivate = this;
			clearTimeout(menuDelay);
			menuDelay = setTimeout(function(){
				if(!$(menuToActivate).hasClass('hover'))
				{
					$('.tophat-bar-part > .nav-item').removeClass('hover');
					$('.tophat-bar-part .burger-item').removeClass('active');
					$(menuToActivate).addClass('hover');
				}
				else if(tophat_touch_support() && event.type=='click')
				{
					$('.tophat-bar-part > .nav-item').removeClass('hover');
					$('.tophat-bar-part .burger-item').removeClass('active');
				}
			},150);
		}
	})
	$(document).on('mouseout','.tophat-bar-part > .nav-item',function(){
		if(tophat_touch_support() && event.type=='mouseout')
		{
			event.stopPropagation();
			event.preventDefault();
		}
		else
		{
			menuToActivate = null;
			clearTimeout(menuDelay);
			menuDelay = setTimeout(function(){
				$('.tophat-bar-part > .nav-item').removeClass('hover');
				$('.tophat-bar-part .burger-item').removeClass('active');
			},250);
		}
	})
	$(document).on('mouseover click','.tophat-bar-part .nav-link',function(event){
		if(tophat_touch_support() && event.type=='mouseover')
		{
			event.stopPropagation();
			event.preventDefault();
		}
		else
		{
			if(tophat_touch_support() && !$(this).parent('.nav-item').hasClass('hover'))
			{
				event.preventDefault();
			}
		}
	});

	$(document).on('click','.burger-item',function(event){
		console.log('click .burger-item');
		event.stopPropagation();
		clearTimeout(menuDelay);
		if($(this).find('.burger-subnav').length>0)
		{
			event.preventDefault();
			$(this).addClass('active');
		}
		else
		{
			$('.tophat-bar-part > .nav-item').removeClass('hover');
		}
	})
	$(document).on('click','.burger-back',function(event){
		console.log('click .burger-back');
		event.stopPropagation();
		clearTimeout(menuDelay);
		$(this).parents('.burger-item').removeClass('active');
	});

	$(document).on('click','.burger-subnav-item',function(event){
		console.log('click .burger-subnav-item');
		event.stopPropagation();
		clearTimeout(menuDelay);
		$('.tophat-bar-part > .nav-item').removeClass('hover');
	});

	$(document).on('click','.burger-subnav',function(event){
		console.log('click .burger-subnav');
		event.stopPropagation();
		clearTimeout(menuDelay);
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

				debug('Logo centering extracted informations : W='+W+', lw='+lw+', niw='+niw+', delta='+delta);

				if(W - lw - niw - Math.abs(delta) < 0)
				{
					delta = (delta>1 ? 1:-1)*Math.round((W - lw - niw)/2);
				}

				centeredPart.css((delta>0 ? 'paddingRight':'paddingLeft'),(2*Math.abs(delta))+'px');
			}
		})
	}
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_burger_init()
{
	let burger_svg = ''
	+'<svg class="svg-icon" viewBox="0 0 38 38">'
		+'<path class="h t" d="M4 4l32 0"/>'
		+'<path d="M4 19l32 0"/>'
		+'<path class="h b" d="M4 34l32 0"/>'
		+'<path class="x" d="M19 4l0 32"/>'
	+'</svg>'
	$('.tophat-bar').each(function(){
		if($(this).find('.tophat-burger').length==0)
		{
			$(this).find('.nav-item').eq(0).before('<div class="tophat-burger nav-item" data-tophat-level="9999" data-tophat-skin="burger"><a href="javascript:void(0);" class="nav-link"><span class="label">'+burger_svg+'</span></a><ul class="nav-dropdown" data-tophat-skin="burger"></ul></div>');
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
			if(!$link.attr('href') || $subitems.length)
				$burgerlink = $('<a href="javascript:void(0);" class="burger-link" ><span class="label">'+$link.find('.label').html()+'</span></a>');
			else
				$burgerlink = $('<a class="burger-link" href="'+$link.attr('href')+'"><span class="label">'+$link.find('.label').html()+'</span></a>');

			if($burgerlink)
			{
				let $burgeritem = $('<li class="burger-item"></li>');
				$burgeritem.append($burgerlink);
				if($subitems.length)
				{
					$subnav = $('<ul class="burger-subnav"><li class="burger-back"><a href="javascript:void(0);"><span class="label">&lt;</span></a></li></ul>');

					if($link.attr('href'))
						$subnav.append('<li class="burger-subnav-item"><a href="'+$link.attr('href')+'"><span class="label">'+$link.find('.label').html()+'</span></a></li>');

					$sublink = null;
					// add dropdown item content as sub item
					$subitems.each(function(){
						let $link = $(this).children();
						if($link.attr('href'))
							$sublink = $('<li class="burger-subnav-item"><a href="'+$link.attr('href')+'"><span class="label">'+$link.find('.label').html()+'</span></a></li>');
						else
							$sublink = $('<li class="burger-subnav-item"><span><span class="label">'+$link.find('.label').html()+'</span></span></li>');

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

var barPad = 0; // bar lost space compensation

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
	var refresh_needed = false;
	debug('tophat_item_visibility_AI_hide');
	if($bar.find('.tophat-bar-part[data-tophat-align="middle"]').length > 0 && $bar.find('.tophat-bar-part').length > 1)
	{
		tophat_item_visibility_AI_hide_width_middle($bar);
		$bar.find('.tophat-bar-part').each(function(i){
			debug('part '+i);
			refresh_needed = refresh_needed || tophat_item_visibility_AI_hide_items($(this));
		})
	}
	else
	{
		refresh_needed = tophat_item_visibility_AI_hide_items($bar);
	}
	if(refresh_needed)
		$bar.addClass('content-updated');
}
function tophat_item_visibility_AI_show($bar)
{
	var refresh_needed = false;
	debug('tophat_item_visibility_AI_show');
	if($bar.find('.tophat-bar-part[data-tophat-align="middle"]').length > 0 && $bar.find('.tophat-bar-part').length > 1)
	{
		tophat_item_visibility_AI_show_width_middle($bar);
		$bar.find('.tophat-bar-part').each(function(i){
			debug('part '+i);
			refresh_needed = refresh_needed || tophat_item_visibility_AI_show_items($(this));
		})
	}
	else
	{
		refresh_needed = tophat_item_visibility_AI_show_items($bar);
	}
	if(refresh_needed)
		$bar.addClass('content-updated');
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
function tophat_item_visibility_AI_hide_items($container)
{
	debug('tophat_item_visibility_AI_hide_items');

	let refresh_needed = false;
	$container.css({flexWrap:'wrap'});
	var W = $container.width() - barPad;
	$container.css({flexWrap:''});
	var iW = tophat_container_item_width($container);
	if(iW <= W)
		return refresh_needed;

	$items = [];
	$container.find('.nav-item:visible').each(function(){
		$items.push($(this));
	});
	$items.reverse();
	$items.sort(function(a,b){ return a.data('tophatLevel') - b.data('tophatLevel'); });

	let itemLevel = null;
	for(i=0 ; i < $items.length ; i++)
	{
		// si on doit encore supprimer des items on met à jour le level de l'item en court de traitement
		if(iW > W)
			itemLevel = $items[i].data('tophatLevel');
		// sinon si le level n'est pas le même que celui précédement masqué on arrète la boucle
		else if(itemLevel != $items[i].data('tophatLevel'))
			break;

		// on masque ensuite l'élément
		iW -= $items[i].outerWidth();
		debug(W+' ? '+iW);
		if(!$items[i].hasClass('tophat-burger'))
		{
			$items[i].hide();
			refresh_needed = true;
		}

		// condition d'arrêt immédiat si la limite est atteinte (pas par groupe de level)
		//if(iW <= W) break;
	}
	return refresh_needed==true;
}
function tophat_item_visibility_AI_show_items($container)
{
	debug('tophat_item_visibility_AI_show_items');

	let refresh_needed = false;
	var W = $container.width() - barPad;
	var iW = tophat_container_item_width($container);

	$items = [];
	$container.find('.nav-item:hidden').not('.tophat-burger').each(function(){
		$items.push($(this));
	});
	$items.reverse();
	$items.sort(function(a,b){ return a.data('tophatLevel') - b.data('tophatLevel'); });
	$items.reverse();

	// on construit des group d'items en fonction de leur LEVEL
	var groups = [];
	var group = [];
	let itemLevel = null;
	for(let i=0 ; i < $items.length ; i++)
	{
		if(itemLevel != $items[i].data('tophatLevel'))
		{
			if(itemLevel!=null)
				groups.push(group);
			group = [];
			itemLevel = $items[i].data('tophatLevel');
		}
		group.push($items[i]);
	}
	if(group.length)
		groups.push(group);
	delete group;
	debug(groups);

	// pour réafficher un groupe il doit pouvoir être affiché en intégralité
	for(let i=0 ; i < groups.length ; i++)
	{
		let group = groups[i];
		for(let j=0 ; j < group.length ; j++)
		{
			iW += group[j].outerWidth();
		}

		debug(W+' ? '+iW);
		if(iW >= W)
			break;

		for(let j=0 ; j < group.length ; j++)
		{
			group[j].show();
			refresh_needed = true;
		}
	}
	return refresh_needed==true
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

	if($('.tophat-bar.content-updated').length>0)
	{
		tophat_burger_refresh();
	}
	$('.tophat-bar.content-updated').removeClass('content-updated');
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function debug(message_or_title,message){
	if(!TOPHAT_DEBUG)
		return;

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

	if(!TOPHAT_DEBUG)
		setInterval(tophat_cron,4000);

	window.addEventListener('resize', tophat_cron , true);

	tophat_cron();
});
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

	// automatic startup fix dropdown position
	$(".tophat-bar .nav-dropdown").each(function(){
		var dd = $(this);
		if(dd && dd.offset() && dd.offset().left + dd.outerWidth() > $(window).width())
		{
			var delta = $(window).width() - dd.offset().left - dd.outerWidth();
			dd.css({marginLeft:(delta)+'px'});
		}
	})

	$(document).on('mouseover click','.tophat-bar-part > .nav-item',function(event){
		if(tophat_touch_support() && event.type=='mouseover')
		{
			event.stopPropagation();
			event.preventDefault();
		}
		else
		{
			$menuToActivate = $(this);
			if($menuToActivate.hasClass('tophat-burger'))
				return;

			clearTimeout(menuDelay);
			menuDelay = setTimeout(function(){
				if(!$menuToActivate.hasClass('hover'))
				{
					$('.tophat-bar-part > .nav-item').removeClass('hover');
					// open menu
					$menuToActivate.addClass('hover');

					var dd = $menuToActivate.find(".nav-dropdown").eq(0)
					if(dd)
					{
						dd.css({marginLeft:0});
						// fix dropdown position if content overflow
					 	if(dd.offset() && dd.offset().left + dd.outerWidth() > $(window).width())
						{
							var delta = $(window).width() - dd.offset().left - dd.outerWidth();
							dd.css({marginLeft:(delta)+'px'});
						}
						// try to center dropdown under parent item
						else if($menuToActivate.outerWidth() > dd.outerWidth())
						{
							dd.css({marginLeft:(($menuToActivate.outerWidth() - dd.outerWidth())/2)+'px'});
						}
					}
				}
				else if(tophat_touch_support() && event.type=='click')
				{
					$('.tophat-bar-part > .nav-item').removeClass('hover');
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
}

function tophat_burger(){
	$(document).on('click','.tophat-bar .tophat-burger',function(event){
		$bar = $(this).parents('.tophat-bar').eq(0);
		$burger = $($bar.data('burger'));
		if($burger.hasClass('active'))
		{
			$burger.removeClass('active');
		}
		else
		{
			$('.tophat-burger-container').removeClass('active');
			$burger.addClass('active');
		}
	});

	$(document).on('click','.burger-dropdown-trigger',function(event)
	{
		console.log('click .burger-dropdown-trigger');
		event.stopPropagation();
		event.preventDefault();
		var item = $(this).parents('.burger-item').eq(0)
		$('.tophat-burger-container .burger-item').not(item).removeClass('active');
		item.toggleClass('active');
	})

	$(document).on('click','.burger-back',function(event){
		console.log('click .burger-back');
		event.stopPropagation();
		$(this).parents('.burger-item').removeClass('active');
	});

	$(document).on('click','.burger-subnav-item',function(event){
		console.log('click .burger-subnav-item');
		event.stopPropagation();
		$('.tophat-burger-container').removeClass('active');
	});

	$(document).on('click','.burger-subnav',function(event){
		console.log('click .burger-subnav');
		event.stopPropagation();
	});

	$(document).on('click touch','.tophat-burger-container',function(){
		$('.tophat-burger-container').removeClass('active');
	})
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_centered_logo_refresh()
{
	//logo width refresh
	$('.tophat-bar .tophat-bar-logo').each(function(){
		if($(this).find('img').length>0)
			var W = $(this).find('img').outerWidth();
		else
			var W = $(this).find('svg').outerWidth();

		if(W>0)
		{
			$(this).attr('logo-w',1);
			$(this).width(W);
		}
		else
		{
			$(this).attr('logo-w',0);
		}
	})

	var centeredLogos = $('.tophat-bar[data-tophat-logo="middle"]');
	if(centeredLogos.length)
	{
		centeredLogos.each(function(){
			var centeredBar = $(this);
			var centeredPart = centeredBar.find('[data-tophat-align="middle"]');

			var centeredlogo = centeredPart.find('.tophat-bar-logo');
			centeredlogo.show();
			centeredPart.css({paddingRight:'',paddingLeft:''});

			if(centeredlogo.is(':visible'))
			{
				var centeredLinks = centeredPart.find('.nav-item:visible');
				centeredLinks.each(function(i){
					$(this).css({order:i});
				})
				if(centeredLinks.length>0)
				{
					var W = centeredPart.width();

					var niw = 0;
					var i = 0;
					for(i=0; i < centeredLinks.length; i++)
					{
						niw += centeredLinks.eq(i).width();
					}
					var niPad = 0;
					var niPadAfter = 0;
					var niPadBeforeW = 0;
					var niPadAfterW = 0;
					for(i=0; i < centeredLinks.length; i++)
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
			}
		})
	}
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_burger_init()
{
	$bars = $('.tophat-bar');

	// on force un groupe pour la démo
	// $bars.attr('data-tophat-group','yolo');


	$bars.each(function(){
		tophat_burger_container($(this));
	})
}

var tophat_burger_container_idx = 0;
function tophat_burger_container($bar)
{
	if($bar.data('tophatGroup') && $bar.data('tophatBurgerPosition')=="" && $bar.data('tophatBurgerMobilePosition')=="")
	{
		$bar = $('.tophat-bar[data-tophat-group="'+$bar.data('tophatGroup')+'"]').eq(0);
	}

	var animation = $bar.data('tophatBurgerAnimation');

	if(!$bar.data('burger'))
	{
		var burger_svg = ''
		+'<svg class="svg-icon" viewBox="0 0 38 38">'
			+'<path class="h t" d="M4 4l32 0"/>'
			+'<path d="M4 19l32 0"/>'
			+'<path class="h b" d="M4 34l32 0"/>'
			+'<path class="x" d="M19 4l0 32"/>'
		+'</svg>'

		var cases = [
			{type:"desktop", position:$bar.data('tophatBurgerPosition'), order:$bar.data('tophatBurgerOrder') },
			{type:"mobile", position:$bar.data('tophatBurgerMobilePosition'), order:$bar.data('tophatBurgerMobileOrder') },
		]
		var i = null
		for(i in cases)
		{
			var type = cases[i].type;
			var position = cases[i].position;
			var order = cases[i].order;

			var burger_button = $('<div class="tophat-burger nav-item" screen="'+type+'" data-tophat-level="9999" data-tophat-skin="burger"><a href="javascript:void(0);" class="nav-link"><span class="label">'+burger_svg+'</span></a></div>');

			if(position!="")
			{
				var part = $bar.find('.tophat-bar-part[data-tophat-align="'+position+'"]');
				var items = part.find('.nav-item')
				if(items.length>0)
				{
					if(order=='last')
						items.last().after(burger_button);
					else
						items.first().before(burger_button);
				}
				else
				{
					part.append(burger_button);
				}
			}
			else
			{
				var items =  $bar.find('.nav-item');
				if(items.length>0)
				{
					if(order=='last')
						items.last().after(burger_button);
					else
						items.first().before(burger_button);
				}
			}
		}


		$burger = $(''
			+'<div onclick="void(0);" class="tophat-burger-container '+$bar.attr('class')+'" data-tophat-key="'+$bar.data('tophatKey')+'" animation="'+animation+'">'
				+'<div class="tophat-burger-content">'
					+'<div onclick="void(0);" class="tophat-burger-header"><a class="label">'+burger_svg+'</a></div>'
					+'<ul class="nav-dropdown"></ul>'
				+'</div>'
			+'</div>'
		);
		$burger.removeClass('tophat-bar');
		$burger.removeClass('init');

		$('body').append($burger);

		$burger.attr('id','burger'+tophat_burger_container_idx);
		$burger.data('bar','#bar'+tophat_burger_container_idx);

		$bar.attr('id','bar'+tophat_burger_container_idx);
		$bar.data('burger','#burger'+tophat_burger_container_idx);

		tophat_burger_container_idx++;
	}
	else
		$burger = $($bar.data('burger'));

	$burger.data('tophatBar',$bar);
	$burger.data('tophatBarGroup',$bar.data('tophatGroup'))

	return $burger;
}

function tophat_burger_refresh()
{
	// on vide tout les burger menu avant le refresh
	$('.tophat-burger-container .nav-dropdown').empty();

	$burgers = $('.tophat-burger-container');
	$burgers.each(function(){

		var $burger = $(this);
		var barGoup = $burger.data('tophatBarGroup');
		if(barGoup)
			var $bar = $('.tophat-bar[data-tophat-group="'+barGoup+'"]');
		else
			var $bar = $($burger.data('tophatBar'));

		//console.log($burger.data(),$bar);

		// si on à des éléments caché
		if($bar.find('.nav-item[data-burger="1"]').length)
		{
			// on affiche le burger menu
			$bar.find('.tophat-burger').addClass('visible');
		}
		else
		{
			// sinon on le masque
			$bar.find('.tophat-burger').removeClass('visible');
		}

		// TODO gérer les sections pour les différencier dans le dropdown burger

		$dropdown = $burger.find('.nav-dropdown');
		// si on à des éléments issu d'un autre menu
		if($dropdown.children().length>0)
			$dropdown.append('<li class="burger-separator"></li>');

		$navItems = $bar.find('.nav-item[data-burger="1"]:not([data-tophat-burgermode="never"]), .nav-item[data-tophat-burgermode="allways"]');
		$navItems.sort(function(a,b){
			// burgerlevel indique l'ordre de manière naturel
			// les plus grand vont à la fin
			var burgercomp = a.getAttribute('data-tophat-burgerlevel') - b.getAttribute('data-tophat-burgerlevel');
			if(burgercomp==0)
			{
				// si on doit exploiter le level la c'est l'inverse ceux qui sont important passe devant
				return b.getAttribute('data-tophat-level') - a.getAttribute('data-tophat-level');
			}
			return burgercomp;
		})

		currentGroup = null;
		$navItems.each(function(){
			var group = null;//$(this).data('tophatGroup');
			var item_class = $(this).attr('data-tophat-class');
			var $link = $(this).find('.nav-link');
			var $subitems = $(this).find('.nav-dropdown li');
			var $burgerlink = null;
			var $burgerlink_dropdown_trigger = null;
			var burgerlink_label = $link.find('.label');
			burgerlink_label = burgerlink_label.data('burger-label') ? burgerlink_label.data('burger-label') : burgerlink_label.html();

			if(!$link.attr('href') || $subitems.length)
			{
				$burgerlink_dropdown_trigger = $('<a href="javascript:void(0);" class="burger-link burger-dropdown-trigger" ><span class="label">'+burgerlink_label+'</span></a>');
			}
			$burgerlink = $('<a class="burger-link" href="'+$link.attr('href')+'"><span class="label">'+burgerlink_label+'</span></a>');

			if($burgerlink)
			{
				if(currentGroup != group)
				{
					if(currentGroup != null)
						$dropdown.append('<li class="burger-separator"></li>');
					currentGroup = group;
				}

				var $burgeritem = $('<li class="burger-item '+item_class+'"></li>');

				if($burgerlink_dropdown_trigger)
					$burgeritem.append($burgerlink_dropdown_trigger);
				$burgeritem.append($burgerlink);

				if($subitems.length)
				{
					$subnav = $('<ul class="burger-subnav"><li class="burger-back"><a href="javascript:void(0);"><span class="label">&lt;</span></a></li></ul>');

					if($link.attr('href'))
						$subnav.append('<li class="burger-subnav-item burger-subnav-main"><a href="'+$link.attr('href')+'"><span class="label">'+$link.find('.label').html()+'</span></a></li>');

					$sublink = null;
					// add dropdown item content as sub item
					$subitems.each(function(){
						var $link = $(this).children();
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
		});
	});
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_container_item_width($container) {
	var itemWidth = 0;

	var logo = $container.find('.tophat-bar-logo');
	if(logo.length)
		itemWidth += logo.outerWidth(true);

	var burgermenu = $container.find('.tophat-burger.nav-item');
	if(burgermenu.length)
		itemWidth += burgermenu.outerWidth(true);

	$container.find('.nav-item:visible').each(function(j){
		var $item = $(this);
		var w = Math.floor($item.outerWidth(true));
		itemWidth += w;
	});
	return itemWidth;
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_item_visibility_refresh(){
	$bars = $('.tophat-bar');
	$bars.each(function(){
		var $bar = $(this);
		tophat_item_visibility_AI_adjust_width_middle($bar);
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
	var enough_space = true;
	var itemWidth = 0;
	$parts.each(function(i){
		var $part = $(this);
		var W = Math.floor($part.width());
		//debug('part('+i+') : '+W+'px');

		var iW = 0;
		var logo = $part.find('.tophat-bar-logo:visible');
		if(logo.length) iW += logo.width();

		$part.find('.nav-item:visible').each(function(j){
			var $item = $(this);
			var w = Math.floor($item.outerWidth(true));
			iW += w;
			//debug('part('+i+') item('+j+') : '+w+'px (inside a '+W+'px container)');
		})
		itemWidth += iW;
		debug('part('+i+') totalize '+iW+'px content in a '+W+'px container');
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

	var refresh_needed = false;
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

	var itemLevel = null;
	for(i=0 ; i < $items.length ; i++)
	{
		// si on doit encore supprimer des items on met à jour le level de l'item en court de traitement
		if(iW > W)
			itemLevel = $items[i].data('tophatLevel');
		// sinon si le level n'est pas le même que celui précédement masqué on arrète la boucle
		else if(itemLevel != $items[i].data('tophatLevel'))
			break;

		// on masque ensuite l'élément
		if(!$items[i].hasClass('tophat-burger') && $items[i].data('tophat-level')<999)
		{
			iW -= $items[i].outerWidth(true);
			debug(W+' ? '+iW);

			$items[i].hide();
			$items[i].attr('data-burger',1);
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

	var refresh_needed = false;
	var W = $container.width() - barPad;
	var iW = tophat_container_item_width($container);

	$items = [];
	$container.find('.nav-item[data-burger="1"]').each(function(){
		$items.push($(this));
	});
	$items.reverse();
	$items.sort(function(a,b){ return a.data('tophatLevel') - b.data('tophatLevel'); });
	$items.reverse();

	// on construit des group d'items en fonction de leur LEVEL
	var groups = [];
	var group = [];
	var itemLevel = null;
	for(i=0 ; i < $items.length ; i++)
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
	for(i=0 ; i < groups.length ; i++)
	{
		var group = groups[i];
		for(j=0 ; j < group.length ; j++)
		{
			iW += group[j].outerWidth();
		}

		debug(W+' ? '+iW);
		if(iW >= W)
			break;

		for(j=0 ; j < group.length ; j++)
		{
			group[j].show();
			group[j].attr('data-burger',0);
			refresh_needed = true;
		}
	}
	return refresh_needed==true
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
function tophat_item_visibility_AI_adjust_width_middle($bar,param)
{
	debug('tophat_item_visibility_AI_adjust_width_middle');

	debug('new flex ratio for middle part is reset to 1 before try some optimisation');
	$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:'1 1'});

	var W = $bar.width();
	var lW = 0;
	var mW = 0;
	var rW = 0;
	$bar.find('.tophat-bar-part[data-tophat-align="left"] > *').each(function(){ lW += $(this).outerWidth(true); });
	$bar.find('.tophat-bar-part[data-tophat-align="middle"] > *').each(function(){ mW += $(this).outerWidth(true); });
	$bar.find('.tophat-bar-part[data-tophat-align="right"] > *').each(function(){ rW += $(this).outerWidth(true); });

	// New size fix (way better ^^)
	var LW = lW / W;
	var MW = mW / W;
	var RW = rW / W;
	var SW = Math.max(LW,RW);

	//console.log(W,MW,2*SW);

	if(MW+2*SW > 1) // pas assé de place
	{
		var A = 0.95*(1-2*SW) * 1/SW;
		//console.log('Not Enough width : new flex ratio for middle part is '+(A));
		$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:(A)+' 1'});
	}
	else
	{
		var A = MW * 1/SW;
		//console.log('Enough width : new flex ratio for middle part is '+(A));
		$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:(A)+' 1'});
	}
	return;

	/*
	// Original size fix method

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
	*/
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

var deferal_cron_timeout = null;
var deferal_cron_timeout2 = null;
function deferal_cron()
{
	clearTimeout(deferal_cron_timeout);
	clearTimeout(deferal_cron_timeout2);
	deferal_cron_timeout = setTimeout(function(){
		tophat_cron();
		deferal_cron_timeout2 = setTimeout(function(){
			tophat_cron();
		}, 500);
	}, 100);
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

$(document).ready(function() {
	$('.tophat-bar').addClass('init');

	tophat_burger_init();
	tophat_dropdown();
	tophat_burger();


	if(!TOPHAT_DEBUG)
	{
		setTimeout(tophat_cron,10);
		setInterval(deferal_cron,2000); // regular refresh every 2 seconds
	}

	setTimeout(function(){
		window.addEventListener('resize', deferal_cron , true); // immediat refrehs on resize
		window.addEventListener('scroll', deferal_cron , true); // defered refresh on scroll
		window.addEventListener('orientationchange', deferal_cron , true); // defered on orientation change too
	},500);

	deferal_cron();
});
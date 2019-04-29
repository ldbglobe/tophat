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

	$(document).on('click','.tophat-bar-part > .nav-item > .nav-group a',function(event){
		event.stopPropagation();
		return true;
	});
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
	$(document).on('mouseover click','.tophat-bar-part > .nav-item > .nav-link',function(event){
		if($(this).attr('href').match('javascript:'))
		{
			// bouton avec un link pure javascript on ne fait rien de particulier ici sous peine de tout casser
		}
		else
		{
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
		}
	});
}

window.tophat_burger_toggle_active = function(el,event)
{
	$bar = $(el).parents('.tophat-bar').eq(0);
	$burgerMenu = $(el).parents('.tophat-burger').eq(0);
	if($burgerMenu.hasClass('active'))
	{
		$('.tophat-bar .tophat-burger').removeClass('active');
	}
	else
	{
		$burgerMenu.addClass('active');
	}
}

window.tophat_burger_close = function()
{
	$('.tophat-burger-container').removeClass('active');
	$('.tophat-bar .tophat-burger').removeClass('active');
}

window.tophat_burger_open = function(el,event)
{
	event.preventDefault();
	$bar = $(el).parents('.tophat-bar').eq(0);
	$burgerMenu = $(el).parents('.tophat-burger').eq(0);
	$burgerPanel = $($bar.data('burger'));
	if($burgerPanel.hasClass('active'))
	{
		$('.tophat-burger-container').removeClass('active');
		$('.tophat-bar .tophat-burger').removeClass('active');
	}
	else
	{
		$('.tophat-burger-container').removeClass('active');
		$burgerPanel.addClass('active');
		$burgerMenu.addClass('active');
	}
}

function tophat_burger(){

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
		$('.tophat-bar .tophat-burger').removeClass('active');
	});

	$(document).on('click','.burger-subnav',function(event){
		console.log('click .burger-subnav');
		event.stopPropagation();
	});

	$(document).on('click touch','.tophat-burger-container, .tophat-burger-header, .tophat-burger-close',function(){
		$('.tophat-burger-container').removeClass('active');
		$('.tophat-bar .tophat-burger').removeClass('active');
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
		else if($(this).find('svg').length>0)
			var W = $(this).find('svg').outerWidth();
		else if($(this).find('object').length>0)
			var W = $(this).find('object').outerWidth();
		else
			var W = $(this).find('embed').outerWidth();

		if(W>0)
		{
			$(this).attr('logo-w',1);
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

			if(centeredlogo.is(':visible'))
			{

				var centeredLinks = centeredPart.find('.nav-item:visible');
				//console.log(centeredLinks);
				centeredLinks.each(function(i){
					$(this).css({order:i});
				})
				var delta = 0;
				if(centeredLinks.length>0)
				{
					var pad = 0;
					var W = centeredPart.width();
					var w = 0;
					for(var i=0; i < centeredLinks.length; i++)
					{
						w += centeredLinks.eq(i).outerWidth();
					}
					var lw = centeredlogo.width();

					var logoIndex = 0;
					var w1 = 0;
					var w1B = 0;
					for(var i=0; i < centeredLinks.length; i++)
					{
						w1 = w1B;
						w1B += centeredLinks.eq(i).outerWidth();
						logoIndex = i;
						if(w1B >= w/2)
						{
							break;
						}
					}
					var w2 = w - w1;
					var w2B = w - w1B;
					delta = w2-w1
					var deltaB = w2B-w1B

					// on regarde si l'option B est plus "équilibré"
					if(Math.abs(deltaB)<Math.abs(delta))
					{
						delta = deltaB;
						logoIndex = Math.max(0,logoIndex+1);
					}

					centeredlogo.css({
						order:logoIndex,
					});
				}
				centeredPart.css({transform:'translateX('+Math.round(delta/2)+'px)'});
				centeredPart.attr('lostspace',Math.abs(delta));
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

	var burger_label = $bar.data('tophatBurgerLabel');
	var burger_custom_link = $bar.data('tophatBurgerLink');
	var animation = $bar.data('tophatBurgerAnimation');
	var extra_header = $bar.data('tophatBurgerHeader');
	var extra_prepend = $bar.data('tophatBurgerPrepend');
	var extra_append = $bar.data('tophatBurgerAppend');

	if(!$bar.data('burger'))
	{
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

			var burger_button = null;
			if(burger_custom_link)
				burger_button = $('<div class="tophat-burger nav-item" screen="'+type+'" data-tophat-level="9999" data-tophat-skin="burger"><a href="'+burger_custom_link+'" onclick="tophat_burger_toggle_active(this,event)" class="nav-link"><span class="label"><span aria-label="Open menu">≡</span></span>'+(burger_label ? '<span class="label-text">'+burger_label+'</span>':'')+'</a></div>');
			else
				burger_button = $('<div class="tophat-burger nav-item" screen="'+type+'" data-tophat-level="9999" data-tophat-skin="burger"><a href="#" onclick="tophat_burger_open(this,event)" class="nav-link"><span class="label"><span aria-label="Open menu">≡</span></span>'+(burger_label ? '<span class="label-text">'+burger_label+'</span>':'')+'</a></div>');

			if(position!="")
			{
				var part = $bar.find('.tophat-bar-part[data-tophat-align="'+position+'"]');
				var items = part.find('.nav-item')
				if(false && items.length>0)
				{
					if(order=='last')
						items.last().after(burger_button);
					else
						items.first().before(burger_button);
				}
				else
				{
					if(order=='last')
						part.append(burger_button);
					else
						part.prepend(burger_button);
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
					+'<div onclick="void(0);" class="tophat-burger-header">'
						+'<button class="tophat-burger-close"><span aria-label="Close menu">✕</span></button>'
						+'<div class="tophat-burger-header-content">'+extra_header+'</div>'
					+'</div>'
					+'<div onclick="void(0);" class="tophat-burger-body">'
						+'<button class="tophat-burger-close"><span aria-label="Close menu">✕</span></button>'
						+'<div class="tophat-burger-body-prepend">'+extra_prepend+'</div>'
						+'<div class="tophat-burger-body-content"><ul class="nav-dropdown"></ul></div>'
						+'<div class="tophat-burger-body-append">'+extra_append+'</div>'
					+'</div>'
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

			if($subitems.length)
			{
				$burgerlink_dropdown_trigger = $('<a href="javascript:void(0);" class="burger-link burger-dropdown-trigger" ><span class="label">'+burgerlink_label+'</span></a>');
			}

			if($link.attr('href') && $link.attr('href').length>0 && $link.attr('href')!='javascript:void(0);')
			{
				$burgerlink = $('<a class="burger-link" href="'+$link.attr('href')+'"><span class="label">'+burgerlink_label+'</span></a>');
			}
			else
			{
				$burgerlink = $('<span class="burger-link"><span class="label">'+burgerlink_label+'</span></span>');
			}


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

					if($link.attr('href') && $link.attr('href').length>0 && $link.attr('href')!='javascript:void(0);')
					{
						$subnav.append('<li class="burger-subnav-item burger-subnav-main"><a href="'+$link.attr('href')+'"><span class="label">'+$link.find('.label').html()+'</span></a></li>');
					}

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
			//console.log('tophat_item_visibility_AI_show',$bar[0]);
			tophat_item_visibility_AI_show($bar)
		}
		else
		{
			//console.log('tophat_item_visibility_AI_hide',$bar[0]);
			tophat_item_visibility_AI_hide($bar)
		}
	});

	if($(window).width()>980)
	{
		$('.tophat-bar-part > .nav-item').css({order:''});
	}
	else
	{
		$('.tophat-bar-part > .nav-item').each(function(){
			$(this).css({order:$(this).attr('data-tophat-burgerlevel')});
		})
	}
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

var barPad = 0; // bar lost space compensation

function barpart_UsefulleWith($part)
{
	return Math.floor($part.width() - barPad - ($part.attr('lostspace') ? $part.attr('lostspace'):0));
}

function tophat_item_visibility_overall_detection($bar) {

	// on élimine les règles CSS qui conflictuel
	$bar.find('.tophat-bar-part').css({flexWrap:'wrap','paddingLeft':'', 'paddingRight':''});

	$parts = $bar.find('.tophat-bar-part');
	var enough_space = true;
	var itemWidth = 0;
	$parts.each(function(i){
		var $part = $(this);
		var W = barpart_UsefulleWith($part);
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
	//debug('tophat_item_visibility_AI_hide');
	if($bar.find('.tophat-bar-part[data-tophat-align="middle"]:visible').length > 0 && $bar.find('.tophat-bar-part').length > 1)
	{
		$bar.find('.tophat-bar-part').each(function(i){
			//debug('part '+i);
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
	//debug('tophat_item_visibility_AI_show');
	if($bar.find('.tophat-bar-part[data-tophat-align="middle"]:visible').length > 0 && $bar.find('.tophat-bar-part').length > 1)
	{
		tophat_item_visibility_AI_show_width_middle($bar);
		$bar.find('.tophat-bar-part').each(function(i){
			//debug('part '+i);
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
	//debug('tophat_item_visibility_AI_hide_items');

	var refresh_needed = false;
	$container.css({flexWrap:'wrap'});
	var W = barpart_UsefulleWith($container);
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
			//debug(W+' ? '+iW);

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
	//debug('tophat_item_visibility_AI_show_items');

	var refresh_needed = false;
	var W = barpart_UsefulleWith($container);
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
	//debug(groups);

	// pour réafficher un groupe il doit pouvoir être affiché en intégralité
	for(i=0 ; i < groups.length ; i++)
	{
		var group = groups[i];
		for(j=0 ; j < group.length ; j++)
		{
			iW += group[j].outerWidth();
		}

		//debug(W+' ? '+iW);
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
	//debug('tophat_item_visibility_AI_adjust_width_middle');
	//debug('new flex ratio for middle part is reset to 1 before try some optimisation');

	var wW = $(window).width();
	var screen = wW>980 ? 'desktop':'mobile';

	// si on à des éléments visible au milieu
	if($bar.find('.tophat-bar-part[data-tophat-align="middle"] > [screen="'+screen+'"], .tophat-bar-part[data-tophat-align="middle"] > [screen="both"]').length>0)
	{
		if($bar.find('.tophat-bar-part[data-tophat-align="middle"]:visible').length==0)
		{
			$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:'1 1'});
			$bar.find('.tophat-bar-part[data-tophat-align="middle"]').show();
		}

		var W = $bar.width();
		var lW = 0;
		var mW = 0;
		var rW = 0;

		$bar.find('.tophat-bar-part[data-tophat-align="left"] > [screen="'+screen+'"]').each(function(){ lW += $(this).outerWidth(true); });
		$bar.find('.tophat-bar-part[data-tophat-align="left"] > [screen="both"]').each(function(){ lW += $(this).outerWidth(true); });

		$bar.find('.tophat-bar-part[data-tophat-align="middle"] > [screen="'+screen+'"]').each(function(){ mW += $(this).outerWidth(true); });
		$bar.find('.tophat-bar-part[data-tophat-align="middle"] > [screen="both"]').each(function(){ mW += $(this).outerWidth(true); });

		$bar.find('.tophat-bar-part[data-tophat-align="right"] > [screen="'+screen+'"]').each(function(){ rW += $(this).outerWidth(true); });
		$bar.find('.tophat-bar-part[data-tophat-align="right"] > [screen="both"]').each(function(){ rW += $(this).outerWidth(true); });

		//console.log(W,lW,mW,rW);

		// New size fix (way better ^^)
		var LW = lW / W;
		var MW = mW / W;
		var RW = rW / W;
		var SW = Math.max(LW,RW);

		//console.log(W,LW,MW,2*SW);

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
		return true;
	}
	// sinon on travail comme si le milieu n'était pas présent
	else
	{
		$bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({flex:'1 1'});
		$bar.find('.tophat-bar-part[data-tophat-align="middle"]').hide();
		return false;
	}
}
function tophat_item_visibility_AI_show_width_middle($bar,param)
{
	//debug('tophat_item_visibility_AI_show_width_middle');
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
tophat_cron_in_progress = false;
function tophat_cron()
{
	if(!tophat_cron_in_progress)
	{
		tophat_cron_in_progress = true
		tophat_item_visibility_refresh();
		tophat_centered_logo_refresh();
		tophat_item_visibility_refresh();
		tophat_centered_logo_refresh();

		$('.tophat-bar').find('.tophat-bar-part').each(function(){
			$(this).show();
			if($(this).find('>*:visible').length==0)
			{
				$(this).hide();
			}
		})

		if($('.tophat-bar.content-updated').length>0)
		{
			tophat_burger_refresh();
		}
		$('.tophat-bar.content-updated').removeClass('content-updated');
		tophat_cron_in_progress = false;
	}
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
function deferal_cron()
{
	clearTimeout(deferal_cron_timeout);
	deferal_cron_timeout = setTimeout(function(){ tophat_cron(); }, 100);
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

$( document ).ready(function() {
	window.setTimeout(_init, 0)
});

function _init() {
	$('.tophat-bar').addClass('init').addClass('content-updated');
	tophat_burger_init();
	tophat_dropdown();
	tophat_burger();

	if(!TOPHAT_DEBUG)
	{
		setTimeout(tophat_cron,50);
		setInterval(deferal_cron,2000); // regular refresh every 2 seconds
	}
	else
	{
		setTimeout(tophat_cron,500);
	}

	setTimeout(function(){
		window.addEventListener('resize', _handler); // immediat refrehs on resize
		window.addEventListener('scroll', _handler); // defered refresh on scroll
		window.addEventListener('orientationchange', _handler); // defered on orientation change too
	},500);

	deferal_cron();
}

var _requestAnimationFrame

function _handler () {
	_requestAnimationFrame(deferal_cron)
}

_requestAnimationFrame = window.requestAnimationFrame ||
						 window.webkitRequestAnimationFrame ||
						 window.mozRequestAnimationFrame ||
						 function (callback) {
							window.setTimeout(callback, 0)
						 }
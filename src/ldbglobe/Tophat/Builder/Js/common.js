// require jQuery 3.x
var TOPHAT_DEBUG = false;

function getIOSVersion() {
    const ua = navigator.userAgent;
    if (/(iPhone|iPod|iPad)/i.test(ua)) {
        return ua.match(/OS [\d_]+/i)[0].substr(3).replace(',','_').split('_').map(function(n){ return parseInt(n); });
    }
    return [0];
}
var iosV = getIOSVersion();
var TOPHAT_FULLY_ACTIVATED = iosV[0]==0 || iosV[0]>10;

function tophat_touch_support()
{
	return window.TouchEvent && "ontouchstart" in window && "ontouchend" in document;
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_dropdown(){
	var menuDelay = null;
	var $menuToActivate = null;

	// automatic startup fix dropdown position
	$(".tophat-bar .nav-dropdown").each(function(){
		var dd = $(this);
		if(dd && dd.offset() && dd.offset().left + dd.outerWidth() > $(window).width())
		{
			var delta = $(window).width() - dd.offset().left - dd.outerWidth();
			dd.css({marginLeft:(delta)+'px'});
		}
	});

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

					var dd = $menuToActivate.find(".nav-dropdown").eq(0);
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
	});
	$(document).on('mouseout','.tophat-bar-part > .nav-item',function(){
		if(tophat_touch_support() && event.type=='mouseout')
		{
			event.stopPropagation();
			event.preventDefault();
		}
		else
		{
			$menuToActivate = null;
			clearTimeout(menuDelay);
			menuDelay = setTimeout(function(){
				$('.tophat-bar-part > .nav-item').removeClass('hover');
			},250);
		}
	});
	$(document).on('mouseover click','.tophat-bar-part > .nav-item > .nav-link',function(event){
		if($(this).attr('href').match(/javascript:/))
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

window.tophat_burger_toggle_active = function(el,event) {
	var $bar = $(el).parents('.tophat-bar').eq(0);
	var $burgerMenu = $(el).parents('.tophat-burger').eq(0);
	if($burgerMenu.hasClass('active'))
	{
		$('.tophat-bar .tophat-burger').removeClass('active');
	}
	else
	{
		$burgerMenu.addClass('active');
	}
};

window.tophat_burger_close = function()
{
	$('.tophat-burger-container').removeClass('active');
	$('.tophat-bar .tophat-burger').removeClass('active');
};

window.tophat_burger_open = function(el,event)
{
	event.preventDefault();
	var $bar = $(el).parents('.tophat-bar').eq(0);
	var $burgerMenu = $(el).parents('.tophat-burger').eq(0);
	var $burgerPanel = $($bar.data('burger'));
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
};

function tophat_burger(){

	$(document).on('click','.burger-dropdown-trigger',function(event)
	{
		console.log('click .burger-dropdown-trigger');
		event.stopPropagation();
		event.preventDefault();
		var item = $(this).parents('.burger-item').eq(0);
		$('.tophat-burger-container .burger-item').not(item).removeClass('active');
		item.toggleClass('active');
	});

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
	});
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function tophat_burger_init()
{
	var $bars = $('.tophat-bar-real');
	$bars.each(function(){
		tophat_burger_container($(this));
	});
}

function tophat_burger_container($bar)
{
	if($bar.data('tophatGroup') && $bar.data('tophatBurgerPosition')=="" && $bar.data('tophatBurgerMobilePosition')=="")
	{
		$bar = $('.tophat-bar-real[data-tophat-group="'+$bar.data('tophatGroup')+'"]').eq(0);
	}

	var burger_label = $bar.data('tophatBurgerLabel');
	var burger_custom_link = $bar.data('tophatBurgerLink');
	var animation = $bar.data('tophatBurgerAnimation');
	var extra_header = $bar.data('tophatBurgerHeader');
	var extra_prepend = $bar.data('tophatBurgerPrepend');
	var extra_append = $bar.data('tophatBurgerAppend');
	var $burger = null;

	if(!$bar.data('burger'))
	{
		var cases = [
			{type:"desktop", position:$bar.data('tophatBurgerPosition'), order:$bar.data('tophatBurgerOrder') },
			{type:"mobile", position:$bar.data('tophatBurgerMobilePosition'), order:$bar.data('tophatBurgerMobileOrder') },
		];
		var i = null;
		if(cases.length>0)
		{
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

				var burgerInjectionOk = false;
				if(position!="")
				{
					var part = $bar.find('.tophat-bar-part[data-tophat-align="'+position+'"]');
					if(part.length>0)
					{
						burgerInjectionOk = true;

						if(order=='last')
							part.append(burger_button);
						else
							part.prepend(burger_button);
					}
				}

				if(!burgerInjectionOk)
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

		var tophat_burger_container_idx = $bar.data('idx');

		$burger.attr('id','burger'+tophat_burger_container_idx);
		$burger.data('bar','#bar'+tophat_burger_container_idx);
		$bar.data('burger','#burger'+tophat_burger_container_idx);
	}
	else
		$burger = $($bar.data('burger'));

	$burger.data('tophatBar',$bar);
	$burger.data('tophatBarGroup',$bar.data('tophatGroup'));

	return $burger;
}

function tophat_burger_refresh()
{
	// on vide tout les burger menu avant le refresh
	$('.tophat-burger-container .nav-dropdown').empty();

	var $burgers = $('.tophat-burger-container');
	$burgers.each(function(){

		var $bar = null;
		var $burger = $(this);
		var barGoup = $burger.data('tophatBarGroup');
		if(barGoup)
			$bar = $('.tophat-bar-real[data-tophat-group="'+barGoup+'"]');
		else
			$bar = $($burger.data('tophatBar'));

		// TODO gérer les sections pour les différencier dans le dropdown burger

		var $dropdown = $burger.find('.nav-dropdown');
		// si on à des éléments issu d'un autre menu
		if($dropdown.children().length>0)
			$dropdown.append('<li class="burger-separator"></li>');

		var $navItems = $bar.find('.nav-item[data-burger="1"]:not([data-tophat-burgermode="never"]), .nav-item[data-tophat-burgermode="allways"]');

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
		});

		var currentGroup = null;
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
					var $subnav = $('<ul class="burger-subnav"><li class="burger-back"><a href="javascript:void(0);"><span class="label">&lt;</span></a></li></ul>');

					if($link.attr('href') && $link.attr('href').length>0 && $link.attr('href')!='javascript:void(0);')
					{
						$subnav.append('<li class="burger-subnav-item burger-subnav-main"><a href="'+$link.attr('href')+'"><span class="label">'+$link.find('.label').html()+'</span></a></li>');
					}

					var $sublink = null;
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
					});

					$burgeritem.append($subnav);
				}
				$dropdown.append($burgeritem);
			}
		});
	});
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
var tophat_cron_in_progress = false;
function tophat_cron()
{
	if(!tophat_cron_in_progress)
	{
		tophat_cron_in_progress = true;

		v3_tophat_bar_refresh();

		if(true || $('.tophat-bar.content-updated').length>0)
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
	deferal_cron_timeout = setTimeout(function(){ tophat_cron(); }, 50);
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

$( document ).ready(function() {
	window.setTimeout(_init, 0);
});

function _init() {
	$('.tophat-bar').addClass('init').addClass('content-updated');

	if(TOPHAT_FULLY_ACTIVATED)
	{
		v3_tophat_init();
		tophat_burger_init();
		tophat_burger();
	}
	else {
		$('.tophat-bar').addClass('compatibility-mode')
	}
	
	tophat_dropdown();

	if(TOPHAT_FULLY_ACTIVATED)
	{
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
	}
}

var _requestAnimationFrame;

function _handler () {
	_requestAnimationFrame(deferal_cron);
}

_requestAnimationFrame = window.requestAnimationFrame ||
						 window.webkitRequestAnimationFrame ||
						 window.mozRequestAnimationFrame ||
						 function (callback) {
							window.setTimeout(callback, 0);
						 };

//----------------------------------------------------------------------
//----------------------------------------------------------------------

var tophat_bar_idx = 0;
function v3_tophat_init()
{
	$('.tophat-bar').each(function(){
		var bar = $(this);

		// si aucun élément de navigation n'a de level autre que 0
		// booking trigger et language menu => level 999 (comportement du moteur de rendu précédent)
		if(bar.find('.nav-item').filter(function() { return parseInt($(this).data("tophatLevel")) > 0; }).length==0)
		{
			bar.find('.nav-item.BookingTrigger').attr('data-tophat-level',999);
			bar.find('.nav-item.LanguageMenu').attr('data-tophat-level',999);
		}


		bar.find('.tophat-bar-logo').attr('logo-w',1);
		bar.find('.tophat-bar-logo').show();
		bar.find('.nav-item').each(function(idx){
			$(this).data('idx',idx);
			$(this).addClass('nav-item-'+idx);
		});

		var clone = bar.clone();

		bar.data('idx',tophat_bar_idx);
		bar.attr('id','bar'+tophat_bar_idx);

		clone.data('idx',tophat_bar_idx);
		clone.attr('id','barclone'+tophat_bar_idx);

		tophat_bar_idx++;

		bar.addClass('tophat-bar-real');
		clone.addClass('tophat-bar-clone').attr('style','pointer-events:none !important;position:fixed !important;width:100% !important;top:-99999999999px !important;');
		bar.parent().css({position:'relative'});
		bar.parent().append(clone);
	});
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function v3_tophat_bar_refresh()
{
	$('.tophat-bar-real').each(function(){
		var bar = $(this);
		var screen = v3_getScreen();

		// application de l'ordre mobile / desktop
		if(screen=='desktop')
		{
			bar.find('.nav-item').not('.tophat-burger').each(function(i){
				$(this).css({order:i*10});
			});
		}
		else
		{
			bar.find('.nav-item').not('.tophat-burger').sort(function(a,b){
				return $(a).attr('data-tophat-burgerlevel') - $(b).attr('data-tophat-burgerlevel');
			}).each(function(i){
				$(this).css({order:i*10});
			});
		}

		var idx = $(this).data('idx');
		var clone = $('#barclone'+idx);

		var middleLogo = bar.find('.tophat-bar-part[data-tophat-align="middle"] .tophat-bar-logo[screen="'+screen+'"]');

		var hiddenItemsWidth = v3_refresh_step1(bar,clone,screen,middleLogo); // hide nav item until all content fits in - do not care of logo position
		v3_refresh_step2(bar,clone,screen,middleLogo); // try to center logo and hide more content if needed
	});
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function v3_refresh_step1(bar,clone,screen,middleLogo) {
	// hide nav item until all content fits in - do not care of logo position
	var barWidth = bar.width();
	var cumulativeWidth = 0;
	var navItems = bar.find('.tophat-bar-part > .nav-item[screen="'+screen+'"], .tophat-bar-part > .nav-item[screen="both"]');

	var itemToHide = navItems.not('.tophat-burger').filter(function(){ return $(this).data('tophatLevel') < 999; }).sort(function(a,b){
		var diff = a.getAttribute('data-tophat-level') - b.getAttribute('data-tophat-level');
		return diff == 0 ? -1 : diff;
	});

	// si on à logo central on compensera une partie de sa taille pour son centrage
	var middleLogoWidth = middleLogo.length>0 ? middleLogo.outerWidth(true) : 0;

	var hiddenItemsWidth = 0;
	var lastItemLevel = -999999;
	itemToHide.each(function(){
		var item = $(this);

		var itemLevel = item.data('tophatLevel');
		if(itemLevel!==lastItemLevel)
		{
			lastItemLevel = itemLevel;

			var itemWithSameLevel = itemToHide.filter('[data-tophat-level="'+itemLevel+'"]');
			//console.log(itemLevel,itemWithSameLevel);

			var itemWidth = v3_navItemWith(bar,clone,itemWithSameLevel);

			itemWithSameLevel.css({display:''});
			cumulativeWidth = v3_cumulativeWidth(bar,clone) - hiddenItemsWidth + v3_burgerWidth(bar,clone) + middleLogoWidth;

			if(barWidth < cumulativeWidth)
			{
				hiddenItemsWidth += itemWidth;
				itemWithSameLevel.css({display:'none'});
				itemWithSameLevel.attr('data-burger',1);
				navItems.filter('.tophat-burger[screen="'+screen+'"]').show();
			}
			else
			{
				itemWithSameLevel.css({display:''});
				itemWithSameLevel.attr('data-burger',0);
			}
		}
	});

	if(hiddenItemsWidth==0)
	{
		//console.log('Hide burger')
		if(!bar.is('[data-tophat-burger-visibility="always"]'))
			navItems.filter('.tophat-burger[screen="desktop"]').hide();
		if(!bar.is('[data-tophat-burger-mobile-visibility="always"]'));
			navItems.filter('.tophat-burger[screen="mobile"]').hide();
	}

	return hiddenItemsWidth;
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function v3_refresh_step2(bar,clone,screen,middleLogo) {

	if(middleLogo.length>0)
	{
		var middleLogoWidth = middleLogo.outerWidth(true);
		var fWidth = 0;
		var lPart = 0;
		var rPart = 0;
		var logoOrderIndex = 0;
		var items = bar.find('.tophat-bar-part[data-tophat-align="middle"] .nav-item:visible').sort(function(a,b){
			return parseInt($(a).css('order')) - parseInt($(b).css('order'));
		});

		// on détermine l'espace dispo pour glisser sur les 2 cotés
		var temp = null;

		var middleTranslate = bar.data('middleTranslate') || 0;

		var L = bar.find('.tophat-bar-part[data-tophat-align="left"]').outerWidth(true);
		temp = bar.find('.tophat-bar-part[data-tophat-align="left"] > *:visible');
		var oL = null;
		temp.each(function(){ 
			if(oL===null || oL < $(this).offset().left + temp.outerWidth(true)) oL = $(this).offset().left + temp.outerWidth(true);
		});

		var R = bar.find('.tophat-bar-part[data-tophat-align="right"]').outerWidth(true);
		temp = bar.find('.tophat-bar-part[data-tophat-align="right"] > *:visible');
		var oR = null;
		temp.each(function(){ 
			if(oR===null || oR > $(this).offset().left) oR = $(this).offset().left;
		});

		temp = bar.find('.tophat-bar-part[data-tophat-align="middle"] > *:visible');
		var oMl = null;
		var oMr = null;
		temp.each(function(){ 
			if(oMl===null || oMl > $(this).offset().left) oMl = $(this).offset().left;
			if(oMr===null || oMr < $(this).offset().left + temp.outerWidth(true)) oMr = $(this).offset().left + temp.outerWidth(true);
		});
		oMl = oMl - middleTranslate;
		oMr = oMr - middleTranslate;

		var deltaLeft = oMl - oL;
		var deltaRight = oR - oMr;

		//console.log(oL,oMl,oMr,oR)

		//console.log(deltaLeft,deltaRight,middleTranslate,middleLogo.outerWidth(true))
	
		items.each(function(){
			//console.log(this)
			fWidth += v3_navItemWith(bar,clone,$(this));
		});

		items.each(function(){
			var item = $(this);
			var w = v3_navItemWith(bar,clone,item);
			if(lPart + rPart < fWidth/2 && lPart + rPart + w >= fWidth/2) // on franchit le milieu
			{
				// on détermine alors si il faut laisser le logo avant ou le placer après
				// [ lpart | lDelta || rDelta |      ]
				var lDelta = fWidth/2 - lPart;
				var rDelta = lPart + w - fWidth/2;

				//console.log(lDelta, rDelta, deltaLeft - rDelta)

				if(lDelta <= rDelta && deltaLeft - rDelta > 0)
				{
					logoOrderIndex = v3_navItemOrderIndex(bar,clone,item) - 1;
					rPart += w;
				}
				else
				{
					logoOrderIndex = v3_navItemOrderIndex(bar,clone,item) + 1;
					lPart += w;
				}
			}
			else if(lPart + rPart <= fWidth/2)
			{
				lPart += w;
			}
			else
			{
				rPart += w;
			}
			//console.log(fWidth/2, lPart, rPart);
		});
		var logoDelta = Math.ceil((rPart - lPart + R - L) / 2);

		//console.log(fWidth/2, lPart, rPart, logoOrderIndex, logoDelta);
		
		// on place le logo à sa place
		middleLogo.css({order:logoOrderIndex});
		// et on recale la partie centrale
		if(!(logoDelta<0 && deltaLeft+logoDelta>0 || logoDelta>0 && deltaRight-logoDelta>0))
			logoDelta = 0;

		bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({transform:'translateX('+logoDelta+'px)'});
		bar.data('middleTranslate',logoDelta);
	}
	else
	{
		bar.find('.tophat-bar-part[data-tophat-align="middle"]').css({transform:''});
	}
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function v3_getScreen() {
	return window.innerWidth > 980 ? 'desktop':'mobile';
}

function v3_cumulativeWidth(bar,clone) {
	var cumulativeWidth = 0;
	clone.find('.tophat-bar-part > *:visible').each(function(){
		var item = $(this);
		cumulativeWidth += Math.ceil(item.outerWidth(true));
	});
	return cumulativeWidth;
}

function v3_burgerWidth(bar,clone) {
	var burgerWidth  = 0;
	bar.find('.tophat-burger[screen="'+v3_getScreen()+'"]:visible').each(function(){
		burgerWidth += Math.floor($(this).outerWidth(true));
	});
	return burgerWidth;
}

function v3_navItemWith(bar,clone,item) {
	var w = 0;
	item.each(function(){
		var idx = item.data('idx');
		w+=  Math.floor(clone.find('.nav-item-'+idx).outerWidth(true));
	});
	return w;
}

function v3_navItemOrderIndex(bar,clone,item) {
	return parseInt(item.css('order'));
}
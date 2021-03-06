<?php
require "../vendor/autoload.php";

use ldbglobe\Tophat\Tophat;
use ldbglobe\Tophat\Tophat_Debugger;

$tophat = new Tophat();

// activate cache procedure to optimize speed
$tophat->setCacheFolder(__DIR__.'/_cache');

// ----------------------------------------------------------------------------------------------
// available skin for module or navigation item
// ----------------------------------------------------------------------------------------------
// color
// color-alt
// background
// background-alt
// button
// button-alt
// rounded-button
// rounded-button-alt
// ----------------------------------

// ----------------------------------------------------------------------------------------------
//  Setting up the used logo image
// ----------------------------------------------------------------------------------------------
// image url (or b64 url)
//$tophat->setLogo('data:image/png;base64,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');
//$tophat->setLogo('http://via.placeholder.com/200x120/4b8af4/fff?text=Your+logo+!');

$logo_blank = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAABCAQAAABN/Pf1AAAAC0lEQVR42mNkwAIAACoAAgu1Hc4AAAAASUVORK5CYII=';
$logo1 = './logo1.png';
$logo1w = './logo1w.png';
$logo2 = './logo2.png';
$logo3 = './logo3.png';

// ----------------------------------------------------------------------------------------------
// Building some custom content module
// ----------------------------------------------------------------------------------------------

$tophat->setModule('contact.level',50);
$tophat->setModule('contact.group',2);
$tophat->setModule('contact.button.skin','button-rounded');
$tophat->setModule('contact.button.prepend','<i class="fa fa-phone"></i>');
$tophat->setModule('contact.button.label','+33 (0)1 23 45 67 89');
$tophat->setModule('contact.button.url',null); // default value / optionnal - If url is set <a> tag will be used
$tophat->setModule('contact.button.target',null); // default value / optionnal - used only on link

$tophat->setModule('book.level',99);
$tophat->setModule('book.group',2);
$tophat->setModule('book.button.url',"#book-url");
$tophat->setModule('book.button.skin','background');
$tophat->setModule('book.button.class','trigger-booking-panel');
$tophat->setModule('book.button.prepend','<i class="fa fa-calendar"></i>');
$tophat->setModule('book.button.label',"Réserver");
$tophat->setModule('book.button.append','<i class="fa fa-angle-right"></i>');


$tophat->setModule('language.level',99);
$tophat->setModule('language.group',2);
$tophat->setModule('language.button.skin','none');
$tophat->setModule('language.button.subskin','balloon');
$tophat->setModule('language.button.prepend',"Langue :");
$tophat->setModule('language.button.label',"Français");
$tophat->setModule('language.button.append','<i class="fa fa-angle-down"></i>');
$tophat->setModule('language.button.url','#fr');
$tophat->setModule('language.dropdown',[
	['label'=>'Français', 'url'=>'#fr', 'active'=>true],
	['label'=>'English', 'url'=>'#en'],
	['label'=>'Deutsch', 'url'=>'#de'],
]);

// social module are declare as a group via 'social__' prefix
$tophat->setModule('social__facebook.group',3);
$tophat->setModule('social__facebook.button',['prepend'=>'<i class="fa fa-facebook-official"></i>','label'=>'Facebook', 'url'=>'#facebook']);
$tophat->setModule('social__twitter.group',3);
$tophat->setModule('social__twitter.button',['prepend'=>'<i class="fa fa-twitter"></i>', 'url'=>'#twitter']);
$tophat->setModule('social__instagram.group',3);
$tophat->setModule('social__instagram.button',['prepend'=>'<i class="fa fa-instagram"></i>', 'url'=>'#instagram']);

// ----------------------------------------------------------------------------------------------
// Building a navigation tree
// ----------------------------------------------------------------------------------------------

$tophat->setModule('navtree__home',[
	'level'=>90,
	'group'=>1,
	'button'=>[
		'url'=>'#home',
		'target'=>null,
		'prepend'=>'<i class="fa fa-home"></i>',
		'label'=>'Home',
		'active'=>false, // Tophat can force item as active if any of this subnav items is active
		'skin'=>'underline',
		'subskin'=>'panel',
	],
	'dropdown'=>[
		['url'=>'#rooms','label'=>'Rooms','active'=>true],// 'media'=>'http://via.placeholder.com/100x60/f0f/fff'],
		['url'=>'#offers','label'=>'Offers'],// 'media'=>'http://via.placeholder.com/100x60/ff0/000'],
	]
]);
$tophat->setModule('navtree__0',[
	'level'=>90,
	'group'=>1,
	'button'=>[
		'target'=>null,
		'label'=>'Test',
		'active'=>false, // Tophat can force item as active if any of this subnav items is active
		'skin'=>'default',
		'subskin'=>'default',
	],
	'dropdown'=>[
		['url'=>'#rooms','label'=>'Rooms','active'=>true],// 'media'=>'http://via.placeholder.com/100x60/f0f/fff'],
		['url'=>'#offers','label'=>'Offers'],// 'media'=>'http://via.placeholder.com/100x60/ff0/000'],
	]
]);
$tophat->setModule('navtree__1',[ 'level'=>10, 'group'=>1, 'button' => [ 'skin'=>'underline', 'url'=>'#services', 'label'=>'Services' ] ]);
$tophat->setModule('navtree__2',[ 'level'=>10, 'group'=>1, 'button' => [ 'skin'=>'underline', 'url'=>'#advantages', 'label'=>'Advantages' ] ]);
$tophat->setModule('navtree__3',[ 'level'=>5,  'group'=>1, 'button' => [ 'skin'=>'underline', 'url'=>'#our-work', 'label'=>'Our Work' ] ]);
$tophat->setModule('navtree__4',[ 'level'=>5,  'group'=>1, 'button' => [ 'skin'=>'button-square', 'url'=>'#about-us', 'label'=>'About Us' ] ]);
$tophat->setModule('navtree__5',[ 'level'=>1,  'group'=>1, 'button' => [ 'skin'=>'button', 'url'=>'#blog', 'prepend'=>'<i class="fa fa-rss-square"></i>', 'label'=>'Blog' ] ]);
$tophat->setModule('navtree__6',[ 'level'=>50, 'group'=>1, 'button' => [ 'skin'=>'flat-alt', 'url'=>'#contact-us', 'label'=>'Contact Us' ] ]);

// Some special Toggle Button to display extra hteml panel allready present in the html page source code
// button.toggle is set as a css selector
$tophat->setModule('special.level',9999);
$tophat->setModule('special.button.skin','button-rounded');
$tophat->setModule('special.button.prepend','<i class="fa fa-bars"></i>');
$tophat->setModule('special.button.label','Menu');
$tophat->setModule('special.button.toggle','#fsPanel');

$tophat->setModule('special2.level',9999);
$tophat->setModule('special2.button.skin','button-rounded');
$tophat->setModule('special2.button.prepend','<i class="fa fa-bars"></i>');
$tophat->setModule('special2.button.label','Menu2');
$tophat->setModule('special2.button.toggle','#fsPanel2');

$tophat->setModule('special3.level',9999);
$tophat->setModule('special3.button.skin','button-rounded');
$tophat->setModule('special3.button.prepend','<i class="fa fa-bars"></i>');
$tophat->setModule('special3.button.label','Menu3');
$tophat->setModule('special3.button.toggle','#fsPanel3');

// ----------------------------------------------------------------------------------------------
// Set Bars containing previously created content
// ----------------------------------------------------------------------------------------------
$tophat->setBar('topbar.i',1);
$tophat->setBar('topbar.rwd',['m','l']); // [s,m,l]
$tophat->setBar('topbar.class','topbar');
$tophat->setBar('topbar.left',['language','book']);
$tophat->setBar('topbar.right',['social','contact']);
$tophat->setBar('topbar.logo.position','left');
$tophat->setBar('topbar.logo.src',$logo1w);
//variables css personnalisées
$tophat->setBar('topbar.css.logo-max-size','270px');
$tophat->setBar('topbar.css.color','#fff');
$tophat->setBar('topbar.css.color-alt','#ff9800');
$tophat->setBar('topbar.css.background','#222');
$tophat->setBar('topbar.css.button-background','#ff9800');
$tophat->setBar('topbar.css.button-color','#222');
$tophat->setBar('topbar.css.button-alt-background','#ffa117');
$tophat->setBar('topbar.css.button-alt-color','#222');
$tophat->setBar('topbar.css.base-size','0.7em');
$tophat->setBar('topbar.css.nav-link-vpad','0.5em');

$tophat->setBar('navigation.i',2);
$tophat->setBar('navigation.rwd',['m','l']);
$tophat->setBar('navigation.class','nav-desktop');
$tophat->setBar('navigation.logo.position','left');
$tophat->setBar('navigation.logo.src',$logo_blank);
$tophat->setBar('navigation.left',['navtree']);
$tophat->setBar('navigation.right',['book']);
//variables css personnalisées
$tophat->setBar('navigation.css.logo-max-size','270px');
$tophat->setBar('navigation.css.color','#fff');
$tophat->setBar('navigation.css.color-alt','#ff9800');
$tophat->setBar('navigation.css.background','#444');
$tophat->setBar('navigation.css.button-background','#ff9800');
$tophat->setBar('navigation.css.button-color','#222');
$tophat->setBar('navigation.css.button-alt-background','#ffa117');
$tophat->setBar('navigation.css.button-alt-color','#222');

$tophat->setBar('navigation3.i',2.1);
$tophat->setBar('navigation3.rwd',['m','l']);
$tophat->setBar('navigation3.class','nav-desktop');
$tophat->setBar('navigation3.logo.position','middle');
$tophat->setBar('navigation3.logo.src',$logo2);
$tophat->setBar('navigation3.left',['navtree']);
$tophat->setBar('navigation3.right',['book']);
$tophat->setBar('navigation3.css.margin-top','10em');
$tophat->setBar('navigation3.css.logo-max-size','90px');
$tophat->setBar('navigation3.css.nav-link-vpad','1.5em');

$tophat->setBar('navigation2.i',2.2);
$tophat->setBar('navigation2.rwd',['m','l']);
$tophat->setBar('navigation2.class','nav-desktop');
$tophat->setBar('navigation2.logo.position','middle');
$tophat->setBar('navigation2.logo.src',$logo3);
$tophat->setBar('navigation2.middle',['navtree','book']);
$tophat->setBar('navigation2.css.margin-top','10em');
$tophat->setBar('navigation2.css.logo-max-size','270px');
$tophat->setBar('navigation2.css.nav-link-vpad','1.5em');

$tophat->setBar('navigation4.i',2.3);
$tophat->setBar('navigation4.rwd',['m','l']);
$tophat->setBar('navigation4.class','nav-desktop');
$tophat->setBar('navigation4.logo.position','middle');
$tophat->setBar('navigation4.logo.src',$logo2);
$tophat->setBar('navigation4.middle',['navtree']);
$tophat->setBar('navigation4.right',['book']);
$tophat->setBar('navigation4.css.margin-top','10em');
$tophat->setBar('navigation4.css.logo-max-size','90px');
$tophat->setBar('navigation4.css.nav-link-vpad','1.5em');

$tophat->setBar('mobile.i',3);
$tophat->setBar('mobile.rwd',['s']);
$tophat->setBar('mobile.class','nav-mobile');
$tophat->setBar('mobile.logo.position','left');
$tophat->setBar('mobile.logo.src',$logo1);
$tophat->setBar('mobile.left',['navtree']);
$tophat->setBar('mobile.right',['book']);
$tophat->setBar('mobile.css.margin-top','10em');

$tophat->setBar('mobile2.i',3.1);
$tophat->setBar('mobile2.rwd',['s']);
$tophat->setBar('mobile2.class','nav-mobile');
$tophat->setBar('mobile2.logo.position','right');
$tophat->setBar('mobile2.logo.src',$logo1);
$tophat->setBar('mobile2.left',['navtree']);
$tophat->setBar('mobile2.right',['book']);
$tophat->setBar('mobile2.css.margin-top','10em');
$tophat->setBar('mobile2.css.margin-bottom','10em');
$tophat->setBar('mobile2.css.font-family','serif');
$tophat->setBar('mobile2.css.background','rgba(#fff,0.3)');

$tophat->setBar('special.i',4);
$tophat->setBar('special.logo.position','middle');
$tophat->setBar('special.logo.src',$logo2);
$tophat->setBar('special.left',['special','special2','special3']);
$tophat->setBar('special.right',['book']);
$tophat->setBar('special.css.nav-link-vpad','1.5em');
$tophat->setBar('special.css.margin-bottom','10em');
//echo $tophat->buildCss('navigation');die();
?>
<!DOCTYPE html>
<html>
<head>
	<meta id="custom_viewport" name="viewport" content="width=device-width, user-scalable=no" />
	<meta charset="UTF-8">
	<style>
	/*!
	*  Font Awesome v4.7.0 by @davegandy - http://fontawesome.io - @fontawesome
	*  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)
	*/
	@import url('https://use.fontawesome.com/releases/v4.7.0/css/font-awesome-css.min.css');
	/* FONT PATH
	* -------------------------- */
	@font-face {
	font-family: 'FontAwesome';
	src: url('https://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.eot');
	src: url('https://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.eot?#iefix') format('embedded-opentype'),
	   url('https://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff2') format('woff2'),
	   url('https://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff') format('woff'),
	   url('https://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.ttf') format('truetype'),
	   url('https://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.svg#fontawesomeregular') format('svg');
	font-weight: normal;
	font-style: normal;
	}
	/*
	Embed code 767c1ad785
	*/
	body {
		background: #B1D5EB;
		padding-top: 2em;
	}

	body:before {
		pointer-events: none;
		z-index: 100;
		content:"\2000";
		display: block;
		position: fixed;
		top: 0;
		left: 50%;
		width: 0;
		height: 100%;
		border-left: 1px dotted red;
	}
	body:after {
		pointer-events: none;
		z-index: 100;
		content:"\2000";
		display: block;
		position: fixed;
		top: 0;
		left: 40%;
		width: 20%;
		height: 100%;
		border-left: 1px dotted orange;
		border-right: 1px dotted orange;
	}

	.wrapper {
		max-width: 1400px;
		margin: auto;
	}

	#fsPanel {
		position: fixed;
		overflow: auto;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 100;
		display: none;
		padding: 3em;
		background: #FFF;
	}
	#fsPanel a {
		color: inherit;
	}
	#fsPanel.active {
		display: block;
	}

	#fsPanel2 {
		position: fixed;
		overflow: auto;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 100;
		display: none;
		background: rgba(0,0,0,0.3);
	}
	#fsPanel2 a {
		color: inherit;
	}
	#fsPanel2.active {
		display: block;
	}
	.fsPanel2-wrapper {
		width: 40%;
		min-height: 100%;
		padding: 3em;
		background: #FFF;
	}
	#fsPanel3 {
		position: fixed;
		overflow: auto;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 100;
		display: none;
		background: rgba(0,0,0,0.3);
	}
	#fsPanel3 a {
		color: inherit;
	}
	#fsPanel3.active {
		display: flex;
	}
	.fsPanel3-close {
		position: absolute;
		top: 1.5em;
		left: 1.5em;
		font-size: 2em;
	}
	.fsPanel3-aside {
		background: #222;
		color: #FFF;
		flex: 6;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3em;
	}
	.fsPanel3-wrapper {
		flex: 3;
		padding: 3em;
		background: #FFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	</style>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</head>
<body>
	<div class="wrapper">
		<?php
		//$tophat->debug = true;
		if($tophat->debug)
			echo '<p style="margin-bottom:3em;"><button onclick="tophat_cron()">Yolo !</button></p>';
		//
		// ----------------------------------------------------------------------------------------------
		// Execution des builders
		// ----------------------------------------------------------------------------------------------
		//$tophat->buildHtml('mobile',1000);
		echo $tophat->buildHtml();
		echo '<style type="text/css">'.$tophat->buildCss(true).'</style>'; // build common + all bars
		//echo '<style type="text/css">'.$tophat->buildCss(false).'</style>'; // build only common CSS
		//echo '<style type="text/css">'. $tophat->buildCss('topbar').'</style>'; // build only specifics bars CSS
		echo '<script type="text/javascript">'.$tophat->buildJs().'</script>';

		Tophat_Debugger::Resume();
		?>
	</div>
	<div id="fsPanel">
		<p><a href="javascript:$('#fsPanel').removeClass('active');"><i class="fa fa-times"></i></a></p>
		<h1>fsPanel item</h1>
		<p>This HTML panel is not not related to Tophat module</p>
		<p>The navigation button simply add "active" class to the fsPanel
		<ul>
			<li><a href="#1">Accueil</a></li>
			<li><a href="#2">Chambres</a></li>
			<li><a href="#2">Services</a></li>
			<li><a href="#3">Contact</a></li>
		</ul>
		<p>Suivez nous sur <i class="fa fa-facebook-official"></i> <i class="fa fa-twitter"></i> <i class="fa fa-instagram"></i></p>
	</div>
	<div id="fsPanel2">
		<div class="fsPanel2-wrapper">
			<p><a href="javascript:$('#fsPanel2').removeClass('active');"><i class="fa fa-times"></i></a></p>
			<h1>fsPanel item</h1>
			<p>This HTML panel is not not related to Tophat module</p>
			<p>The navigation button simply add "active" class to the fsPanel</p>
			<ul>
				<li><a href="#1">Accueil</a></li>
				<li><a href="#2">Chambres</a></li>
				<li><a href="#2">Services</a></li>
				<li><a href="#3">Contact</a></li>
			</ul>
			<p>Suivez nous sur <i class="fa fa-facebook-official"></i> <i class="fa fa-twitter"></i> <i class="fa fa-instagram"></i></p>
		</div>
	</div>
	<div id="fsPanel3">
		<div class="fsPanel3-aside">
			<div>
				<a class="fsPanel3-close" href="javascript:$('#fsPanel3').removeClass('active');"><i class="fa fa-times"></i></a>
				<p>
					Nihil molestiae consequatur, vel illum qui dolorem eum.
					Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Excepteur sint occaecat cupidatat non proident, sunt in culpa. Architecto beatae vitae dicta sunt explicabo. Nihil molestiae consequatur, vel illum qui dolorem eum.
					Et harum quidem rerum facilis est et expedita distinctio. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.
				</p>
			</div>
		</div>
		<div class="fsPanel3-wrapper">
			<div>
				<h1>fsPanel item</h1>
				<p>This HTML panel is not not related to Tophat module</p>
				<p>The navigation button simply add "active" class to the fsPanel</p>
				<ul>
					<li><a href="#1">Accueil</a></li>
					<li><a href="#2">Chambres</a></li>
					<li><a href="#2">Services</a></li>
					<li><a href="#3">Contact</a></li>
				</ul>
				<p>Suivez nous sur <i class="fa fa-facebook-official"></i> <i class="fa fa-twitter"></i> <i class="fa fa-instagram"></i></p>
			</div>
		</div>
	</div>
</body>
</html>
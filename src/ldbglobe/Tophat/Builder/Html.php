<?php
namespace ldbglobe\Tophat\Builder;

class Html
{
	static $globalIndex = 100;
	public function __construct($tophat,$key=null,$index=null)
	{
		$this->tophat = $tophat;

		$updateGlobalIndex = false;
		if($index===null)
		{
			$updateGlobalIndex = true;
			$index = self::$globalIndex;
		}

		if($key)
		{
			$bar = $tophat->getBarData($key);
			if($bar)
			{
				$this->BuildBar($key,$bar,1*$index);
			}
			$index--;
		}
		else
		{
			$bars = $tophat->getBars();
			foreach($bars as $key=>$bar)
			{
				$this->BuildBar($key,$bar,$index--);
			}
		}

		if($updateGlobalIndex)
			self::$globalIndex = $index;
	}

	public function BuildBar($key,$bar,$index)
	{
		$classes = array();
		if($bar->get('class'))
			$classes[] = $bar->get('class');
		foreach($bar->get('rwd',array()) as $rwd)
			$classes[] = 'rwd-'.$rwd;

		$available_parts = $this->AvailabaleParts($bar);

		echo '<div style="z-index:'.($index).';" class="tophat-bar '.($this->tophat->debug ? 'tophat-debug ':'').implode(' ',$classes).'"'
			.' data-tophat-key="'.$key.'"'
			.' data-tophat-group="'.$bar->get('group').'"'

			.' data-tophat-burger-animation="'.$bar->get('burger.animation','right').'"'
			.' data-tophat-burger-position="'.$bar->get('burger.position').'"'
			.' data-tophat-burger-visibility="'.$bar->get('burger.visibility').'"'
			.' data-tophat-burger-order="'.$bar->get('burger.order').'"'
			.' data-tophat-burger-mobile-position="'.$bar->get('burger.mobile.position').'"'
			.' data-tophat-burger-mobile-visibility="'.$bar->get('burger.mobile.visibility').'"'
			.' data-tophat-burger-mobile-order="'.$bar->get('burger.mobile.order').'"'

			.' data-tophat-logo="'.$bar->get('logo.position','left').'"'
			.' data-tophat-logo-mobile="'.$bar->get('logo.mobile.position',$bar->get('logo.position','left')).'"'
			.' data-tophat-parts="'.implode(',',$available_parts)
			.'">';
		foreach($available_parts as $part_code)
			$this->BuildBarPart($bar,$part_code);
		echo '</div>';
	}

	public function AvailabaleParts($bar)
	{
		$available_parts = [];
		foreach(['left','middle','right'] as $part_code)
		{
			if($bar->has($part_code) || ($bar->get('logo.position')==$part_code || $bar->get('logo.mobile.position')==$part_code) && $bar->get('logo.src'))
			{
				$available_parts[] = $part_code;
			}
		}
		// si on à un élément au centre et un latéral alors on doit avoir les trois pour que l'alignement flex fonctionne
		if(in_array('middle', $available_parts) && count($available_parts)>1)
		{
			$available_parts = ['left','middle','right'];
		}
		return $available_parts;
	}

	public function BuildBarPart($bar,$part_code)
	{
		echo '<div class="tophat-bar-part" data-tophat-align="'.$part_code.'">';
		$logo = null;
		if($bar->get('logo.position')==$part_code)
		{
			if($bar->get('logo.link'))
				echo '<a class="tophat-bar-logo" screen="desktop" href="'.$bar->get('logo.link').'"><span><img src="'.$bar->get('logo.src').'"></span></a>';
			else
				echo '<div class="tophat-bar-logo" screen="desktop"><span><img src="'.$bar->get('logo.src').'"></span></div>';
		}
		if($bar->get('logo.mobile.position')==$part_code)
		{
			$src = $bar->get('logo.mobile.src');
			$src = $src ? $src : $bar->get('logo.src');

			if($bar->get('logo.link'))
				echo '<a class="tophat-bar-logo" screen="mobile" href="'.$bar->get('logo.link').'"><span><img src="'.$src.'"></span></a>';
			else
				echo '<div class="tophat-bar-logo" screen="mobile"><span><img src="'.$src.'"></span></div>';
		}

		foreach($bar->get($part_code,array()) as $module_code)
		{
			$this->BuildModule($module_code);
		}
		echo '</div>';
	}

	public function BuildModule($module_code)
	{
		$module_code = $this->tophat->hasModule($module_code);
		if(is_string($module_code))
		{
			echo $this->BuildModuleContent($module_code);
		}
		else if(is_array($module_code))
		{
			foreach($module_code as $real_code)
			{
				$this->BuildModule($real_code);
			}
		}
		else
		{
			throw new \Exception("Module $module_code not defined", 1);
		}
	}

	static function BuildModuleLabel($data)
	{
		$r = '<span class="label" data-burger-label="'.htmlentities($data->get('burgerlabel')).'">'.$data->get('prepend').' '.$data->get('label').' '.$data->get('append').'</span>';
		if($data->has('media'))
			$r .= '<span class="media"><img src="'.$data->get('media').'"></span>';
		return $r;
	}

	public function BuildModuleContent($module_code)
	{
		$data = $this->tophat->getModuleData($module_code);

		$level = $data->get('level',0); // pour déterminer les éléments à conserver le plus longtemps possible (élevé = à garder longtemps)
		$burgerlevel = $data->get('burgerlevel',0); // pour déterminer l'ordre des éléments dans le burger menu
		$burgermode = $data->get('burgermode',''); // ["","allways","never"] pour déterminer si un item doit être présent dans le burger / mode auto ou forcé
		$group = $data->get('group',999);  // pour regrouper des éléments dans le burger menu (élevé = à placer à la fin du burger menu)
		$button = $data->getData('button');

        $active = $button->get('active');
        $dropdown = [];

        if($data->has('dropdown'))
        foreach($data->get('dropdown') as $dropdown_item)
        {
            $dropdown_item = new \Dflydev\DotAccessData\Data($dropdown_item);
            $dropdown[] = $dropdown_item;

            $active = $active || $dropdown_item->get('active');
        }

        $toggle = $button->get('toggle');
        if($toggle)
        {
        	$button->set('url','javascript:$(\''.$toggle.'\').toggleClass(\'active\');void(0);');
        }

        $visibility = null;
        if($data->get('visible',1) && $data->get('mobile.visible',1))
        	$visibility = 'both';
        else if($data->get('visible',1))
        	$visibility = 'desktop';
        else if($data->get('mobile.visible',1))
        	$visibility = 'mobile';

		$content .= '<div class="nav-item '.($active ? 'active':'').' '.$button->get('class').'"'
			.' data-tophat-class="'.$button->get('class').'"'
			.' data-tophat-group="'.$group.'"'
			.' data-tophat-level="'.$level.'"'
			.' data-tophat-visibility="'.$visibility.'"'
			.' data-tophat-burgerlevel="'.$burgerlevel.'"'
			.' data-tophat-burgermode="'.$burgermode.'"'
			.' data-tophat-skin="'.$button->get('skin','default').'">';
           	$content .= '<a class="nav-link '.($button->get('url') || $dropdown ? 'react':'').' '.($button->get('url') ? '':'nolink').'" target="'.$button->get('target').'" href="'.$button->get('url','javascript:void(0);').'">';
                $content .= \ldbglobe\Tophat\Builder\Html::BuildModuleLabel($button);
            $content .= '</a>';
            if($dropdown)
            {
                $content .= '<ul class="nav-dropdown" data-tophat-skin="'.$button->get('subskin','default').'">';
                foreach($dropdown as $dropdown_item)
                {
                    $content .= '<li class="'.($dropdown_item->get('active') ? 'active':'').'">';
                        $content .= '<a href="'.$dropdown_item->get('url').'" target="'.$dropdown_item->get('target').'">';
                            $content .= \ldbglobe\Tophat\Builder\Html::BuildModuleLabel($dropdown_item);
                        $content .= '</a>';
                    $content .= '</li>';
                }
                $content .= '</ul>';
            }
        $content .= '</div>';

        return $content;
	}
}
?>
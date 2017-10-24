<?php
namespace ldbglobe\Tophat\Builder;

class Html
{
	public function __construct($tophat)
	{
		$this->tophat = $tophat;

		$bars = $tophat->getBars();
		$i=0;
		foreach($bars as $key=>$bar)
		{
			$this->BuildBar($i++,$key,$bar);
		}
		//echo '<pre>'.print_r($tophat->getAll(),1).'</pre>';
	}

	public function BuildBar($index,$key,$bar)
	{
		$classes = array();
		if($bar->get('class'))
			$classes[] = $bar->get('class');
		foreach($bar->get('rwd',array()) as $rwd)
			$classes[] = 'rwd-'.$rwd;

		$available_parts = $this->AvailabaleParts($bar);

		echo '<div style="z-index:'.(100-$index).';" class="tophat-bar '.implode(' ',$classes).'" data-tophat-key="'.$key.'" '.($bar->get('logo') ? 'data-tophat-logo="'.$bar->get('logo').'"':'').'" data-tophat-parts="'.implode(',',$available_parts).'">';
		echo $logo;
		foreach($available_parts as $part_code)
			$this->BuildBarPart($bar,$part_code);
		echo '</div>';
	}

	public function AvailabaleParts($bar)
	{
		$available_parts = [];
		foreach(['left','middle','right'] as $part_code)
		{
			if($bar->has($part_code) || $bar->get('logo')==$part_code)
			{
				$available_parts[] = $part_code;
			}
		}
		return $available_parts;
	}

	public function BuildBarPart($bar,$part_code)
	{
		echo '<div class="tophat-bar-part" data-tophat-part-key="'.$part_code.'">';
		$logo = null;
		if($bar->get('logo')==$part_code)
			echo '<div class="tophat-bar-logo"><img src="'.$this->tophat->getLogo().'"></div>';
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
		$r = '<span class="label">'.$data->get('prepend').' '.$data->get('label').' '.$data->get('append').'</span>';
		if($data->has('media'))
			$r .= '<span class="media"><img src="'.$data->get('media').'"></span>';
		return $r;
	}

	public function BuildModuleContent($module_code)
	{
		$data = $this->tophat->getModuleData($module_code);

		$button = $data->getData('button');

        $active = $button->get('active');
        $dropdown = [];

        if($data->has('dropdown') && !$active)
        foreach($data->get('dropdown') as $dropdown_item)
        {
            $dropdown_item = new \Dflydev\DotAccessData\Data($dropdown_item);
            $dropdown[] = $dropdown_item;

            $active = $active || $dropdown_item->get('active');
        }

		$content .= '<div class="nav-item '.($active ? 'active':'').' '.$button->get('class').'" data-tophat-level="'.$button->get('level').'" data-tophat-skin="'.$button->get('skin').'" data-tophat-module="navigation">';
            $content .= '<a class="nav-link" href="'.$button->get('url').'">';
                $content .= \ldbglobe\Tophat\Builder\Html::BuildModuleLabel($button);
            $content .= '</a>';
            if($dropdown)
            {
                $content .= '<ul data-tophat-skin="'.$button->get('subskin').'">';
                foreach($dropdown as $dropdown_item)
                {
                    $content .= '<li class="'.($dropdown_item->get('active') ? 'active':'').'">';
                        $content .= '<a href="'.$dropdown_item->get('url').'">';
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
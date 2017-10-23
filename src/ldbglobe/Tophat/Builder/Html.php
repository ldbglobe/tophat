<?php
namespace ldbglobe\Tophat\Builder;

class Html
{
	public function __construct($tophat)
	{
		$this->tophat = $tophat;

		$bars = $tophat->getBars();
		foreach($bars as $key=>$bar)
		{
			$this->BuildBar($key,$bar);
		}
		//echo '<pre>'.print_r($tophat->getAll(),1).'</pre>';
	}

	public function BuildBar($key,$bar)
	{
		$classes = array();
		if($bar->get('class'))
			$classes[] = $bar->get('class');
		foreach($bar->get('rwd',array()) as $rwd)
			$classes[] = 'rwd-'.$rwd;

		$available_parts = $this->AvailabaleParts($bar);

		echo '<div class="tophat-bar '.implode(' ',$classes).'" data-tophat-key="'.$key.'" '.($bar->get('logo') ? 'data-tophat-logo="'.$bar->get('logo').'"':'').'" data-tophat-parts="'.implode(',',$available_parts).'">';
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
		if($this->tophat->hasModule($module_code))
		{
			$module_data = $this->tophat->getModuleData($module_code);
			$module_type = $module_data->get('type');
			if($module_type)
			{
				$classname = '\\ldbglobe\\Tophat\\Builder\\Type\\'.$module_type;
				if(class_exists($classname))
				{
					$module = new $classname($module_data);
					//echo '<div data-tophat-module="'.$module_data->get('type').'" data-tophat-skin="'.$module_data->get('skin').'" '.($module_data->get('class') ? 'class="'.$module_data->get('class').'"':'').'>';
					echo $module->html();
					//echo '</div>';
				}
				else
				{
					throw new \Exception("Class $classname does not exist", 1);
				}
			}
			else
			{
				throw new \Exception("Module $module_code have no type defined", 1);
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
}
?>
<?php
namespace ldbglobe\Tophat\Builder\Type;

class button
{
	function __construct($data)
	{
		$this->data = $data;
	}

	function html()
	{
		$data = $this->data;
		if($data->get('type')=='button')
		{
			echo '<div class="nav-item '.($data->get('active') ? 'active':'').' '.$data->get('class').'" data-tophat-skin="'.$data->get('skin').'" data-tophat-module="button">';
				echo '<a class="nav-link" href="'.$data->get('url','javascript:void(0);').'" target="'.$data->get('target').'">';
					echo \ldbglobe\Tophat\Builder\Html::BuildModuleLabel($data);
				echo '</a>';
			echo '</div>';
		}
		else
		{
			throw new \Exception("Builder/Type/button wrong data type", 1);
		}
	}
}
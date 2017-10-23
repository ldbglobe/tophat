<?php
namespace ldbglobe\Tophat\Builder\Type;

/*
[items] => Array
    [0] => Array
    (
        [url] => #home
        [target] => 
        [prepend] => 
        [label] => Home
        [active] => 
        [important] => 1
        [subnav] => Array
            (
                [0] => Array
                    (
                        [url] => #rooms
                        [label] => Rooms
                        [active] => 1
                    )

                [1] => Array
                    (
                        [url] => #offers
                        [label] => Offers
                        [active] => 
                    )

            )

    )
*/

class navigation
{
	function __construct($data)
	{
        $this->data = $data;
    }

    function html()
    {
        $data = $this->data;
		if($data->get('type')=='navigation')
		{
			foreach($data->get('items') as $k=>$v)
			{
				$v = new \Dflydev\DotAccessData\Data($v);

                $active = $v->get('active');
                if($v->has('subnav') && !$active)
                foreach($v->get('subnav') as $ks=>$vs)
                {
                    $vs = new \Dflydev\DotAccessData\Data($vs);
                    $active = $active || $vs->get('active');
                    if($active)
                        break;
                }

				$content .= '<div class="nav-item '.($active ? 'active':'').' '.$data->get('class').'" data-tophat-skin="'.$v->get('skin').'" data-tophat-module="navigation">';
                    $content .= '<a class="nav-link" href="'.$v->get('url').'">';
                        $content .= \ldbglobe\Tophat\Builder\Html::BuildModuleLabel($v);
                    $content .= '</a>';
                    if($v->has('subnav'))
                    {
                        $content .= '<ul data-tophat-skin="'.$v->get('subskin').'">';
                        foreach($v->get('subnav') as $ks=>$vs)
                        {
                            $vs = new \Dflydev\DotAccessData\Data($vs);
                            $content .= '<li class="'.($vs->get('active') ? 'active':'').'">';
                                $content .= '<a href="'.$vs->get('url').'">';
                                    $content .= \ldbglobe\Tophat\Builder\Html::BuildModuleLabel($vs);
                                $content .= '</a>';
                            $content .= '</li>';
                        }
                        $content .= '</ul>';
                    }
                $content .= '</div>';
			}
            echo $content;
		}
		else
		{
			throw new \Exception("Builder/Type/buttongroup wrong data type", 1);
		}
	}
}
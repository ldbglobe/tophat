<?php
namespace ldbglobe\Tophat\Builder;

class Html
{
	public function __construct($tophat)
	{
		echo '<pre>'.print_r($tophat->getAll(),1).'</pre>';
	}
}
?>
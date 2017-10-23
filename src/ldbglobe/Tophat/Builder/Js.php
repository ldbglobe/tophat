<?php
namespace ldbglobe\Tophat\Builder;

class Js
{
	public function __construct($tophat)
	{
		$this->tophat = $tophat;

		$this->BuildCommon();

		$bars = $tophat->getBars();
		foreach($bars as $key=>$bar)
		{
			$this->BuildBar($key,$bar);
		}
	}

	public function BuildBar($key,$bar)
	{
		/// Todo
	}

	public function BuildCommon()
	{
		echo '<script type="text/javascript">'.file_get_contents(__DIR__.'/Js/common.js').'</script>';
	}
}
?>
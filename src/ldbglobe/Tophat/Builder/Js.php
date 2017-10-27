<?php
namespace ldbglobe\Tophat\Builder;

class Js
{
	public function __construct($tophat)
	{
		$this->tophat = $tophat;

		$this->BuildCommon();
	}

	public function BuildCommon()
	{
		$js = file_get_contents(__DIR__.'/Js/common.js');
		$minijs = \JShrink\Minifier::minify($js);
		echo '<script type="text/javascript">'.$minijs.'</script>';
	}
}
?>
<?php
namespace ldbglobe\Tophat\Builder;

class Css
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
		$scss_compiler = new \Leafo\ScssPhp\Compiler();
		$scss_compiler->setFormatter('Leafo\ScssPhp\Formatter\Compressed');
		$css = $scss_compiler->compile(file_get_contents(__DIR__.'/Css/common.scss'));
		echo '<style type="text/css">'.$css.'</style>';
	}
}
?>
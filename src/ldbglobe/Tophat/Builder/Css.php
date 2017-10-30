<?php
namespace ldbglobe\Tophat\Builder;

class Css
{
	public function __construct($tophat)
	{
		$this->tophat = $tophat;

		$this->BuildCommon();
	}

	public function BuildCommon()
	{
		$scss_compiler = new \Leafo\ScssPhp\Compiler();
		$scss_compiler->setFormatter('Leafo\ScssPhp\Formatter\Compressed');

		$scss = $this->ImportScss(__DIR__.'/Css/common.scss');
		if($this->tophat->debug)
			$scss .= "\n".$this->ImportScss(__DIR__.'/Css/_debug.scss');

		$css = $scss_compiler->compile($scss);

		echo '<style type="text/css">'.$css.'</style>';
	}

	public function ImportScss($path)
	{
		$dir = dirname($path).'/';
		$scss = file_get_contents($path);
		preg_match_all('/@import +["\']([^"\']+)["\'] *;/',$scss,$reg);
		$imports = [];
		foreach($reg[0] as $k=>$pattern)
		{
			$imports[$pattern] = $reg[1][$k];
		}
		foreach($imports as $pattern=>$subpath)
		{
			$scss = str_replace($pattern, $this->ImportScss($dir.$subpath), $scss);

		}
		return $scss;
	}
}
?>
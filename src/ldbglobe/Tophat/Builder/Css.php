<?php
namespace ldbglobe\Tophat\Builder;

class Css
{
	public function __construct($tophat,$key)
	{
		$this->tophat = $tophat;

		if($key && is_string($key))
		{
			$bar = $tophat->getBarData($key);
			if($bar)
			{
				$this->BuildBar($key,$bar);
			}
		}
		else
		{
			$this->BuildCommon();

			if($key===true)
			{
				$bars = $tophat->getBars();
				foreach($bars as $key=>$bar)
				{
					$this->BuildBar($key,$bar);
				}
			}
		}
	}

	public function BuildCommon()
	{
		$scss_compiler = new \Leafo\ScssPhp\Compiler();
		$scss_compiler->setFormatter('Leafo\ScssPhp\Formatter\Compressed');

		$scss = $this->ImportScss(__DIR__.'/Css/_common.scss');
		if($this->tophat->debug)
			$scss .= "\n".$this->ImportScss(__DIR__.'/Css/_debug.scss');

		$css = $scss_compiler->compile($scss);

		echo $css;
	}

	public function BuildBar($key,$bar)
	{
		if($bar->has('css'))
		{
			$scss_compiler = new \Leafo\ScssPhp\Compiler();
			$scss_compiler->setFormatter('Leafo\ScssPhp\Formatter\Compressed');

			$scss = $this->ImportScss(__DIR__.'/Css/index.scss');

			// Keep only scss function and variable related css rules
			$scss = preg_replace('/(.*)([@${}])(.*)/','#KEEP_THIS_LINE#\\1\\2\\3',$scss);
			$scss = preg_replace('/^(?!#KEEP_THIS_LINE#).+$/m','',$scss);
			$scss = str_replace('#KEEP_THIS_LINE#','',$scss);

			// extrating css vars list and remove any line containing missing bar specific value
			$vars_scss = $this->ImportScss(__DIR__.'/Css/vars.scss');
			$vars_to_clean = [];
			$vars_to_inject = [];
			if(preg_match_all("/\\$([a-z0-9_-]+)/i",$vars_scss,$reg))
			{
				foreach($reg[1] as $i=>$varname)
				{
					if(!$bar->has('css.'.$varname))
					{
						$vars_to_clean[$varname] = true;
					}
					else
					{
						$vars_to_inject[$varname] = $bar->get('css.'.$varname);
					}
				}
			}
			$scss_compiler->setVariables($vars_to_inject);

			$scss = explode("\n",$scss);
			foreach($scss as $i=>$line)
			{
				// keep the line
				if(preg_match('/[@{}]/',$line) || preg_match_all("/^[\t ]*\\$([a-z0-9_-]+)[\t ]*:/i",$line,$reg))
				{
					// echo 'KEEP'.$line."\n";
					// nothing to do
				}
				//
				else if(preg_match_all("/\\$([a-z0-9_-]+)/i",$line,$reg))
				{
					$toDelete = true;
					// si on trouve un variable qui n'est pas supprimable on le signal et on quitte la boucle
					foreach($reg[1] as $varname)
					{
						if(strpos($varname, '_tophat')===false && !isset($vars_to_clean[$varname]))
						{
							// echo $varname."\n";
							$toDelete = false;
							break;
						}
					}
					// si la ligne ne contient rien d'important on peux la supprimer
					if($toDelete)
					{
						unset($scss[$i]);
					}
				}
				// unwanted line
				else
				{
					unset($scss[$i]);
				}
			}
			$scss = implode("\n",$scss);

			$scss = '.tophat-bar[data-tophat-key="'.$key.'"] { '.preg_replace("/[\r\n]+/","\n",$scss).' } ';

			$css = $scss_compiler->compile($scss);
			echo $css;
		}
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
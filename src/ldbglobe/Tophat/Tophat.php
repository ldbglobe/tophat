<?php
// See test/index.php for usage

namespace ldbglobe\Tophat;

class Tophat {

	private $settings = null;
	private $cacheFolder = false;
	private $cacheFilesSignature = null;

	public function __construct($initial_settings=null)
	{
		$this->debug = false;
		//https://packagist.org/packages/dflydev/dot-access-data
		$this->settings = new \Dflydev\DotAccessData\Data($initial_settings);
		// get
		// getData (return a Data interface)
		// set
		// append (add entry to a unindexed data array)
		// remove (remove a node)
		// has (return true if node exists)
		// import
		// importData
		// export
	}

	public function setCacheFolder($path)
	{
		$this->cacheFolder = realpath($path);
	}
	public function cacheSignature()
	{
		$signature = '';
		if($this->cacheFilesSignature!==null)
		{
			$signature .= $this->cacheFilesSignature;
		}
		else
		{
			$files = $this->glob_recursive(__DIR__."/**/*.*");
			foreach($files as $file)
				$signature .= md5_file($file);
		}
		$signature .= md5(serialize($this->settings->export()));
		return sha1($signature);
	}
	public function cacheExist($code)
	{
		return $this->cacheFolder && file_exists($this->cacheFolder.'/'.$this->cacheSignature().'.'.$code);
	}
	public function cacheRead($code)
	{
		if($this->cacheExist($code))
			return file_get_contents($this->cacheFolder.'/'.$this->cacheSignature().'.'.$code);
		else
			return null;
	}
	public function cacheWrite($code,$content)
	{
		if($this->cacheFolder && is_dir($this->cacheFolder))
		{
			file_put_contents($this->cacheFolder.'/'.$this->cacheSignature().'.'.$code,$content);
			return $this->cacheRead($code);
		}
		else
			return $content;
	}

	public function glob_recursive($pattern, $flags = 0)
	{
		$files = glob($pattern, $flags);
		foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir)
		{
			$files = array_merge($files, $this->glob_recursive($dir.'/'.basename($pattern), $flags));
		}
		return $files;
	}

	public function buildHtml($key=null,$index=null)
	{
		if($this->cacheExist(($key ? $key:'_common').'.html'))
			return $this->cacheRead(($key ? $key:'_common').'.html');
		ob_start();
		if($key)
			new \ldbglobe\Tophat\Builder\Html($this,$key,$index);
		else
			new \ldbglobe\Tophat\Builder\Html($this);
		return $this->cacheWrite(($key ? $key:'_common').'.html',ob_get_clean());
	}
	public function buildCss($key=null)
	{
		$cacheCode = (is_string($key) ? $key : ($key ? '_all' : 'common')).'.css';

		if($this->cacheExist($cacheCode))
			return $this->cacheRead($cacheCode);
		ob_start();
		new \ldbglobe\Tophat\Builder\Css($this,$key);
		return $this->cacheWrite($cacheCode,ob_get_clean());
	}
	public function buildJs()
	{
		if($this->cacheExist('_common.js'))
			return $this->cacheRead('_common.js');
		ob_start();
		new \ldbglobe\Tophat\Builder\Js($this);
		return $this->cacheWrite('_common.js',ob_get_clean());
	}

	// ----------------------------------------
	// Generic accessors
	private function set($k,$v)
	{
		$this->settings->set($k, $v);
	}
	private function append($k,$v)
	{
		$this->settings->append($k, $v);
	}
	public function has($k)
	{
		return $this->settings->has($k);
	}
	public function get($k)
	{
		return $this->settings->get($k);
	}
	public function getData($k)
	{
		return $this->settings->getData($k);
	}
	public function getAll()
	{
		return $this->settings->export();
	}

	// ----------------------------------------
	// LOGO
	public function setLogo($v)
	{
		$this->settings->set('logo', $v);
	}
	public function getLogo()
	{
		return $this->settings->get('logo');
	}

	// ----------------------------------------
	// MODULES
	public function setModule($k,$v)
	{
		$this->settings->set('modules.'.$k, $v);
	}
	public function getModuleData($k)
	{
		return $this->settings->getData('modules.'.$k);
	}
	public function appendModule($k,$v)
	{
		$this->settings->append('modules.'.$k, $v);
	}
	public function hasModule($k)
	{
		if($this->settings->has('modules.'.$k))
			return $k;
		else
		{
			$codes = array_keys($this->settings->getData('modules')->export());
			$response = [];
			foreach($codes as $code)
			{
				if(strpos($code,$k.'__')===0)
					$response[] = $code;
			}
			if($response)
				return $response;
		}
		return false;
	}

	// ----------------------------------------
	// BARS
	public function setBar($k,$v)
	{
		$this->settings->set('bars.'.$k,$v);
	}
	public function getBarData($k)
	{
		return $this->settings->getData('bars.'.$k);
	}
	public function getBars()
	{
		$bars = $this->get('bars',array());
		foreach($bars as $key=>$null)
		{
			$bars[$key] = $this->getData('bars.'.$key);
		}
		uasort($bars,function($a,$b){
			$_a = (float)$a->get('i',9999);
			$_b = (float)$b->get('i',9999);
			$r = ($_a - $_b);
			return $r > 0 ? 1 : ( $r < 0 ? -1 : 0 );
		});
		return $bars;
	}
	public function appendBar($k,$v)
	{
		$this->settings->append('bars.'.$k, $v);
	}
}
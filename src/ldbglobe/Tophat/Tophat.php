<?php
// See test/index.php for usage

namespace ldbglobe\Tophat;

class Tophat {

	private $settings = null;

	public function __construct($initial_settings=null)
	{
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

	public function buildHtml()
	{
		return new \ldbglobe\Tophat\Builder\Html($this);
	}
	public function buildCss()
	{
		return new \ldbglobe\Tophat\Builder\Css($this);
	}
	public function buildJs()
	{
		return new \ldbglobe\Tophat\Builder\Js($this);
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
		return $this->settings->has('modules.'.$k);
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
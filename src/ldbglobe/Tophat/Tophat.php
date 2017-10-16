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
	public function get($k)
	{
		return $this->settings->get($k);
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

	// ----------------------------------------
	// MODULES
	public function setModule($k,$v)
	{
		$this->settings->set('modules.'.$k, $v);
	}
	public function getModule($k)
	{
		$this->settings->get('modules.'.$k);
	}
	public function appendModule($k,$v)
	{
		$this->settings->append('modules.'.$k, $v);
	}

	// ----------------------------------------
	// BARS
	public function setBar($k,$v)
	{
		$this->settings->set('bars.'.$k,$v);
	}
	public function getBar($k)
	{
		$this->settings->get('bars.'.$k);
	}
	public function appendBar($k,$v)
	{
		$this->settings->append('bars.'.$k, $v);
	}
}
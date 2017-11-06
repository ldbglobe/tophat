<?php
// See test/index.php for usage

namespace ldbglobe\Tophat;

class Tophat_Debugger {
	static private $events = [];

	static public function Events()
	{
		return self::$events;
	}

	static public function Resume()
	{
		?>
		<style>
		.Tophat_Debugger_Resume {
			background: #FFF;
			width: 100%;
			font-family: sans-serif;
		}
		.Tophat_Debugger_Resume thead td {
			font-weight: bold;
		}
		</style>
		<?php
		echo '<table class="Tophat_Debugger_Resume" cellpadding="10" cellspacing="0" border="0">';
		echo '<thead><tr><td>Tophat actions resume</td><td>Extra</td><td>Duration</td><td>Message</td></tr></thead>';
		echo '<tbody>';
		foreach(self::$events as $event)
		{
			echo '<tr><td>'.$event->action.'</td><td>'.$event->extra.'</td><td>'.$event->duration.'</td><td>'.$event->message.'</td></tr>';
		}
		echo '</tbody>';
		echo '</table>';
	}

	public function __construct($action,$extra=null)
	{
		$this->action = $action;
		$this->extra = $extra;
		$this->start = microtime(true);
	}
	public function register($response,$message=null)
	{
		$this->message = $message;
		$this->end = microtime(true);
		$this->duration = $this->end - $this->start;
		self::$events[] = $this;
		return $response;
	}


}

class Tophat {

	public $debug = false;
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

	private function _debug($message,$duration)
	{
		$this->debug_events[] = array('message'=>$message,'duration'=>$duration);
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
			$debug = new \ldbglobe\Tophat\Tophat_Debugger('_cacheFilesSignatureBuilder');
			$files = $debug->register($this->_cacheFilesSignatureBuilder());
			foreach($files as $file)
				$signature .= '';//md5_file($file);

			$this->cacheFilesSignature = $signature;
		}
		$signature .= md5(serialize($this->settings->export()));
		return sha1($signature);
	}
	private function _cacheFilesSignatureBuilder($dir=null,$results=null)
	{
		$dir = $dir ? $dir : __DIR__;
		$results = $results ? $results : array();
		$files = opendir($dir);
		while (false !== ($value = readdir($files)))
		{
			if($value != "." && $value != "..")
			{
				$path = realpath($dir.DIRECTORY_SEPARATOR.$value);
				if(!is_dir($path))
				{
					$results[] = $path;
				}
				else
				{
					$results = $this->_cacheFilesSignatureBuilder($path,$results);
				}
			}
		}
		return $results;
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

	public function buildHtml($key=null,$index=null)
	{
		$debug = new \ldbglobe\Tophat\Tophat_Debugger('buildHtml',$key);
		if($this->cacheExist(($key ? $key:'_common').'.html'))
		{
			return $debug->register($this->cacheRead(($key ? $key:'_common').'.html'), 'cacheExist');
		}
		ob_start();
		if($key)
			new \ldbglobe\Tophat\Builder\Html($this,$key,$index);
		else
			new \ldbglobe\Tophat\Builder\Html($this);
		return $debug->register($this->cacheWrite(($key ? $key:'_common').'.html',ob_get_clean()), 'runBuilder');
	}
	public function buildCss($key=null)
	{
		$debug = new \ldbglobe\Tophat\Tophat_Debugger('buildCss',$key);
		$cacheCode = (is_string($key) ? $key : ($key ? '_all' : 'common')).'.css';

		if($this->cacheExist($cacheCode))
			return $debug->register($this->cacheRead($cacheCode), 'cacheExist');
		ob_start();
		new \ldbglobe\Tophat\Builder\Css($this,$key);
		return $debug->register($this->cacheWrite($cacheCode,ob_get_clean()), 'runBuilder');
	}
	public function buildJs()
	{
		$debug = new \ldbglobe\Tophat\Tophat_Debugger('buildJs');
		if($this->cacheExist('_common.js'))
			return $debug->register($this->cacheRead('_common.js'), 'cacheExist');
		ob_start();
		new \ldbglobe\Tophat\Builder\Js($this);
		return $debug->register($this->cacheWrite('_common.js',ob_get_clean()), 'runBuilder');
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
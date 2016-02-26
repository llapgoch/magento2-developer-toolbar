<?php
namespace Llapgoch\Developertoolbar\Helper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper{
    const START_MARKER_SUFFIX = "-start-viewer";
    const END_MARKER_SUFFIX = "-end-viewer";
    const GLOBAL_MARKER = "developer-toolbar-dom-marker";
    const HEAD_COMPONENTS_NAME = "head.components";
    const DEVELOPER_TOOLBAR_NAME = "llapgoch.developertoolbar";
    
    protected $_layout;
    protected $_dataStructure;
    
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Framework\View\Layout $layout){
            parent::__construct($context);
            $this->_layout = $layout;
            $this->_dataStructure = $layout->getStructure();
    }
    
    public function makeLayoutNameIntoClass($name){
        return str_replace('.', '-', $name);
    }
    
    public function makeStartMarker($blockName){
        return $this->_helper->makeLayoutNameIntoClass($blockName) . self::START_MARKER_SUFFIX . " " . self::GLOBAL_MARKER;
    }
    
    public function makeEndMarker($blockName){
        return $this->_helper->makeLayoutNameIntoClass($blockName) . self::END_MARKER_SUFFIX . " " . self::GLOBAL_MARKER;
    }
    
    public function getForbiddenNames(){
        return array(self::DEVELOPER_TOOLBAR_NAME, self::HEAD_COMPONENTS_NAME);
    }
    
    public function wrapContent($layoutName, $content){
        if($this->_isForbidden($layoutName, $this->getForbiddenNames())){
            return $content;
        }
        
        return "<!--" . $this->_helper->makeStartMarker($layoutName) . "-->" . $content . "<!--" . $this->_helper->makeEndMarker($layoutName) . "-->";
    }
    
    protected function _isForbidden($layoutName, $forbidden = array()){     
        if(in_array($layoutName, $forbidden)){
            return true;
        }
        
        // Don't wrap for AJAX calls
        if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) 
            && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest'){
            return true;
        }
        
        // Don't wrap for forbidden blocks
        return $this->_isParentOf($layoutName, $forbidden);
    }
    
    protected function _isParentOf($layoutName, $potentialParents = array()){
        if(!$layoutName){
            return false;
        }
        
        if(in_array($layoutName, $potentialParents)){
            return true;
        }
        
        return $this->_isParentOf($this->_dataStructure->getParentId($layoutName), $potentialParents);
    }
}
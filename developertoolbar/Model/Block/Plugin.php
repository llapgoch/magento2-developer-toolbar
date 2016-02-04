<?php
namespace Llapgoch\Developertoolbar\Model\Block;

class Plugin{
    const HEAD_COMPONENTS_NAME = "head.components";
    const START_MARKER_SUFFIX = "-start-viewer";
    const END_MARKER_SUFFIX = "-end-viewer";
    const GLOBAL_MARKER = "developer-toolbar-dom-marker";
    
    protected $_helper;
    
    public function __construct(\Llapgoch\Developertoolbar\Helper\Data $helper){
        $this->_helper = $helper;
    }
        
    public function afterToHtml($subject, $result){
        $blockName = $subject->getNameInLayout();
        
        if($this->_isForbidden($subject)){
            return $result;
        }
        
        return "<!--" . $this->_makeStartMarker($blockName) . "-->" . $result . "<!--" . $this->_makeEndMarker($blockName) . "-->";
    }
    
    protected function _isForbidden($block, $forbidden = array(self::HEAD_COMPONENTS_NAME)){
        if(!$block){
            return false;
        }
    
        if(in_array($block->getNameInLayout(), $forbidden)){
            return true;
        }
    
        if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest'){
            return true;
        }
    
        return $this->_isForbidden($block->getParentBlock());
    }
    
    protected function _makeStartMarker($blockName){
        return $this->_helper->makeLayoutNameIntoClass($blockName) . self::START_MARKER_SUFFIX . " " . self::GLOBAL_MARKER;
    }
    
    protected function _makeEndMarker($blockName){
        return $this->_helper->makeLayoutNameIntoClass($blockName) . self::END_MARKER_SUFFIX . " " . self::GLOBAL_MARKER;
    }
}
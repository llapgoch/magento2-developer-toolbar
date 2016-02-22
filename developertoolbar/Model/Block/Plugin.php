<?php
namespace Llapgoch\Developertoolbar\Model\Block;

class Plugin{
    const HEAD_COMPONENTS_NAME = "head.components";
    const START_MARKER_SUFFIX = "-start-viewer";
    const END_MARKER_SUFFIX = "-end-viewer";
    const GLOBAL_MARKER = "developer-toolbar-dom-marker";
    const DEVELOPER_TOOLBAR_NAME = "llapgoch.developertoolbar";
    
    protected $_helper;
    
    public function __construct(\Llapgoch\Developertoolbar\Helper\Data $helper){
        $this->_helper = $helper;
    }
     
    public function getForbiddenNames(){
        return array(self::DEVELOPER_TOOLBAR_NAME, self::HEAD_COMPONENTS_NAME);
    }
    
    public function afterToHtml($subject, $result){
        $blockName = $subject->getNameInLayout();
        
        if($this->_isForbidden($subject, $this->getForbiddenNames())){
            return $result;
        }
        
        return "<!--" . $this->_makeStartMarker($blockName) . "-->" . $result . "<!--" . $this->_makeEndMarker($blockName) . "-->";
    }
    
    protected function _isParentOf($dataStructure, $childId, $potentialParents = array()){
        if(!$childId){
            return false;
        }
        
        if(in_array($childId, $potentialParents)){
            return true;
        }
        
        return $this->_isParentOf($dataStructure, $dataStructure->getParentId($childId), $potentialParents);
    }
    
    protected function _isForbidden($block, $forbidden = array()){
        if(!$block){
            return false;
        }
            
        if(in_array($block->getNameInLayout(), $forbidden)){
            return true;
        }
    
        if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) 
            && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest'){
            return true;
        }
        
        return $this->_isParentOf($block->getLayout()->getStructure(), $block->getNameInLayout(), $forbidden);
    }
    
    protected function _makeStartMarker($blockName){
        return $this->_helper->makeLayoutNameIntoClass($blockName) . self::START_MARKER_SUFFIX . " " . self::GLOBAL_MARKER;
    }
    
    protected function _makeEndMarker($blockName){
        return $this->_helper->makeLayoutNameIntoClass($blockName) . self::END_MARKER_SUFFIX . " " . self::GLOBAL_MARKER;
    }
}
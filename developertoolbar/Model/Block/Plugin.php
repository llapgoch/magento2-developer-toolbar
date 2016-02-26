<?php
namespace Llapgoch\Developertoolbar\Model\Block;

class Plugin{    
    protected $_helper;
    
    public function __construct(\Llapgoch\Developertoolbar\Helper\Data $helper){
        $this->_helper = $helper;
    }
    
    public function afterToHtml($subject, $result){
        $blockName = $subject->getNameInLayout();
        
        return $this->_helper->wrapContent($blockName, $result);
    }
    

}
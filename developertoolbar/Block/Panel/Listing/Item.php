<?php
namespace Llapgoch\Developertoolbar\Block\Panel\Listing;

class Item extends \Magento\Framework\View\Element\Template
{
    protected $_attributes = array();
    
    public function _construct()
    {
        $this->setTemplate('toolbar/block/list/item.phtml');
    }
    
    public function getOutputAttributes()
    {
        $attrs = '';
        
        foreach($this->_attributes as $k => $v){
            $attrs = $k . "='$v'";
        }
        
        return $attrs;
    }
    
    public function getAttributes()
    {
        return $this->attributes;   
    }
    
    public function addAttribute($name, $value){
        $this->_attributes[$name] = $value;
        return $this;
    }
    
}
<?php
namespace Llapgoch\Developertoolbar\Model\Attribute;
use \Magento\Framework\Model\AbstractModel;

class Container extends AbstractModel{
    protected $_attributes;
    
    public function getOutputAttributes()
    {
        $attrs = '';
        
        foreach($this->_attributes as $k => $v){
            $attrs .= $k . "='$v' ";
        }
        
        return $attrs;
    }
    
    public function reset()
    {
        $this->_attributes = array();
        return $this;
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
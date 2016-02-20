<?php

namespace Llapgoch\Developertoolbar\Block\Panel;

abstract class Base extends \Magento\Framework\View\Element\Template{
    protected $_itemBlock;
    protected $_itemContainer;
    protected $_title = 'Panel Title';
    protected $_buttonTitle = 'Toolbar Button';
    
    public function __construct(
            \Magento\Framework\View\Element\Template\Context $context, 
            array $data = [],
            \Llapgoch\Developertoolbar\Block\Panel\Listing\Item $itemBlock,
            \Llapgoch\Developertoolbar\Block\Panel\Listing\Container $itemContainer){
            
        $this->_itemBlock = $itemBlock;
        $this->_itemContainer = $itemContainer;
            
        parent::__construct($context, $data);
    }
    
    abstract public function getContent();
    
    public function getTitle(){
        return __($this->_title);
    }
    
    public function setTitle($title){
        $this->_title = $title;
    }
    
    public function getButtonTitle(){
        return __($this->_buttonTitle);
    }
    
    public function setButtonTitle($title){
        $this->_buttonTitle = $title;
    }
    
    public function getItemContent($item){
        $this->_itemBlock->setItem($item);
        return $this->_itemTemplate->toHtml();
    }
}
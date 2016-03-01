<?php

namespace Llapgoch\Developertoolbar\Block\Panel;

abstract class AbstractPanel extends \Magento\Framework\View\Element\Template{
    protected $_itemBlock;
    protected $_itemContainer;
    protected $_title = 'Panel Title';
    protected $_buttonTitle = 'Toolbar Button';
    protected $_cssClassPrefix = 'developertoolbar-panel-';
    protected $_cssClassSuffix = 'default';
    
    public function __construct(
            \Magento\Framework\View\Element\Template\Context $context, 
            \Llapgoch\Developertoolbar\Block\Panel\Listing\Item $itemBlock,
            \Llapgoch\Developertoolbar\Block\Panel\Listing\Container $itemContainer, 
            array $data = []){
            
        $this->_itemBlock = $itemBlock;
        $this->_itemContainer = $itemContainer;
            
        parent::__construct($context, $data);
    }
    
    protected function _prepareLayout()
    {
        parent::_prepareLayout();
        $name = $this->getNameInLayout();

        // Add the blocks as children of this, so that the commenting exclusions take effect
        $this->_layout->addBlock($this->_itemBlock, $name . 'list.item', $name);
        $this->_layout->addBlock($this->_itemContainer, $name . 'list.container', $name);
    }
    
    abstract public function getContent();
    
    public function getTitle()
    {
        return __($this->_title);
    }
    
    public function getCssClass()
    {
        return $this->_cssClassPrefix . $this->_cssClassSuffix;
    }
    
    public function setTitle($title)
    {
        $this->_title = $title;
    }
    
    public function getButtonTitle()
    {
        return __($this->_buttonTitle);
    }
    
    public function setButtonTitle($title)
    {
        $this->_buttonTitle = $title;
    }
    
    public function getItemContent($item)
    {
        $this->_itemBlock->setItem($item);
        return $this->_itemTemplate->toHtml();
    }
}
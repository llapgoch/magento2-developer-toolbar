<?php
namespace Llapgoch\Developertoolbar\Block\Panel\Listing;

use \Llapgoch\Developertoolbar\Model\Attribute\Container as AttributeContainer;
use \Magento\Framework\View\Element\Template\Context;

class Item extends \Magento\Framework\View\Element\Template
{
    protected $_attributeContainer;
    
    public function __construct(
            \Magento\Framework\View\Element\Template\Context $context,
            
            AttributeContainer $container,
            array $data = []
    ) {
        parent::__construct($context, $data);
        $this->setTemplate('toolbar/block/list/item.phtml');
        $this->_attributeContainer = $container;
    }
    
    public function getOutputAttributes()
    {
        return $this->_attributeContainer->getOutputAttributes();
    }
    
    public function getAttributeContainer()
    {
        return $this->_attributeContainer;
    }
        
}
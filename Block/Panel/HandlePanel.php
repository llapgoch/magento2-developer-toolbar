<?php

namespace Llapgoch\Developertoolbar\Block\Panel;

class HandlePanel extends AbstractPanel
{
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Llapgoch\Developertoolbar\Helper\Data $helper,
        \Llapgoch\Developertoolbar\Block\Panel\Listing\Item $itemBlock,
        \Llapgoch\Developertoolbar\Block\Panel\Listing\Container $itemContainer,
        \Magento\Framework\View\Layout $layout,
        array $data = []
    ){

        parent::__construct($context, $itemBlock, $itemContainer, $data);

        $itemBlock->setTemplate('toolbar/block/list/item-handle.phtml');
        $this->_layout = $layout;
        $this->_title = 'Handles';
        $this->_helper = $helper;
        $this->_buttonTitle = 'Handles';
        $this->_cssClassSuffix = 'handle';
    }

    public function getContent()
    {
        // TODO: Implement getContent() method.
    }
}

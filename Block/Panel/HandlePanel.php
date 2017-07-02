<?php

namespace Llapgoch\Developertoolbar\Block\Panel;

class HandlePanel extends AbstractPanel
{
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Llapgoch\Developertoolbar\Helper\Data $helper,
        \Magento\Framework\View\Layout $layout,
        array $data = []
    ){

        parent::__construct($context, $data);

        $this->_layout = $layout;
        $this->_title = 'Handles';
        $this->_helper = $helper;
        $this->_buttonTitle = 'Handles';
        $this->_cssClassSuffix = 'handle';
    }
}

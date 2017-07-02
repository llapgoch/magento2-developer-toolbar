<?php

namespace Llapgoch\Developertoolbar\Block\Panel\Handle;

class Content extends \Magento\Framework\View\Element\Template
{
    protected $_layout;

    public function __construct(\Magento\Framework\View\Element\Template\Context $context,
                                \Magento\Framework\View\LayoutInterface $layout,
                                array $data)
    {
        $this->_layout = $layout;
        parent::__construct($context, $data);
    }

    public function getHandles()
    {
        return $this->_layout->getUpdate()->getHandles();
    }
}
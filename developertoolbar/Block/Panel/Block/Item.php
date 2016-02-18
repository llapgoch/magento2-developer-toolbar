<?php
namespace Llapgoch\Developertoolbar\Block\Panel\Block;

class Item extends \Magento\Framework\View\Element\Template{
    public function _construct(){
        $this->setTemplate('toolbar/block/item.phtml');
    }
}
    
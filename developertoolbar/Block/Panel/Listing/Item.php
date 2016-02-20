<?php
namespace Llapgoch\Developertoolbar\Block\Panel\Listing;

class Item extends \Magento\Framework\View\Element\Template{
    public function _construct(){
        $this->setTemplate('toolbar/block/list/item.phtml');
    }
}
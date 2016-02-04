<?php
namespace Llapgoch\Developertoolbar\Helper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper{
    public function makeLayoutNameIntoClass($name){
        return str_replace('.', '-', $name);
    }
}
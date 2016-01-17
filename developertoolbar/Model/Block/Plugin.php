<?php
namespace Llapgoch\Developertoolbar\Model\Block;

class Plugin{
    public function afterToHtml($subject, $result){
        return $result . " moo";
    }
}
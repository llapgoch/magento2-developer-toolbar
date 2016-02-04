<?php

namespace Llapgoch\Developertoolbar\Block\Panel;


class Block extends \Magento\Framework\View\Element\Template{
    /**
     * @var \Magento\Framework\View\Layout
     */
    protected $_layout;
    
    
    public function __construct(
            \Magento\Framework\View\Element\Template\Context $context, 
            array $data = [],
            \Magento\Framework\View\Layout $layout){

        parent::__construct($context, $data);
    }
    
    protected function _toHtml(){
        $blocks = $this->_layout->getAllBlocks();
        $html = '';
        
        foreach($blocks as $block){
            $html .= ' <strong>' . $block->getNameInLayout() . '</strong>';
        }
        
        echo $html;
        return $html;
    }
}
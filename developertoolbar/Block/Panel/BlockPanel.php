<?php

namespace Llapgoch\Developertoolbar\Block\Panel;


class BlockPanel extends AbstractPanel{
    /**
     * @var \Magento\Framework\View\Layout
     */
    protected $_layout;
    protected $_helper;
    protected $_levelIncrement = 10;
    
    public function __construct(
            \Magento\Framework\View\Element\Template\Context $context, 
            \Llapgoch\Developertoolbar\Helper\Data $helper,
            \Llapgoch\Developertoolbar\Block\Panel\Listing\Item $itemBlock,
            \Llapgoch\Developertoolbar\Block\Panel\Listing\Container $itemContainer,
            \Magento\Framework\View\Layout $layout,
            array $data = []
        ){
            
        parent::__construct($context, $itemBlock, $itemContainer, $data);
        
        $itemBlock->setTemplate('toolbar/block/list/item-block.phtml');
        $this->_layout = $layout;
        $this->_title = 'Blocks';
        $this->_helper = $helper;
        $this->_buttonTitle = 'Blocks';
        $this->_cssClassSuffix = 'block';
        
        $this->_requiredScripts['blockviewer'] = [];
    }
    
    public function getContent()
    {
        $blocks = $this->_layout->getAllBlocks();
        $html = '';
        
        $elements = $this->_layout->getStructure()->exportElements();
       
        // Make a tree of elements
        $els = $this->buildCompleteElementStructure($elements);
        // Make the HTML structure for output
        $html = $this->buildHtmlStructure($els, 0);
        
        return $html;
    }
    
    public function buildHtmlStructure($els, $level)
    {
        $html = '';
        
        if(!count($els)){
            return '';
        }
        
        foreach($els as $name => $el){
            $childrenHtml = '';
            
            if(isset($el['children'])){
                $childrenHtml = $this->buildHtmlStructure($el['children'], $level + $this->_levelIncrement);
            }
            
            $this->_itemBlock->getAttributeContainer()
                ->reset()
                ->addAttribute('data-layout-name', $this->_helper->makeLayoutNameIntoClass($name));
            
            $html .= $this->_itemBlock->setItem($el)
                ->setExtras($this->getBlockExtras($name, $el))
                ->setName($name)
                ->setChildrenHtml($childrenHtml)
                ->toHtml();
        }
        
        return $this->_itemContainer
            ->setContents($html)
            ->setLevel($level)
            ->toHtml();
    }
    
    public function getBlockExtras($name, $data){
        
        if(isset($data['type'])){
            $extras[] = $data['type'];
        }
        
        $block = $this->_layout->getBlock($name);
        
        if($block){
            if($block instanceof \Magento\Cms\Block\Block){
                $extras[] = $this->_makeSpan('identifier', $block->getBlockId());
            }
            
            if($block instanceof \Magento\Cms\Block\Page){
                $extras[] = $block->getPage()->getIdentifier();
            }
            
            if($block instanceof \Magento\Framework\View\Element\Template){
                $extras[] = $block->getTemplate();
            }
            
            $extras[] = $block->getType();
            
        }
        
        return $extras;
    }
    
    public function buildCompleteElementStructure($elements)
    {
        $structure = array();
        
        foreach($elements as $k => $element){
            if(isset($element['parent'])){
                continue;
            }
            
            $this->buildElementStructure($elements, $k, $structure);
        }
        
        return $structure;
    }
    
    public function buildElementStructure($elements, $name, &$structure = null)
    {
        if(!isset($elements[$name])){
            return;
        }
        
        $element = $elements[$name];
        $structure[$name] = $element;
        
        unset($structure[$name]['children']);
        
        if(isset($element['children']) && $element['children']){
            $structure[$name]['children'] = array();
            
            foreach($element['children'] as $childName => $child){
                $this->buildElementStructure($elements, $childName, $structure[$name]['children']);
            }
        }
    }
    
    protected function _buildEntries(&$entries, $block, $alias, $level)
    {
        $blocks = $this->_layout->getAllBlocks();
        $extras = array();
        $extras[] = count($block->getChild()) ? count($block->getChild()) : "-";
        $extras[] = $block->getType();

        if ($block->getType() === 'cms/block') {
            $extras[] = $block->getBlockId();
        } elseif ($block->getType() == 'cms/page') {
            $extras[] = $block->getPage()->getIdentifier();
        } elseif ($template = $block->getTemplate()) {
            $extras[] = $template;
        } else {
            $extras[] = '-';
        }

        $extras[] = get_class($block);

        // sprintf("$offset%s %s\n", $alias, $this->_colorize($extraString, self::COLOR_DARK_GRAY))
        $name = $block->getNameInLayout();
        $entry = array(
            'name' => $name,
            'alias' => $alias,
            'level' => $level,
            'extras' => $extras,
        );

        $profileName = "BLOCK: $name";
        if (isset($this->timers[$profileName])) {
            $entry['time'] = $this->timers[$profileName]['sum'] * 1000;
        }

        $entries[] = $entry;

        foreach ($block->getChild() as $alias => $childBlock) {
            $this->_buildEntries($entries, $childBlock, $alias, $level + 1);
        }
    }
}
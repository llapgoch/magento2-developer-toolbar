<?php
namespace Llapgoch\Developertoolbar\Model\View;

use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Message\ManagerInterface as MessageManagerInterface;
use Magento\Framework\Cache\FrontendInterface;
use Magento\Framework\App\State as AppState;
use Psr\Log\LoggerInterface as Logger;
use Magento\Framework\View\Layout\Element;

class Layout extends \Magento\Framework\View\Layout{
    protected $_helper;
    
    public function __construct(
        \Magento\Framework\View\Layout\ProcessorFactory $processorFactory,
        ManagerInterface $eventManager,
        \Magento\Framework\View\Layout\Data\Structure $structure,
        MessageManagerInterface $messageManager,
        \Magento\Framework\View\Design\Theme\ResolverInterface $themeResolver,
        \Magento\Framework\View\Layout\ReaderPool $readerPool,
        \Magento\Framework\View\Layout\GeneratorPool $generatorPool,
        FrontendInterface $cache,
        \Magento\Framework\View\Layout\Reader\ContextFactory $readerContextFactory,
        \Magento\Framework\View\Layout\Generator\ContextFactory $generatorContextFactory,
        AppState $appState,
        Logger $logger,
        \Llapgoch\Developertoolbar\Helper\Data\Proxy $helper,
        $cacheable = true
        ){

        parent::__construct(
            $processorFactory,
            $eventManager,
            $structure,
            $messageManager,
            $themeResolver,
            $readerPool,
            $generatorPool,
            $cache,
            $readerContextFactory,
            $generatorContextFactory,
            $appState,
            $logger,
            $cacheable
        );

         $this->_helper = $helper;
    }
    
    // If only this was public to begin with!
    public function getStructure()
    {
        return $this->structure;
    }
    
    protected function _renderContainer($name)
    {
        $html = '';
        $children = $this->getChildNames($name);
        foreach ($children as $child) {
            $html .= $this->renderElement($child);
        }
        if ($html == '' || !$this->structure->getAttribute($name, Element::CONTAINER_OPT_HTML_TAG)) {
            return $html;
        }

        $htmlId = $this->structure->getAttribute($name, Element::CONTAINER_OPT_HTML_ID);
        if ($htmlId) {
            $htmlId = ' id="' . $htmlId . '"';
        }
        
        $htmlClass = $this->structure->getAttribute($name, Element::CONTAINER_OPT_HTML_CLASS);
        if ($htmlClass) {
            $htmlClass = ' class="' . $htmlClass . '"';
        }

        $htmlTag = $this->structure->getAttribute($name, Element::CONTAINER_OPT_HTML_TAG);
        
        // This is the change we need to make for the developer toolbar - if only we could use a plugin for this!
        $html = $this->_helper->wrapContent($name, $html);

        $html = sprintf('<%1$s%2$s%3$s>%4$s</%1$s>', $htmlTag, $htmlId, $htmlClass, $html);

        return $html;
    }
}
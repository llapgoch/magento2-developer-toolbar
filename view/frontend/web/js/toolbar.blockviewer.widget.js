define([
    'jquery', 
    'jquery/ui'
], function($){
   $.widget('llapgoch.devtoolbarblockviewer', {
       _blockTimeout: null,
       _commentBlocks: null,
       overlay: null,
       
       options: {
           // Classes
           overlayClass: 'devbar__overlay',
           toggleEnabledClass: 'is-enabled',
           isActiveClass: 'is-active',
           isErrorClass: 'is-error',
           existsClass: 'exists',
           
           // Selectors
           toggleSelector: '.js-devbar__highlight-toggle',
           
           // Data Attributes
           dataLayoutName: 'layout-name',
           
           namePrefix: "-start-viewer",
           nameSuffix: "-end-viewer",
           markerMainName: "developer-toolbar-dom-marker",
           
           blockErrorMessage: "The block's dimensions could not be determined",
           defaultFade: { 
               effect: "fade", 
               duration: 250 
           }
       },
       
       _create: function(){
           this._super();
           this._markApplicableToggles();
           this._addEvents();
       },
       
       _markApplicableToggles: function(){
           var self = this;
           
           $(this.options.toggleSelector, this.element).each(function(){
               var $this = $(this),
                   blockName = $this.data(self.options.dataLayoutName);
                   
               if(!blockName){
                   return;
               }
               
               var blocks = self._getBlocksForMarker(blockName);
               
               if(blocks.startBlock && blocks.endBlock){
                   $this.addClass(self.options.toggleEnabledClass);
               }
           });
       },
       
       _addEvents: function(){
           var events = {};
           
           // Apply enabled classes to clickable blocks
           events['click ' + this.options.toggleSelector] = function(event){
               var $this = $(event.currentTarget),
                   blockName = $this.data(this.options.dataLayoutName);
                   
               event.preventDefault();
           
               if(!$this.hasClass(this.options.toggleEnabledClass)){
                   return;
               }
           
               // Toggle the selection off
               if($this.hasClass(this.options.isActiveClass)){
                   $this.removeClass(this.options.isActiveClass);
                   this.hideBlockOverlay();
                   return;
               }
           
               $(this.options.toggleSelector, this.element).removeClass(this.options.isActiveClass);
           
               if(!this.showOverlayForBlock(blockName)){
                   if(window.console) {
                       console.error(this.options.blockErrorMessage);
                       $this.addClass(this.options.isErrorClass);
                   }
                   return;
               }else{
                   $this.addClass(this.options.isActiveClass);
               }
           }
           
           this._on(this.element, events);
       },
       
       _getStartMarker: function(itemName){
           return itemName + this.options.namePrefix;
       },
       
       _getEndMarker: function(itemName){
           return itemName + this.options.nameSuffix;
       },
       
       _isElementVisible: function($el){
           // Forms appear invisible, but the contents most likely aren't!
           if($el.get(0).nodeName == 'FORM'){
               return true;
           }
           
           return $el.is(":visible");
       },
       
       _getDimensionsBetweenMarker: function(itemName){
           var blocks = this._getBlocksForMarker(itemName);
           var dims;
           
           if(!blocks.startBlock |! blocks.endBlock){
               return false;
           }
           
           // Change this to be a normal for loop, looking for an end comment
           var currentBlock = blocks.startBlock.get(0);
           var endBlock = blocks.endBlock.get(0);
           
           while(currentBlock = currentBlock.nextSibling){
               var $this = $(currentBlock);
               
               if(currentBlock == endBlock){
                   break;
               }
               
               if(!this._isElementVisible($this) || currentBlock.nodeType !== 1){
                   continue;
               }
               
               dims = this._mergeDimensions(dims, this._getTraversedDimensions($this));
           }
           
           return dims;
       },
       
       /* Merges two dimension objects, taking the min left and top, max right and bottom */
       _mergeDimensions: function(dims, dims2){
           if(!dims){
               return dims2;
           }
           
           if(!dims2){
               return dims;
           }
           
           return {
               'left':Math.min(dims.left, dims2.left),
               'right':Math.max(dims.right, dims2.right),
               'top':Math.min(dims.top, dims2.top),
               'bottom':Math.max(dims.bottom, dims2.bottom)
           };
       },
       
       _getDimensionObject: function($el){
           return {
               'left':$el.offset().left,
               'right':$el.offset().left + $el.outerWidth(),
               'top':$el.offset().top,
               'bottom':$el.offset().top + $el.outerHeight()
           };
       },
       
       /* Gets the full dimensions of the element, calculated by its children */
       _getTraversedDimensions: function(el){
           var $element = $(el);
           var resDims = this._getDimensionObject($element);
           var self = this;
           
           $element.find('*').each(function(){
               var $this = $(this);
               var obDims = self._getDimensionObject($this);
               
               // Don't include elements which have been included off screen to
               // left
               // E.g. Magento's menu does this giving an odd false height for 
               // header
               if(self._isElementVisible($this) && obDims.right > 0){
                   resDims = self._mergeDimensions(resDims, obDims);
               }
           });
           
           return resDims;
       },
       
       // Cache these, only refresh when needed!
       _getAllDocumentMarkers: function(refresh){
           var self = this;
           
           refresh = refresh === true ? true : false;
           
           if(this._commentBlocks && refresh == false){
               return this._commentBlocks;
           }
           
           this._commentBlocks = $("*").contents().filter(
               function(){
                   if(this.nodeType == 8){
                       return this.nodeValue.indexOf(self.options.markerMainName) !== -1;
                   }
                   
                   return false;
               }
           )
           
           return this._commentBlocks;
       },
       
       _getBlocksForMarker: function(blockName){
           var startMarker = this._getStartMarker(blockName);
           var endMarker = this._getEndMarker(blockName)
           var commentBlocks = this._getAllDocumentMarkers();
           
           var blocks = {
               'startBlock':null,
               'endBlock':null
           };
           
           if(!commentBlocks){
               return blocks;
           }
           
           for(var i = 0; i < commentBlocks.length; i++){
               if(commentBlocks[i].nodeValue.indexOf(startMarker) !== -1 &! blocks.startBlock){
                   blocks.startBlock = $(commentBlocks[i]);
               }
               
               if(commentBlocks[i].nodeValue.indexOf(endMarker) !== -1 &! blocks.endBlock){
                   blocks.endBlock = $(commentBlocks[i]);
               }
               
               if(blocks.startBlock && blocks.endBlock){
                   break;
               }
           }
           
           return blocks;
       },
       
       _refreshDocumentMarkers: function(){
           this._getAllDocumentMarkers(true);
       },
       
       showOverlayForBlock: function(blockName, performScroll){
           var  self = this,
                $startBlock,
                $endBlock,
                $body = $('body');
           
           this._refreshDocumentMarkers();
           
           var dims = this._getDimensionsBetweenMarker(blockName);
           var markerBlocks = this._getBlocksForMarker(blockName);
           
           $startBlock = markerBlocks.startBlock;
           $endBlock = markerBlocks.endBlock;
           
           performScroll = performScroll === false ? false : true;

           if(!$startBlock || !$endBlock || !dims){
               this.hideBlockOverlay();
               return false;
           }
           
           if(!this.overlay){
               this.overlay = $('<div>').addClass(this.options.overlayClass);
               $body.append(this.overlay);
           }
           
           // Give them a min dimension of 10px
           var width = dims.right - dims.left || 10;
           var height = dims.bottom - dims.top || 10;
           var scrollPadding = 25;

           
           this.showBlockOverlay();
           
           this.overlay.css({
               'left':dims.left,
               'top':dims.top,
               'width':width,
               'height':height
           });
           
           if($body.scrollTop() !== dims.top - scrollPadding && performScroll){
               $body.animate({scrollTop:dims.top - scrollPadding}, 500);
           }
           
           this._on(this.window, {
               'resize': function(){
                   if(self._blockTimeout){
                       window.clearTimeout(self._blockTimeout);
                       self._blockTimeout = null;
                   }
               
                   self._blockTimeout = window.setTimeout(function(){
                       self.showOverlayForBlock(blockName, false);
                   }, 150);
               }
           });
           
           return true;
       },
       
       hideToggles: function(){
           this._hide($(this.options.toggleSelector, this.element), this.options.defaultFade);
       },
       
       showToggles: function(){
           this._show($(this.options.toggleSelector + '.' + this.options.toggleEnabledClass, this.element), this.options.defaultFade);
       },
       
       hideBlockOverlay: function(){
           if(this.overlay){
               this._hide(this.overlay, this.options.defaultFade);
           }
           
           this._off(this.window, "resize");
       },
       
       showBlockOverlay: function(){
           if(this.overlay){
               this._show(this.overlay, this.options.defaultFade);
           }
       },
       
       disable: function() {
           this.hideBlockOverlay();
           this.hideToggles();
           this._super();
       },
       
       enable: function() {
           this.showBlockOverlay();
           this.showToggles();
           this._super();
       },
       
       destroy: function(){
           this._super();
           
           if(this.overlay){
               this.overlay.remove();
           }
       }
       
   });
   
   return $.llapgoch.devtoolbarblockviewer;
});
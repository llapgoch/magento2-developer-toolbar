define([
    'jquery', 
    'jquery/ui'
], function($){
   $.widget('llapgoch.devtoolbarblockviewer', {
       _blockTimeout: null,
       _commentBlocks: null,
       overlay: null,
       blockErrorMessage: "The block's dimensions could not be determined",
       
       options: {
           // Classes
           overlayClass: 'developertoolbar__overlay',
           toggleEnabledClass: 'enabled',
           isActiveClass: 'is-active',
           
           // Selectors
           toggleSelector: '.js-developertoolbar__highlight-toggle',
           
           // Data Attributes
           dataLayoutName: 'layout-name'
           
           namePrefix: "-start-viewer";
           nameSuffix: "-end-viewer";
           markerMainName: "developer-toolbar-dom-marker";
       },
       
       _create: function(){
           this._super();
           this._addEvents();
       },
       
       _addEvents: function(){
           // Apply enabled classes to clickable blocks
           var events = {};
           
           
           $(this.options.toggleSelector, this.element).each(function(){
               var $this = $(this),
                   blockName = $this.data(this.options.dataLayoutName);
                   
               if(!blockName){
                   return;
               }
               
               var blocks = this.getBlocksForMarker(blockName);
               
               if(blocks.startBlock && blocks.endBlock){
                   $this.addClass(this.options.toggleEnabledClass);
               }
           });
           
           events['click ' + this.options.toggleSelector] = function(event){
               var $this = $(event.target),
                   blockName = $this.data(this.options.dataLayoutName);
               
               event.preventDefault();
           
               if(!$this.hasClass(this.options.toggleEnabledClass)){
                   return;
               }
           
               // Toggle the selection off
               if($this.hasClass(this.options.isActiveClass)){
                   $this.removeClass(this.options.isActiveClass);
                   hideBlockOverlay();
                   return;
               }
           
               $(this.options.toggleSelector, this.element).removeClass(this.options.isActiveClass);
           
               if(!this.showOverlayForBlock(blockName)){
                   console.notice(this.options.blockErrorMessage);
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
       }
       
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
           
           $element.find('*').each(function(){
               var $this = $(this);
               var obDims = this._getDimensionObject($this);
               
               // Don't include elements which have been included off screen to
               // left
               // E.g. Magento's menu does this giving an odd false height for 
               // header
               if(this._isElementVisible($this) && obDims.right > 0){
                   resDims = this._mergeDimensions(resDims, obDims);
               }
           });
           
           return resDims;
       },
       
       
       
       // Cache these, only refresh when needed!
       _getAllDocumentMarkers: function(refresh){
           refresh = refresh === true ? true : false;
           
           if(this._commentBlocks && refresh == false){
               return this._commentBlocks;
           }
           
           this._commentBlocks = $("*").contents().filter(
               function(){
                   if(this.nodeType == 8){
                       return this.nodeValue.indexOf(this.options.markerMainName) !== -1;
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
           var $startBlock;
           var $endBlock;
           
           this._refreshDocumentMarkers();
           
           var dims = this._getDimensionsBetweenMarker(blockName);
           var markerBlocks = this._getBlocksForMarker(blockName);
           
           $startBlock = markerBlocks.startBlock;
           $endBlock = markerBlocks.endBlock;
           
           performScroll = performScroll === false ? false : true;
           
           if(!$startBlock || !$endBlock || !dims){
               hideBlockOverlay();
               return false;
           }
           
           if(!this.overlay){
               this.overlay = $('<div>').addClass(this.options.overlayClass);
               $('body').append(this.overlay);
           }
           
           // Give them a min dimension of 10px
           var width = dims.right - dims.left || 10;
           var height = dims.bottom - dims.top || 10;
           var scrollPadding = 25;
           var $body = $(this.document.body);
           
           this.overlay.show().css({
               'left':dims.left,
               'top':dims.top,
               'width':width,
               'height':height
           });
           
           if($body.scrollTop() !== dims.top - scrollPadding && performScroll){
               $(body.animate({scrollTop:dims.top - scrollPadding}, 500);
           }
           
           
           
           this._on(this.window, {
               'resize': function(){
                   if(this._blockTimeout){
                       window.clearTimeout(this._blockTimeout);
                       this._blockTimeout = null;
                   }
               
                   this._blockTimeout = window.setTimeout(function(){
                       this.showOverlayForBlock(blockName, false);
                   }, 150);
               }
           });
           
           return true;
       },
       
       function hideBlockOverlay(){
           if(this.overlay){
               this.overlay.hide();
           }
           
           this._off(this.window, "resize");
       },
       
   });
   
   return $.llapgoch.devtoolbarblockviewer;
});
(function($) {
    if(!$){
        if(console){
            console.error('Purple Ripper: Developer Toolbar Error - jQuery not loaded.\n\nPlease either load jQuery, or if you are loading it in a block other than head, set the developer toolbar\'s javascript to also load there.\n\nIf this is in the admin, please set jQuery to load there in the developer toolbar\'s config.');
        }
        return;
     }
    
    $(document).ready(function() {
        blockViewer();
    });
    
    function blockViewer(){
        var blockTimeout;
        var commentBlocks;
        var blockContainer = '.developertoolbar-panel-block';
    
        function getStartMarker(name){
            return name + "-start-viewer";
        }
    
        function getEndMarker(name){
            return name + "-end-viewer";
        }
    
        function isVisible($el){
            // Forms appear invisible, but the contents most likely aren't!
            if($el.get(0).nodeName == 'FORM'){
                return true;
            }
        
            return $el.is(":visible");
        }
    
        function getDimensionsBetweenMarker(name){

            var blocks = getBlocksForMarker(name);
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
                
                if(!isVisible($this) || currentBlock.nodeType !== 1){
                    continue;
                }
                
                dims = mergeDimensions(dims, getTraversedDimensions($this));
            }
            
            return dims;
        }
    
        /* Merges two dimension objects, taking the min left and top, max right and bottom */
        function mergeDimensions(dims, dims2){
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
    
        function getDimensionObject($el){
            return{
                'left':$el.offset().left,
                'right':$el.offset().left + $el.outerWidth(),
                'top':$el.offset().top,
                'bottom':$el.offset().top + $el.outerHeight()
            };
        }
    
        /* Gets the full dimensions of the element, calculated by its children */
        function getTraversedDimensions(el){
            var $element = $(el);

            var resDims = getDimensionObject($element);
        
            $element.find('*').each(function(){
                var $this = $(this);
                var obDims = getDimensionObject($this);
            
                // Don't include elements which have been included off screen to the left
                // E.g. Magento's menu does this giving an odd false height for the header
                if(isVisible($this) && obDims.right > 0){
                    resDims = mergeDimensions(resDims, obDims);
                }            
            });
        
            return resDims;
        }
        var commentBlocks;
        
        // Cache these, only refresh when needed!
        function getAllDocumentMarkers(refresh){
            refresh = refresh === true ? true : false;

            if(commentBlocks && refresh == false){
                return commentBlocks;
            }

            commentBlocks = $("*").contents().filter(
                function(){ 
                    if(this.nodeType == 8){
                        return this.nodeValue.indexOf('developer-toolbar-dom-marker') !== -1;
                    }
                    
                    return false;
                }
            )
            
            return commentBlocks;
        }
        
        function getBlocksForMarker(blockName){
            var startMarker = getStartMarker(blockName);
            var endMarker = getEndMarker(blockName)
            var commentBlocks = getAllDocumentMarkers();
            
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
        }
        
        function refreshDocumentMarkers(){
            getAllDocumentMarkers(true);
        }
    
        function showOverlayForBlock(blockName, performScroll){
            var overlay = $('.developertoolbar__overlay');
            var $startBlock;
             var $endBlock;
            
            refreshDocumentMarkers();
            
            var dims = getDimensionsBetweenMarker(blockName);
            var markerBlocks = getBlocksForMarker(blockName); 
            
            $startBlock = markerBlocks.startBlock;
            $endBlock = markerBlocks.endBlock;
        
            performScroll = performScroll === false ? false : true;
            console.log(blockName);
            if(!$startBlock || !$endBlock || !dims){
                hideBlockOverlay();
                return false;
            }
        
            if(!overlay.length){
                overlay = $('<div class="developertoolbar__overlay"></div>');
                $('body').append(overlay);
            }
        
            // Give them a min dimension of 10px
            var width = dims.right - dims.left || 10;
            var height = dims.bottom - dims.top || 10;
            var scrollPadding = 25;
        
            overlay.show().css({
                'left':dims.left,
                'top':dims.top,
                'width':width,
                'height':height
            });
        
            if($('body').scrollTop() !== dims.top - scrollPadding && performScroll){
                $('body').animate({scrollTop:dims.top - scrollPadding}, 500);
            }
        
            $(window).on('resize.developertoolbar', function(){
                if(blockTimeout){
                    window.clearTimeout(blockTimeout);
                    blockTimeout = null;
                }
            
                blockTimeout = window.setTimeout(function(){
                    showOverlayForBlock(blockName, false);
                }, 150);
            });
        
            return true;
        }
    
        function hideBlockOverlay(){
            $('.developertoolbar__overlay').hide();
            $(window).off("resize.developertoolbar");
        }
    
        // Apply enabled classes to clickable blocks
        $(blockContainer + ' a').each(function(){
            var $this = $(this),
                blockName = $this.data('layout-name');
                console.log(blockName);
            if(!blockName){
                return;
            }
            var blocks = getBlocksForMarker(blockName);
        
            if(blocks.startBlock && blocks.endBlock){
                $this.addClass('enabled');
            }
        });
    
        
        $(blockContainer + ' a').click(function(e){
            var $this = $(this),
                blockName = $this.data('layout-name');
        
            e.preventDefault();
            
            if(!$this.hasClass('enabled')){
                return;
            }
        
            // Toggle the selection off
            if($this.hasClass('is-active')){
                $this.removeClass('is-active');
                hideBlockOverlay();
                return;
            }
        
            $(blockContainer + ' a').removeClass('is-active');
        
            if(!showOverlayForBlock(blockName)){
                alert('The block\'s dimensions could not be determined');
                return;
            }else{
                $this.addClass('is-active');
            }
        
        });
        
    };
}(window.jQuery));
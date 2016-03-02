define([
    'jquery',
    'jquery/ui',
], function ($) {
   $.widget('llapgoch.developertoolbar', {
       options: {
           // Actions
           buttonLinkAction: 'click .js-developertoolbar__button-link',
           toolbarToggleAction: 'click .js-developertoolbar__toggle',
           
           // Selectors
           toolbarListItemSelector: '.developertoolbar__list-item',
           toolbarItemSelector: '.js-developertoolbar__item',
           toolbarListSelector: '.developertoolbar__list',
           toolbarListInnerSelector: '.developertoolbar__ul',
           
           // Active Classes
           toolbarItemActiveClass: 'developertoolbar__item--active',
           toolbarToggleActiveClass: 'is-active',
           itemOpenClass: 'open',
           
           // Settings
           animateCloseTime: 250
       },
       
       _create: function() {
           this._super();
           this._addEvents();
       },
       
       _addEvents: function() {
           var events = {};
           
           // Button click event
           events[this.options.buttonLinkAction] = function(event) {
               event.preventDefault();

               var $item = $(event.target).closest(this.options.toolbarItemSelector),
                   active = $item.hasClass(this.options.toolbarItemActiveClass);
            
               if(!active){
                   $item.addClass(this.options.toolbarItemActiveClass);
               }else{
                   $item.removeClass(this.options.toolbarItemActiveClass);
               }
           };
           
           events[this.options.toolbarToggleAction] = function(event) {
               event.preventDefault();
               var self = this;
               
               // find the associated item
               var $this = $(event.target),
                   $item = $this.closest(this.options.toolbarListItemSelector)
                               .find(this.options.toolbarListSelector).first(),
                   $inner   = $item.find(this.options.toolbarListInnerSelector).first();
                   activeClass = this.options.toolbarToggleActiveClass;
                   
               if($item.hasClass(activeClass)){
                   $item.removeClass(this.options.itemOpenClass);
                   
                   $item.animate({
                       'height': 0
                   }, this.options.animateCloseTime);
            
                   $item.removeClass(activeClass);
               }else{
                   $item.animate({
                       'height': $inner.outerHeight(),
                   },{
                       'complete': function(){
                           $item.addClass(self.options.itemOpenClass);
                       },
                       'delay': this.options.animateCloseTime
                   });
            
                   $item.addClass(activeClass);
                   $this.addClass(activeClass);
               }  
           };
           
           this._on(this.element, events);
       }
   }) 
   
   return $.llapgoch.developertoolbar;
});
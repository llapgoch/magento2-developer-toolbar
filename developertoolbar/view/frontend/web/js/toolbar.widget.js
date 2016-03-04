define([
    'jquery',
    'jquery/ui',
], function ($) {
   $.widget('llapgoch.devtoolbar', {
       options: {
           // Actions
           buttonLinkAction: 'click .js-devbar__button-link',
           toolbarToggleAction: 'click .js-devbar__toggle',
           
           // Selectors
           toolbarListItemSelector: '.devbar__list-item',
           toolbarItemSelector: '.js-devbar__item',
           toolbarListSelector: '.devbar__list',
           toolbarListInnerSelector: '.devbar__ul',
           
           // Active Classes
           toolbarItemActiveClass: 'devbar__item--active',
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
               
               var $item = $(event.currentTarget).closest(this.options.toolbarItemSelector),
                   active = $item.hasClass(this.options.toolbarItemActiveClass);
            
               if(!active){
                   $item.addClass(this.options.toolbarItemActiveClass);
               }else{
                   $item.removeClass(this.options.toolbarItemActiveClass);
               }
           };
           
           // Toggles click events
           events[this.options.toolbarToggleAction] = function(event) {
               event.preventDefault();
               var self = this;
               
               // find the associated item
               var $this = $(event.currentTarget),
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
   
   return $.llapgoch.devtoolbar;
});
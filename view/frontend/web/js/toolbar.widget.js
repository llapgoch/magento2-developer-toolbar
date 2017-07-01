define([
    'jquery',
    'jquery/ui',
], function ($) {
   $.widget('llapgoch.devtoolbar', {
       options: {
           // Actions
           identifier: 'llapgochDevtoolbar',
           buttonLinkAction: 'click .js-devbar__button-link',
           toolbarToggleAction: 'click .js-devbar__toggle',

           // Selectors
           toolbarContainerSelector: '.devbar',
           toolbarListItemSelector: '.devbar__list-item',
           toolbarItemSelector: '.js-devbar__item',
           toolbarListSelector: '.devbar__list',
           toolbarListInnerSelector: '.devbar__ul',

           toolbarListInfoSelector: '.devbar__info',
           toolbarListInfoActiveClass: 'is-active',

           // Active Classes
           toolbarItemActiveClass: 'devbar__item--active',
           toolbarToggleActiveClass: 'is-active',
           itemOpenClass: 'is-active',

           // Settings
           animateCloseTime: 300,
           animateOpenTime: 300,
       },

       _create: function() {
           this._super();
           this._addEvents();
       },

       // Other classes should use these instead of accessing the options directly in case the variables change
       getListItemSelector: function(){
           return this.options.toolbarListItemSelector;
       },

       getToolbarListItemActiveClass: function(){
           return this.options.toolbarListItemActiveClass;
       },

       getToolbarInfoSelector: function(){
           return this.options.toolbarListInfoSelector;
       },

       getToolbarInfoActiveClass: function(){
           return this.options.toolbarListInfoActiveClass;
       },

       getToolbarItemSelector: function(){
           return this.options.toolbarItemSelector;
       },

       closeAllPanels: function() {
           var self = this;
            $(this.options.toolbarItemSelector, this.getToolbarContainer()).each(function(){
                var instance = $(this).data(self.options.identifier);
                instance && instance.closePanel();
            });
       },

       closePanel: function() {
           this.element.removeClass(this.options.toolbarItemActiveClass);
       },

       getToolbarContainer: function() {
           return this.element.closest(this.options.toolbarContainerSelector);
       },

       _addEvents: function() {
           var events = {};

           // Button click event
           events[this.options.buttonLinkAction] = function(event) {
               event.preventDefault();

               var $item = $(event.currentTarget).closest(this.options.toolbarItemSelector),
                   active = $item.hasClass(this.options.toolbarItemActiveClass);

               this.closeAllPanels();

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
                   $item.removeClass(activeClass);
                   $this.removeClass(activeClass);

                   $item.css('height', 'auto');

                   $item.animate({
                       'height': 0
                   }, self.options.animateOpenTime);

                   $item.removeClass(activeClass);
               }else{
                   $item.animate({
                       'height': $inner.outerHeight()
                   },{
                       'complete': function(){
                           $item.addClass(activeClass);
                           $item.css('height', 'auto');
                       },
                       'duration': self.options.animateCloseTime
                   });

                   $this.addClass(activeClass);
               }
           };

           this._on(this.element, events);
       }
   })

   return $.llapgoch.devtoolbar;
});
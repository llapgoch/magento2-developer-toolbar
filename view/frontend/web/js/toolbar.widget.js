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
           itemOpenClass: 'is-active',

           // Settings
           animateCloseTime: 300,
           animateOpenTime: 300,
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
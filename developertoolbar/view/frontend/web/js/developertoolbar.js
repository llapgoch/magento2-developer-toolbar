requirejs(['jquery'], function($){
    return;
    $('.js-developertoolbar__button-link').on('click', function(ev){
        ev.preventDefault();

        var $item = $(this).closest('.js-developertoolbar__item'),
            active = $item.hasClass('developertoolbar__item--active');

        $('.developertoolbar__item').removeClass('developertoolbar__item--active');

        if(!active){
            $item.addClass('developertoolbar__item--active');
        }
    });
    
    $('.js-developertoolbar__toggle').on('click', function(ev){
        ev.preventDefault();

        var $this = $(this);

        // find the associated item
        var $item = $(this)
                .closest('.developertoolbar__list-item')
                .find('.developertoolbar__list'),
            $ul   = $item.find('.developertoolbar__ul').first();
        
        if($item.hasClass('is-active')){
            $item.animate({
                'height': 0
            }, 250);
            
            $item.removeClass('is-active');
            $this.removeClass('is-active');
        }else{
            $item.animate({
                'height': $ul.outerHeight(),
                'complete': function(){
                    
                }
            }, 250);
            
            $item.addClass('is-active');
            $this.addClass('is-active');
        }
    });
});
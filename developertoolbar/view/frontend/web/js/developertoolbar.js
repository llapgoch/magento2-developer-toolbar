;(function($){
    if(!$){
        return;
    }
    
    $(document).ready(function(){
        $('.js-developertoolbar__button-link').on('click', function(ev){
            ev.preventDefault();

            var $item = $(this).closest('.js-developertoolbar__item'),
                active = $item.hasClass('developertoolbar__item--active'); 
         
            $('.developertoolbar__item').removeClass('developertoolbar__item--active');
  
            if(!active){  
                $item.addClass('developertoolbar__item--active');
            }

        });
    });
}(jQuery));
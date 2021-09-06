$(function(){

   /* burger menu */
   $('.header__menu').click(function(){
      $(this).toggleClass('header__menu--active');
      $('.sidenav-panel').toggleClass('sidenav-panel--active')
   })
   /* --- burger menu end --- */
});

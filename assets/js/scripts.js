$(function() {

    /* burger menu */
    $('.header__menu').click(function() {
            $(this).toggleClass('header__menu--active');
            $('.sidenav-panel').toggleClass('sidenav-panel--active')
        })
        /* --- burger menu end --- */

    $('.nav-label').click(function() {
        $(this).find('.fas').toggleClass('active-arrow');
    })
});

$(function() {

    var url = window.location.pathname,
        urlRegExp = new RegExp(url.replace(/\/$/, '') + "$"); // create regexp to match current url pathname and remove trailing slash if present as it could collide with the link in navigation in case trailing slash wasn't present there
    // now grab every link from the navigation
    $('a').each(function() {
        // and test its normalized href against the url pathname regexp
        if (urlRegExp.test(this.href.replace(/\/$/, ''))) {
            $(this).addClass('active');
        }
    });

});
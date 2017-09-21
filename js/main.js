$(function () {
    // 导航按钮
    $('.btn-triger').click(function () {
	    $(this).closest('.btn-group').toggleClass('open');
    });
    // 页面切换
    var $navList = $('.btn-list > .nav-tabs-btn');
    $navList.click(function () {
        var pageList = $('.page-list .page-item');
        pageList.each(function(){
            var isActive = $(this).hasClass('active');
            if(isActive) {
                $(this).animate({left:'-760px'});
                $(this).removeClass('active');
            } else {
                $(this).css('left','760px');
            }
        });
        var dataNav = $(this).attr('data-nav');
        var pageItem = $('.data-nav-' + dataNav);
        pageItem.animate({left:'0'});
        pageItem.addClass('active');
    });

})

(function () {
    $("#app-wrapper").on("click", "#menu-toggle", function (e) {
        e.preventDefault();
        $("#app-wrapper #sidebar-wrapper").toggleClass("toggled");
    });

    $("#app-wrapper").on("click", "#menu-toggle", function () {
        $("#glyphToggle").toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
    });

    $('#sidebarList li').on("click", '.glyphFeeds', function () {
        $(this).children('.glyphicon').toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
    });
    
})();

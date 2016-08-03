// function toggleSidebar() {
//   $(".button").toggleClass("active");
//   $("main").toggleClass("move-to-left");
//   $(".sidebar-item").toggleClass("active");
// }

// $(".button").on("click tap", function() {
//   toggleSidebar();
// });

// $(document).keyup(function(e) {
//   if (e.keyCode === 27) {
//     toggleSidebar();
//   }
// });


(function () {
    $("#app-wrapper").on("click", "#menu-toggle", function (e) {
        e.preventDefault();
        $("#app-wrapper #sidebar-wrapper").toggleClass("toggled");
    });

    $("#app-wrapper").on("click", "#menu-toggle", function () {
        $("#glyphToggle").toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
    });
    
//    $("#sidebar").on("click", ".feeds", function () {
//        $(".glyphFeeds").toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
//    });
})();

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
    $("#menu-toggle").click(function (e) {
        console.log("Called");
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $("#toggleBtn").click(function () {
        $("#glyphToggle").toggleClass(' glyphicon-align-justify glyphicon-remove');
    });

    $("#feeds").click(function () {
        $("#glyphFeeds").toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
    });
})();

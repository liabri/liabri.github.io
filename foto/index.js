$(document).ready(function () {
    $("#pagepiling").pagepiling({
        menu: "#menu",
        anchors: ["tangledtapestry", "polonja", "italja"],
        sectionsColor: ["#eeeef2", "#0e0e0e", "#eeeef2"],
        loopTop: true,
        loopBottom: true,
    });
});

function hideProjectsList() {
    document.getElementById("projectslist").style.opacity = 0;
    document.getElementById("projectslist").style.visibility = "hidden";
}

function showProjectsList() {
    document.getElementById("projectslist").style.opacity = 1;
    document.getElementById("projectslist").style.visibility = "visible";
}

$(container).css({
    height: "100vh",
    overflow: "hidden",
    "-ms-touch-action": "none",
    "touch-action": "none",
});

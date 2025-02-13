$(document).ready(function () {
    $("#pagepiling").pagepiling({
        menu: "#projectslist",
        anchors: ["tangledtapestry", "polonja", "italja", "about"],
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

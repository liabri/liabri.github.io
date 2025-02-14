let rafId;

var mouseDetected = false;
if (matchMedia("(pointer:fine)").matches) mouseDetected = true;

window.addEventListener("load", function () {
    // jump to section based on anchor on page load
    hash = location.hash;
    window.location.hash = "";
    window.location.hash = hash;

    if (mouseDetected) {
        // enable horizontal scrolling for first section
        horizontalScrolling(1);
        //  enable buttons to change section
        document.getElementById("buttons").style.display = "flex";
    }
});

$(document).ready(function () {
    $("#pagepiling").pagepiling({
        menu: "#projectslist",
        anchors: ["tangledtapestry", "echoes-of-the-road", "about"],
        sectionsColor: ["#eeeef2", "#eeeef2", "#eeeef2"],
        loopTop: true,
        loopBottom: true,
        keyboardScrolling: true,
        sectionSelector: ".section",
        animateAnchor: false,
        touchSensitivity: 12,

        afterLoad: function (anchorLink, index) {
            if (mouseDetected) horizontalScrolling(index);
        },
    });

    if (mouseDetected) $("#pagepiling").pagepiling.setMouseWheelScrolling();
});

function openAbout() {
    document.getElementById("about").style.opacity = 1;
    document.getElementById("about").style.visibility = "visible";
    document.getElementById("aboutnav").style.backgroundColor = "#34856c";
    document.getElementById("pp-nav").style.opacity = 0;
    document.getElementById("pp-nav").style.visibility = "hidden";
    document.getElementById("about").style.left = 0;
}

function hideAbout() {
    document.getElementById("about").style.opacity = 0;
    document.getElementById("about").style.visibility = "hidden";
    document.getElementById("aboutnav").style.backgroundColor = "transparent";
    document.getElementById("pp-nav").style.opacity = 1;
    document.getElementById("pp-nav").style.visibility = "visible";
    document.getElementById("about").style.left = "-100vw";
}

function hideProjectsList() {
    document.getElementById("projectslist").style.opacity = 0;
    document.getElementById("projectslist").style.visibility = "hidden";
    document.getElementById("projects").style.backgroundColor = "transparent";
}

function showProjectsList() {
    document.getElementById("projectslist").style.opacity = 1;
    document.getElementById("projectslist").style.visibility = "visible";
    document.getElementById("projects").style.backgroundColor = "#34856c";
}

function horizontalScrolling(index) {
    const sections = document.querySelectorAll(".section");
    scrollContainer = sections[index - 1];

    try {
        var offsetX = scrollContainer.scrollLeft;
    } catch {
        var offsetX = 0;
    }

    var speedX = 0;
    const deltaMultiplier = 25;
    const maxSpeed = 400;
    const friction = 0.75;

    function draw() {
        cancelAnimationFrame(rafId);

        offsetX += speedX;
        const maxScrollLeft =
            scrollContainer.scrollWidth - scrollContainer.clientWidth;
        offsetX = Math.min(offsetX, maxScrollLeft);
        offsetX = Math.max(offsetX, 0);

        scrollContainer.scrollLeft = offsetX;
        speedX *= friction;

        // about 60 times a second
        rafId = requestAnimationFrame(draw);
    }

    scrollContainer.addEventListener("wheel", (ev) => {
        ev.preventDefault();
        var delta = -1 * Math.sign(ev.wheelDelta);
        speedX += delta * deltaMultiplier;
        speedX =
            speedX > 0
                ? Math.min(speedX, maxSpeed)
                : Math.max(speedX, -maxSpeed);
        return false;
    });

    draw();
}

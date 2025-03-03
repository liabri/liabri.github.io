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
        try { document.getElementById("right").style.display = "flex"; }  catch {}
    }
});

if (window.jQuery) {
    $(document).ready(function () {
        $("#pagepiling").pagepiling({
            menu: "#projects",
            anchors: ["tangledtapestry", "echoes-of-the-road", "the-people-of-djerdap", "glitch"],
            sectionsColor: ["#eeeef2", "#eeeef2", "#eeeef2", "#eeeef2"],
            loopTop: true,
            loopBottom: true,
            keyboardScrolling: false,
            verticalCentered: true,
            navigation: false,
            sectionSelector: ".section",
            touchSensitivity: 12,

            afterLoad: function (anchorLink, index) {
                if (mouseDetected) horizontalScrolling(index);
            },
        });

        $.fn.pagepiling.setAllowScrolling(false);
        if (mouseDetected) $("#pagepiling").pagepiling.setMouseWheelScrolling();
    });
}

function show(self, about) {
    if (about) {
        document.getElementById("about").classList.add("active");
    } else {
        document.getElementById("projects").classList.add("active");
    }
}

function hide() {
    document.getElementById("about").classList.remove("active");
    document.getElementById("projects").classList.remove("active");
}

function horizontalScrolling(index) {
    var sections = [];
    sections = document.querySelectorAll(".section");
    scrollContainer = sections[index - 1];

    if (typeof scrollContainer == 'undefined') {
        scrollContainer = document.getElementById("firstroll");
    }

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

        progressBarPercentage=Math.round((offsetX/maxScrollLeft)*100);
        document.getElementById("progressBar").style.width = progressBarPercentage + "%";
        if (progressBarPercentage>20) {
            document.getElementById("progressBarTip").style.opacity = 0;
            document.getElementById("progressBarTip").style.visibility = "hidden";
        } else {
            document.getElementById("progressBarTip").style.opacity = 0.8;
            document.getElementById("progressBarTip").style.visibility = "visible";
        }

        // about 60 times a second
        rafId = requestAnimationFrame(draw);
    }

    scrollContainer.addEventListener("wheel", (ev) => {
        // ev.preventDefault();
        var delta = -1 * Math.sign(ev.wheelDelta);
        speedX += delta * deltaMultiplier;
        speedX =
            speedX > 0
                ? Math.min(speedX, maxSpeed)
                : Math.max(speedX, -maxSpeed);
        return false;
    }, {passive: true});

    document.addEventListener("keydown", (ev) => {
        // ev.preventDefault();
        delta = 0;
        if (ev.code=="ArrowRight" || ev.code=="ArrowDown") {
            delta = 3;
        } else if (ev.code=="ArrowLeft" || ev.code=="ArrowUp") {
            delta = -3;
        }

        speedX += delta * deltaMultiplier;
        speedX =
            speedX > 0
                ? Math.min(speedX, maxSpeed)
                : Math.max(speedX, -maxSpeed);
        return false;
    }, {passive: true});

    draw();
}

// Get the current page scroll position
scrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop;
scrollLeft =
    window.pageXOffset ||
    document.documentElement.scrollLeft,

    // if any scroll is attempted,
    // set this to the previous value
    window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
    };

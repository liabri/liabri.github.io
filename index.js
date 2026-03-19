let scrollEnabled = false;

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('hashchange', () => {
      if (window.location.hash.length > 1) {
        document.documentElement.setAttribute('data-has-hash', 'true');
      }
    });


    // disable select features on non mouse devices
    window.addEventListener("load", function () {
        if (matchMedia("(pointer:fine)").matches) {
            // horizontalScrollEnabled = false;
            // horizontalScrolling(0); // disable horizontal scrolling
            // document.getElementById("header").style.display = "none"; // enable scrolling progress bar
        }
    });

    document.getElementById('projector-overlay').addEventListener('animationend', () => {
        document.body.classList.remove('is-changing-section');
        isTransitionLocked = false;
    });

    var myFullpage = new fullpage('#fullpage', {
        licenseKey: 'BAkvmgK&b5',

    	// navigation
    	menu: '#menu',
    	anchors:['tangledTapestry', 'echoesOfTheRoad', 'thePeopleOfDjerdap'],
    	navigation: false,

    	// scrolling
    	css3: true,
    	scrollingSpeed: 400,
    	autoScroll: true,
    	scrollBar: false,

    	// accessibility
    	keyboardScrolling: true,
    	touchSensitivity: 12,

    	lazyLoading: true,
    	lazyLoadThreshold: 0,
    	credits: { enabled: false, label: 'made with fullpage.js', position: 'right'},

        onLeave: function(origin, destination, direction) {
            if (document.body.classList.contains('is-changing-section')) {
                return;
            }

            isTransitionLocked = true;
            document.body.classList.add('is-changing-section');
            // document.getElementById('projector-sound')?.play(); // sound effect?

            setTimeout(() => { // after the shutter covers the screen:
                fullpage_api.silentMoveTo(destination.index + 1); // perform the invisible jump.
                scrollEnabled=true;

                const projectsElement = document.querySelector('#projects');
                if (projectsElement && projectsElement.classList.contains('active')) {
                    // if the change is effectuated from the projects page, reset to beginning of project. would be annoying to scroll backwards in to the previous project and end up at the beginning again.
                    const activeSection = document.querySelector('.fp-section.active');
                    const sectionInner = activeSection.querySelector('.section-inner');
                    sectionInner.scrollLeft = 0;
                    sectionInner.currentScrollX = 0;
                    sectionInner.targetScrollX = 0;

                    // hide the projects page
                    projectsElement.style.transition = 'none'; // remove projects animation for performance
                    projectsElement.classList.remove("active");
                    setTimeout(() => {
                        projectsElement.style.transition = ''; // re-add
                    }, 100);
                }
            }, 350);

            return false;
        },

        afterLoad: function(origin, destination, direction){
            setTimeout(() => {
                isTransitionLocked = false;
            }, 1300); // grace period to absorb leftover scroll events and wait for transition

            // update --section-bg var to the currently active section
            const section = document.querySelector('.fp-section.active');
            document.documentElement.style.setProperty('--section-bg', "rgb("+section.dataset.color+")");

            // make sure --nav-bg is the same as --section-bg
            document.documentElement.style.setProperty('--nav-bg', 'var(--section-bg)');
            document.documentElement.style.setProperty('--nav-text', 'var(--text-primary)');

        }
    });

    // handle logic ourselves
    fullpage_api.setAllowScrolling(false);

    document.querySelectorAll('.section-inner').forEach(sectionInner => {
        sectionInner.currentScrollX = sectionInner.scrollLeft;
        sectionInner.targetScrollX = sectionInner.scrollLeft;
        sectionInner.isScrolling = false;
    });

    // some smooooth horizontal scrolling, only when a mouse is detected
    if (matchMedia("(pointer:fine)").matches) {
        window.addEventListener('wheel', function(e) {
            if (!scrollEnabled) return;

            if (isTransitionLocked) {
                e.preventDefault();
                return;
            }

            const activeSection = document.querySelector('.fp-section.active');
            if (!activeSection) return;

            const sectionInner = activeSection.querySelector('.section-inner');

            // If the active section doesn't have a horizontal sectionInner,
            // or if it's not wide enough to scroll, let fullpage work normally.
            if (!sectionInner || sectionInner.scrollWidth <= sectionInner.clientWidth) {
                fullpage_api.setAllowScrolling(true);
                return;
            }

            const edgeThreshold = 50;
            const atLeftEdge = sectionInner.currentScrollX < edgeThreshold;
            const atRightEdge = sectionInner.currentScrollX >= sectionInner.scrollWidth - sectionInner.clientWidth - edgeThreshold;
            const scrollingUp = e.deltaY < 0;
            const scrollingDown = e.deltaY > 0;

            if ((scrollingUp && atLeftEdge) || (scrollingDown && atRightEdge)) {
                if (isTransitionLocked) return;

                // Check if a vertical move is possible before locking.
                const sections = document.querySelectorAll('.fp-section');
                const sectionIndex = Array.from(sections).indexOf(activeSection);
                const canMoveUp = scrollingUp && sectionIndex > 0;
                const canMoveDown = scrollingDown && sectionIndex < sections.length - 1;

                if (canMoveUp || canMoveDown) {
                    // isTransitionLocked = true;
                    if (canMoveUp) {
                        fullpage_api.moveSectionUp();
                    } else {
                        fullpage_api.moveSectionDown();
                    }
                }
                // if a move is not possible (e.g., scrolling up on the first section),
                // we simply do nothing, and the scroll is ignored, preventing a lock.

            } else {
                // perform horizontal scroll
                sectionInner.targetScrollX += e.deltaY;
                sectionInner.targetScrollX = Math.max(0, Math.min(sectionInner.targetScrollX, sectionInner.scrollWidth - sectionInner.clientWidth));

                if (!sectionInner.isScrolling) {
                    sectionInner.isScrolling = true;
                    requestAnimationFrame(() => smoothScroll(sectionInner));
                }
            }
        }, { passive: false });
    }


     // a single, generic animation function
     function smoothScroll(sectionInner) {
         // stop if the sectionInner is no longer active or the animation flag is turned off, and set section back to beginning
         if (!sectionInner.closest('.fp-section.active') || !sectionInner.isScrolling) {
             sectionInner.isScrolling = false;
             return;
         }

         // lerp logic
         sectionInner.currentScrollX += (sectionInner.targetScrollX - sectionInner.currentScrollX) * 0.1;
         sectionInner.scrollLeft = sectionInner.currentScrollX;

         // stop when we're close enough to the target
         if (Math.abs(sectionInner.targetScrollX - sectionInner.currentScrollX) < 0.5) {
             sectionInner.isScrolling = false;
             return;
         }

         // continue the animation
         requestAnimationFrame(() => smoothScroll(sectionInner));
     }
});

// show/hide nav section
function hide_unless_show(self) {
    const active = document.querySelector(".active");
    const target = self.id === "explore-button" ? "projects" : "about";

    // if current matches the hover, close; if current does not match the hover, close current and open new one; if nothing is open, show
    if (active && active.id === target) {
        hide();
    } else {
        if (active) hide();
        show(self);
    }
}

function show(self) {
    if (isTransitionLocked) return;
    const nav = document.querySelector('nav ul');

    if (self.id=="about-button") {
        // --nav-bg is off white when abouting
        document.documentElement.style.setProperty('--nav-bg', 'var(--bg-primary)');
        document.documentElement.style.setProperty('--nav-text', 'var(--text-primary)');
        document.getElementById("about").classList.add("active");
    }
    else if (self.id=="explore-button") {
        // --nav-bg is dark grey when exploring
        document.documentElement.style.setProperty('--nav-bg', 'var(--bg-secondary)');
        document.documentElement.style.setProperty('--nav-text', 'var(--text-secondary)');
        document.getElementById("projects").classList.add("active");
    }

    scrollEnabled=false;
}

function hide() {
    scrollEnabled=true;

    document.getElementById("about").classList.remove("active");
    document.getElementById("projects").classList.remove("active");

    // match nav to section
    document.documentElement.style.setProperty('--nav-bg', 'var(--section-bg)');
    document.documentElement.style.setProperty('--nav-text', 'var(--text-primary)');
}

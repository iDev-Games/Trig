/* Trig.js v1.8.0 by iDev Games */
const trig = {
    trigs: [],
    thePos: [],
    documentHeight: 0,
    observer: new IntersectionObserver(function(entries) {
            trigObject.trigEntries(entries);
            trigObject.updatePos(trigObject.trigs);
            trigObject.observer.disconnect();
    }),
    trigIntersecting: function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("trig");
        } else {
            entry.target.classList.remove("trig");
        }
    },
    trigInit: function() {
        trigObject.trigs = document.querySelectorAll('.enable-trig,[data-trig]');
        trigObject.documentHeight = innerHeight;
        trigObject.trigScroll();
    },
    trigScroll: function(){
        if (trigObject.trigs) {
            trigObject.trigs.forEach(function(element, index) {
                element.index = index;
                trigObject.observer.observe(element);
            });
        }
    },
    trigEntries: function(entries) {
        entries.forEach(function(entry) {
            trigObject.trigIntersecting(entry);
            trigObject.trigPos(entry);
        });
    },
    trigSetPos: function(pos, min, max, entry) {
        if (pos >= min && pos <= max) {
            trigObject.thePos[entry.target.index] = pos;
        } else if (pos <= min) {
            trigObject.thePos[entry.target.index] = min;
        } else if (pos >= max) {
            trigObject.thePos[entry.target.index] = max;
        }    
    },
    trigPos: function(entry) {
        var offset = 0;
        var min = -100;
        var max = 100;
        var el = entry.boundingClientRect.top;
        var height = entry.boundingClientRect.height;
        if (entry.target.dataset.trigOffset) {
            offset = parseInt(entry.target.dataset.trigOffset);
        }
        if (entry.target.dataset.trigMin) {
            min = parseInt(entry.target.dataset.trigMin);
        }
        if (entry.target.dataset.trigMax) {
            max = parseInt(entry.target.dataset.trigMax);
        }
        if(trigObject.documentHeight > height){
            height = trigObject.documentHeight;
        }
        var posTop = 0 - (el - ((trigObject.documentHeight / 2) + offset));
        var pos = (posTop / (height)) * 100;
        trigObject.trigSetPos(pos, min, max, entry);
    },
    updatePos: function() {
        trigObject.trigs.forEach(function(element, index) {
            if (element.dataset.trigGlobal == "true") {
                var el = document.documentElement.style;
                var id = "-"+element.id;
            } else {
                var el = element.style;
                var id = "";
            }
            el.setProperty('--trig'+id, trigObject.thePos[index] + "%");
            el.setProperty('--trig-reverse'+id, -(trigObject.thePos[index]) + "%");
            el.setProperty('--trig-px'+id, trigObject.thePos[index] + "px");
            el.setProperty('--trig-px-reverse'+id, -(trigObject.thePos[index]) + "px");
            el.setProperty('--trig-deg'+id, ((trigObject.thePos[index] / 100) * 360) + "deg");
            el.setProperty('--trig-deg-reverse'+id, ((-(trigObject.thePos[index]) / 100) * 360) + "deg");
        });
    }
};

const trigObject = Object.create(trig);

document.addEventListener('scroll', trigObject.trigScroll, false);
document.addEventListener('resize', trigObject.trigInit, false);
document.addEventListener('DOMContentLoaded', trigObject.trigInit, false);
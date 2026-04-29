/* NAVBAR  */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

/* abrir / cerrar menú */
menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");
});

/* cerrar al hacer click en un link */
document.querySelectorAll(".navbar-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
    });
});

/* cerrar al hacer click fuera del menú */
document.addEventListener("click", (e) => {
    const isClickInsideMenu = navLinks.contains(e.target);
    const isToggle = menuToggle.contains(e.target);

    if (!isClickInsideMenu && !isToggle) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
    }
});




/* SLIDER */

const slider = document.getElementById("slider");
const track = slider.querySelector(".slider-slides");
let slides = Array.from(track.children);
const nextBtn = slider.querySelector(".slider-arrow--next");
const prevBtn = slider.querySelector(".slider-arrow--prev");
const dotsContainer = slider.querySelector(".slider-dots");
const progressBar = slider.querySelector(".slider-progress span");
let index = 1;
let isMoving = false;
let auto;


/*INFINITE LOOP (CLONES)*/
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);
slides = Array.from(track.children);
track.style.transform = `translateX(-100%)`;
const realSlidesCount = slides.length - 2;


/* DOTS */

for (let i = 0; i < realSlidesCount; i++) {

    const dot = document.createElement("span");
    dot.addEventListener("click", () => moveTo(i + 1));
    dotsContainer.appendChild(dot);
}

const dots = dotsContainer.children;

function updateUI() {
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
    [...dots].forEach(d => d.classList.remove("active"));
    dots[(index - 1 + realSlidesCount) % realSlidesCount].classList.add("active");
}


/* MOVIMIENTO DEL SLIDER */

function moveTo(i) {
    // evita doble animación
    if (isMoving) return;
    isMoving = true;

    index = i;

    track.style.transition = "transform 1s cubic-bezier(0.77,0,0.175,1)";
    track.style.transform = `translateX(-${index * 100}%)`;

    resetProgress();
}

function next() { moveTo(index + 1); }
function prev() { moveTo(index - 1); }


/* LOOP INFINITO */

track.addEventListener("transitionend", () => {

    if (slides[index].isSameNode(firstClone)) {
        track.style.transition = "none";
        index = 1;
        track.style.transform = `translateX(-100%)`;
    }

    if (slides[index].isSameNode(lastClone)) {
        track.style.transition = "none";
        index = realSlidesCount;
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    isMoving = false;
    updateUI();
});


/* BOTONES */

nextBtn.onclick = next;
prevBtn.onclick = prev;


/* AUTOPLAY + PROGRESS BAR */

function startAuto() {

    progressBar.style.transition = "none";
    progressBar.style.width = "0%";

    setTimeout(() => {
        progressBar.style.transition = "width 4s linear";
        progressBar.style.width = "100%";
    }, 50);

    auto = setTimeout(next, 4000);
}

function resetProgress() {
    clearTimeout(auto);
    startAuto();
}


/* INTERACCIONES USUARIO */

// pausa autoplay al pasar el mouse
slider.addEventListener("mouseenter", () => clearTimeout(auto));

// reanuda autoplay al salir
slider.addEventListener("mouseleave", startAuto);

// pausa si el usuario cambia de pestaña
document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimeout(auto);
    else startAuto();
});


/* SWIPE (mobile / touch) */

let startX = 0;
let isDragging = false;

track.addEventListener("pointerdown", e => {
    startX = e.clientX;
    isDragging = true;
});

track.addEventListener("pointerup", e => {
    if (!isDragging) return;

    let diff = e.clientX - startX;

    if (diff > 50) prev();

    if (diff < -50) next();

    isDragging = false;
});


/* INIT */

updateUI();
startAuto();


/* FORM */

const form = document.querySelector(".contact-form");
const button = document.querySelector(".contact-btn");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
        const group = field.parentElement;

        if (!field.value.trim()) {
            group.classList.add("error");
            isValid = false;
        } else {
            group.classList.remove("error");
        }
    });

    if (!isValid) return;

    button.classList.add("loading");

    // Simulación de envío
    setTimeout(() => {
        button.classList.remove("loading");
        button.classList.add("success");

        form.reset();

        // Reset
        setTimeout(() => {
            button.classList.remove("success");
        }, 2000);

    }, 1500);
});
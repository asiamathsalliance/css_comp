const homeBtn = document.getElementById("homeBtn");
const teaBtn = document.getElementById("teaBtn");
const aboutBtn = document.getElementById("aboutBtn");
const homeBtn4 = document.getElementById("homeBtn4");
const teaBtn4 = document.getElementById("teaBtn4");
const aboutBtn4 = document.getElementById("aboutBtn4");
const envelopeBtn = document.getElementById("envelopeBtn");
const typedTextWrap = document.querySelector(".typed-text");
const typeLineCurrent = document.getElementById("typeLineCurrent");
const typeLineNext = document.getElementById("typeLineNext");

const page2 = document.getElementById("page2");
const page3 = document.getElementById("page3");
const page4 = document.getElementById("page4");
const teaScene = document.querySelector(".tea-scene");
const pupils = document.querySelectorAll("[data-pupil]");
const eyes = document.querySelectorAll("[data-eye]");
const draggableItems = document.querySelectorAll("[data-draggable]");
let topLayerIndex = 20;

const scrollToSection = (section) => {
  section.scrollIntoView({ behavior: "smooth", block: "start" });
};

homeBtn.addEventListener("click", () => scrollToSection(page2));
teaBtn.addEventListener("click", () => scrollToSection(page3));
aboutBtn.addEventListener("click", () => scrollToSection(page4));
homeBtn4.addEventListener("click", () => scrollToSection(page2));
teaBtn4.addEventListener("click", () => scrollToSection(page3));
aboutBtn4.addEventListener("click", () => scrollToSection(page4));

envelopeBtn.addEventListener("click", () => scrollToSection(page3));

const updateEyes = (clientX, clientY) => {
  eyes.forEach((eye, index) => {
    const pupil = pupils[index];
    if (!pupil) return;

    const rect = eye.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const angle = Math.atan2(dy, dx);
    const maxRadius = rect.width * 0.23;

    const moveX = Math.cos(angle) * maxRadius;
    const moveY = Math.sin(angle) * maxRadius;
    pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
  });
};

window.addEventListener("mousemove", (event) => {
  updateEyes(event.clientX, event.clientY);
});

window.addEventListener(
  "touchmove",
  (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    updateEyes(touch.clientX, touch.clientY);
  },
  { passive: true }
);

draggableItems.forEach((item) => {
  let dragging = false;
  let pointerId = null;
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;
  let hasMoved = false;
  let pressedEnvelope = false;

  const onMove = (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const sceneRect = teaScene.getBoundingClientRect();
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMoved = true;
    }
    item.style.left = `${event.clientX - sceneRect.left - offsetX}px`;
    item.style.top = `${event.clientY - sceneRect.top - offsetY}px`;
  };

  const onUp = (event) => {
    if (event.pointerId !== pointerId) return;
    if (!hasMoved && pressedEnvelope) {
      item.classList.toggle("is-open");
      item.style.zIndex = `${++topLayerIndex}`;
    }
    dragging = false;
    pointerId = null;
    pressedEnvelope = false;
    item.releasePointerCapture(event.pointerId);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  item.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    dragging = true;
    pointerId = event.pointerId;
    item.setPointerCapture(pointerId);

    const rect = item.getBoundingClientRect();
    const sceneRect = teaScene.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    startX = event.clientX;
    startY = event.clientY;
    hasMoved = false;
    pressedEnvelope = Boolean(event.target.closest("[data-envelope-toggle]"));

    item.style.left = `${rect.left - sceneRect.left}px`;
    item.style.top = `${rect.top - sceneRect.top}px`;
    item.style.zIndex = `${++topLayerIndex}`;

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
});

const aboutTypingLines = [
  "and who am i?",
  "that's one",
  "secret i'll",
  "never tell"
];

let typingStarted = false;
let activeLineIndex = 0;

const runTyping = () => {
  if (!typedTextWrap || !typeLineCurrent || !typeLineNext) return;
  typingStarted = true;
  typeLineCurrent.textContent = aboutTypingLines[activeLineIndex];

  setInterval(() => {
    const nextIndex = (activeLineIndex + 1) % aboutTypingLines.length;
    typeLineNext.textContent = aboutTypingLines[nextIndex];
    typedTextWrap.classList.add("slide-up");

    setTimeout(() => {
      typeLineCurrent.textContent = aboutTypingLines[nextIndex];
      typeLineNext.textContent = "";
      typedTextWrap.classList.remove("slide-up");
      activeLineIndex = nextIndex;
    }, 440);
  }, 1450);
};

if (typedTextWrap) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !typingStarted) {
          runTyping();
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(page4);
}

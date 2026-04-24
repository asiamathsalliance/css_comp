const stage = document.getElementById("stage");
if (!stage) {
  throw new Error("Stage element not found.");
}

const updateSpotlight = (x, y) => {
  stage.style.setProperty("--spot-x", `${x}px`);
  stage.style.setProperty("--spot-y", `${y}px`);
};

window.addEventListener("mousemove", (event) => {
  stage.classList.add("is-active");
  updateSpotlight(event.clientX, event.clientY);
});

window.addEventListener("mouseleave", () => {
  stage.classList.remove("is-active");
});

window.addEventListener(
  "touchmove",
  (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    stage.classList.add("is-active");
    updateSpotlight(touch.clientX, touch.clientY);
  },
  { passive: true }
);

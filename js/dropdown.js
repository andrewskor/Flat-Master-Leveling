document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector('.dropdown-js');
  const menu = document.querySelector(".dropdown-menu");

  const isTouchDevice = window.matchMedia("(hover: none)").matches;

  if (isTouchDevice) {
    // Tap to toggle on mobile
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.style.display === "block";
      menu.style.display = isOpen ? "none" : "block";
    });

    document.addEventListener("click", () => {
      menu.style.display = "none";
    });
  } else {
    // Hover on desktop
    dropdown.addEventListener("mouseenter", () => {
      menu.style.display = "block";
    });
    dropdown.addEventListener("mouseleave", () => {
      menu.style.display = "none";
    });
  }
});
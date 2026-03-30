document.addEventListener("DOMContentLoaded", () => {
	const dropdown = document.querySelector('.dropdown-js');
	const menu = document.querySelector(".dropdown-menu");
	
	dropdown.addEventListener("mouseenter", () => {
		menu.style.display = "block";
	})
	
	dropdown.addEventListener("mouseleave", () => {
		menu.style.display = "none";
	})
});
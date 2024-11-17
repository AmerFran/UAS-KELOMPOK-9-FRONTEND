const buttons = document.querySelectorAll(".buttons");
const boxes = document.querySelectorAll(".box");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    boxes.forEach((box) => {
      if (filter === "all") {
        box.style.display = "block"; // Memunculkan semua 
      } else {
        if (box.classList.contains(filter)) {
          box.style.display = "block"; // Hanya memunculkan opsi yang diinginkan / terfilter
        } else {
          box.style.display = "none"; // Menyembunyikan opsi yang lain
        }
      }
    });
  });
});

// Jika tombol burger dipencet maka muncul navbar
function toggleMenu() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}
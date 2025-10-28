document.querySelectorAll('nav a, #scroll-btn').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('href') || '#projects';
    const section = document.querySelector(target);
    if(section) {
      const navHeight = document.querySelector('nav').offsetHeight;
      const sectionTop = section.offsetTop;
      const scrollPosition = sectionTop - navHeight;

      window.scrollTo({
        top: scrollPosition, behavior: 'smooth'
      })
    }
  });
});

const progress = document.querySelector(".progress");
const loader = document.getElementById("loader");

let width = 0;
let progressInterval;

// Simule la progression jusqu’à 90%
function startFakeProgress() {
  progressInterval = setInterval(() => {
    if (width < 90) {
      width += Math.random() * 2;
      if (width > 90) width = 90;
      progress.style.width = width + "%";
    } else {
      clearInterval(progressInterval);
    }
  }, 100);
}

startFakeProgress();


// Quand la page est complètement chargée
window.addEventListener("load", () => {
  clearInterval(progressInterval);

  // Termine doucement à 100%
  progress.style.transition = "width 0.5s ease";
  progress.style.width = "100%";

  // Attendre que la transition soit terminée
  progress.addEventListener("transitionend", () => {
    // Puis faire disparaître le loader
    loader.style.transition = "opacity 0.5s ease";
    loader.style.opacity = 0;

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, { once: true }); // Évite que ça s'exécute plusieurs fois
});
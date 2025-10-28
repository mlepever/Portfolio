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

fetch('projects.json')
  .then(response => {
    if (!response.ok) throw new Error("Erreur de chargement du JSON");
    return response.json();
  })
  .then(data => {
    const container = document.getElementById("projects-container");

    // Nettoie le nom pour qu'il soit compatible avec les classes CSS
    const sanitizeClass = (str) =>
      String(str).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-_]/g, '');

    data.forEach(project => {
      // Fonction pour créer les meta-items
      const createMetaItems = (key, value, icon) => {
        if (!value) return '';
        const values = Array.isArray(value) ? value : [value];
        const className = sanitizeClass(key);

        return values.map(v => `
          <span id="project-${className}">${v}</span>
        `).join('');
      };

      const projectHTML = `
        <div class="project-card" onclick="window.location.href='/${project.link}'" style="cursor:pointer;">
          <div class="project-video">
            <video src="${project.video}" muted loop autoplay></video>
          </div>
          <div class="project-content">
            <h3>${project.title}</h3>
            <h4>${project.genre}</h4>
            <p>${project.description}</p>
            <div class="project-work">
              <span id="project-engine">${project.engine}</span>
              ${createMetaItems("language", project.language, null)}
            </div>
          </div>
        </div>
      `;

      container.innerHTML += projectHTML;
    });
  })
  .catch(err => console.error(err));

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

    // {
    //     "title": "Tetris",
    //     "genre": "Puzzle - Strategy",
    //     "year": 2024,
    //     "team": 1,
    //     "duration": "1 week",
    //     "engine": "Pygame",
    //     "video": "videos/tetris.mp4",
    //     "link": "tetris",
    //     "description": "This game is a Sokoban where some boxes can move automatically."
    // }

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const backToTopButton = document.getElementById("back-to-top");
const themeToggle = document.getElementById("theme-toggle");
const themedIcons = document.querySelectorAll("[data-theme-icon]");

const updateThemeIcons = () => {
  const isLight = document.body.classList.contains("light-mode");

  themedIcons.forEach((icon) => {
    const lightSrc = icon.getAttribute("data-light-src");
    const darkSrc = icon.getAttribute("data-dark-src");

    if (lightSrc && darkSrc) {
      icon.src = isLight ? lightSrc : darkSrc;
    }
  });
};

const applyTheme = (isLight) => {
  document.body.classList.toggle("light-mode", isLight);
  updateThemeIcons();

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode",
    );
    themeToggle.setAttribute(
      "title",
      isLight ? "Switch to dark mode" : "Switch to light mode",
    );
  }
};

if (themeToggle) {
  const preferredTheme = localStorage.getItem("portfolio-theme");
  const defaultLight =
    preferredTheme === null ? false : preferredTheme === "light";
  applyTheme(defaultLight);

  themeToggle.addEventListener("click", () => {
    const isLight = !document.body.classList.contains("light-mode");
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    applyTheme(isLight);
  });
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    menuToggle.setAttribute(
      "aria-expanded",
      String(navMenu.classList.contains("open")),
    );
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navMenu.classList.remove("open"));
  });
}

const typedText = document.querySelector("[data-typed]");
const typedStrings = [
  "Building Scalable Platforms and Cloud-Native Systems.",
  "Building AI-Powered Applications with Production Reliability.",
  "Designing Reliable Distributed Systems for Global Scale.",
  "Operating Kubernetes, AWS, and CI/CD at Production Scale.",
  "Improving Observability, SRE Practices, and Incident Response.",
  "Automating Infrastructure, Deployments, and Developer Workflows.",
  "Leading Platform Modernization and DevOps Excellence.",
];

if (typedText) {
  let stringIndex = Math.floor(Math.random() * typedStrings.length);
  let charIndex = 0;
  let isDeleting = false;

  const typeLoop = () => {
    const current = typedStrings[stringIndex];

    if (isDeleting) {
      typedText.textContent = current.slice(0, charIndex--);
    } else {
      typedText.textContent = current.slice(0, charIndex++);
    }

    let pause = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex > current.length) {
      pause = 1400;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % typedStrings.length;
      charIndex = 0;
      pause = 220;
    }

    setTimeout(typeLoop, pause);
  };

  typeLoop();
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const counters = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.count || 0);
        const suffix = element.dataset.suffix || "";
        const prefix = element.dataset.prefix || "";
        let current = 0;
        const duration = 1200;
        const step = Math.max(1, Math.ceil(target / (duration / 20)));

        const update = () => {
          current += step;
          if (current >= target) {
            element.textContent = `${prefix}${target}${suffix}`;
            countObserver.unobserve(element);
            return;
          }
          element.textContent = `${prefix}${current}${suffix}`;
          requestAnimationFrame(update);
        };

        update();
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach((counter) => countObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.dataset.suffix || "";
    const prefix = counter.dataset.prefix || "";
    counter.textContent = `${prefix}${target}${suffix}`;
  });
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
        });
      });
    },
    { threshold: 0.5 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const updateBackToTop = () => {
  if (!backToTopButton) return;
  if (window.scrollY > 320) {
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
  }
};

window.addEventListener("scroll", updateBackToTop);
updateBackToTop();

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const githubContainer = document.getElementById("github-projects");

if (githubContainer) {
  fetch(
    "https://api.github.com/users/kunalmishradev/repos?per_page=6&sort=updated",
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("GitHub API request failed");
      }
      return response.json();
    })
    .then((repos) => {
      if (!Array.isArray(repos) || repos.length === 0) {
        githubContainer.innerHTML =
          '<p class="empty-state">GitHub activity is temporarily unavailable.</p>';
        return;
      }

      const publicRepos = repos.filter((repo) => !repo.private).slice(0, 6);

      githubContainer.innerHTML = publicRepos
        .map((repo) => {
          const description = repo.description || "No description provided.";
          const language = repo.language || "Code";
          const languageColor =
            {
              JavaScript: "#f1e05a",
              TypeScript: "#3178c6",
              Python: "#3572A5",
              CSS: "#563d7c",
              HTML: "#e34c26",
              Node: "#3c873a",
              Shell: "#89e051",
            }[language] || "#8b5cf6";

          return `
          <article class="github-card reveal">
            <div class="github-card-header">
              <h3>${repo.name}</h3>
              <a href="${repo.html_url}" target="_blank" rel="noreferrer" class="repo-link">View</a>
            </div>
            <p>${description}</p>
            <div class="github-meta">
              <span><span class="lang-dot" style="background:${languageColor};"></span>${language}</span>
              <span>★ ${repo.stargazers_count}</span>
            </div>
          </article>
        `;
        })
        .join("");

      const revealElements = githubContainer.querySelectorAll(".reveal");
      if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12 },
        );
        revealElements.forEach((element) => revealObserver.observe(element));
      } else {
        revealElements.forEach((element) => element.classList.add("visible"));
      }
    })
    .catch(() => {
      githubContainer.innerHTML =
        '<p class="empty-state">Unable to load recent GitHub activity right now.</p>';
    });
}

const copyButtons = document.querySelectorAll("[data-copy]");
copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy || "";
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = original;
      }, 1200);
    } catch (error) {
      button.textContent = "Error";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 1200);
    }
  });
});

const yearElement = document.getElementById("current-year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

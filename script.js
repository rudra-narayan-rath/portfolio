// ============================================
// OPTIMIZED PORTFOLIO SCRIPT - Rudra Narayan Rath
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initScrollEffects();
    initSmoothScrolling();
    initIntersectionAnimations();
    initCounters();
    initFormHandler();
    initLazyYouTube();
    initLeetCodeOnView();
});

// ============================================
// 1. FAST LOADER (No Artificial Delay)
// ============================================
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    if (loader) loader.classList.add("hidden");
    document.body.classList.add("loaded");
});

// ============================================
// 2. NAVIGATION
// ============================================
function initNavigation() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.classList.remove("menu-open");
        });
    });
}

// ============================================
// 3. NAVBAR SCROLL EFFECT
// ============================================
function initScrollEffects() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 80);
    });
}

// ============================================
// 4. SMOOTH SCROLLING
// ============================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (!target) return;

            const offset = 70;
            const position = target.offsetTop - offset;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });
        });
    });
}

// ============================================
// 5. FADE-IN ANIMATIONS
// ============================================
function initIntersectionAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(
        "section, .project-card, .tech-item, .certificate-card"
    ).forEach(el => observer.observe(el));
}

// ============================================
// 6. COUNTER ANIMATION
// ============================================
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const profileCard = document.querySelector(".profile-card");
    if (profileCard) observer.observe(profileCard);
}

function animateCounters(container) {
    const counters = container.querySelectorAll(".stat-number");
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        let current = 0;
        const increment = target / 100;

        function update() {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                return;
            }
            counter.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }
        update();
    });
}

// ============================================
// 7. LEETCODE LOAD ONLY WHEN SECTION VISIBLE
// ============================================
function initLeetCodeOnView() {
    const section = document.getElementById("coding-profile");
    if (!section) return;

    const observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
            await loadLeetCodeStats();
            observer.disconnect();
        }
    }, { threshold: 0.3 });

    observer.observe(section);
}

async function loadLeetCodeStats() {
    try {
        const response = await fetch(
            "https://leetcode-stats-api.herokuapp.com/R2024"
        );
        const data = await response.json();

        updateStat("total-solved", data.totalSolved);
        updateStat("medium-solved", data.mediumSolved);
        updateStat("hard-solved", data.hardSolved);

    } catch (err) {
        console.warn("LeetCode API slow or failed. Using fallback.");
    }
}

function updateStat(selector, value) {
    const el = document.querySelector(`[data-stat="${selector}"]`);
    if (el) {
        el.textContent = value;
        el.dataset.target = value;
    }
}

// ============================================
// 8. LAZY LOAD YOUTUBE (MAJOR PERFORMANCE BOOST)
// ============================================
function initLazyYouTube() {
    document.querySelectorAll(".youtube-placeholder").forEach(container => {
        container.addEventListener("click", () => {
            const videoId = container.dataset.id;

            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.setAttribute("allowfullscreen", "");
            iframe.loading = "lazy";

            container.innerHTML = "";
            container.appendChild(iframe);
        });
    });
}

// ============================================
// 9. FORM HANDLER (REAL SUBMISSION)
// ============================================
function initFormHandler() {
    const form = document.getElementById("feedback");
    if (!form) return;

    form.addEventListener("submit", function () {
        const btn = this.querySelector("button");
        btn.innerHTML = "Sending...";
        btn.disabled = true;
    });
}

// ============================================
// 10. GLOBAL ERROR HANDLER
// ============================================
window.addEventListener("error", () => {
    console.warn("Minor script issue detected.");
});

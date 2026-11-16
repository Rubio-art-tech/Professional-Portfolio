// Barry Rubio — portfolio

document.addEventListener("DOMContentLoaded", () => {
  // Animations are intentionally always on for this portfolio, including on
  // machines with the system "reduce motion" setting enabled.
  const reduceMotion = false;

  /* ---------- Year ---------- */
  const year = new Date().getFullYear();
  document.querySelectorAll("#year, .footer-year").forEach((el) => {
    el.textContent = year;
  });

  /* ---------- Starfield ---------- */
  const canvas = document.getElementById("starfield");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let shooting = [];
    let width = 0;
    let height = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(190, Math.round((width * height) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.25 + 0.25,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.16 + 0.03,
        twinkle: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.08 - 0.04,
      }));
    };

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.twinkle += 0.012;
        const flicker = 0.55 + Math.sin(star.twinkle) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(214, 230, 255, ${Math.max(0.08, star.alpha * flicker)})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      shooting.forEach((shot) => {
        const gradient = ctx.createLinearGradient(shot.x, shot.y, shot.x - shot.len, shot.y + shot.len * 0.5);
        gradient.addColorStop(0, `rgba(180, 214, 255, ${shot.life})`);
        gradient.addColorStop(1, "rgba(180, 214, 255, 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(shot.x, shot.y);
        ctx.lineTo(shot.x - shot.len, shot.y + shot.len * 0.5);
        ctx.stroke();
      });
    };

    const step = () => {
      stars.forEach((star) => {
        star.y += star.speed;
        star.x += star.drift;
        if (star.y > height + 2) {
          star.y = -2;
          star.x = Math.random() * width;
        }
        if (star.x > width + 2) star.x = -2;
        if (star.x < -2) star.x = width + 2;
      });

      if (!reduceMotion && Math.random() < 0.006) {
        shooting.push({
          x: Math.random() * width * 0.9 + width * 0.1,
          y: Math.random() * height * 0.45,
          len: Math.random() * 120 + 90,
          life: 1,
        });
      }

      shooting.forEach((shot) => {
        shot.x -= 7;
        shot.y += 3.5;
        shot.life -= 0.018;
      });
      shooting = shooting.filter((shot) => shot.life > 0);

      draw();
      if (!reduceMotion) requestAnimationFrame(step);
    };

    build();
    if (reduceMotion) {
      draw();
    } else {
      requestAnimationFrame(step);
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (reduceMotion) draw();
      }, 180);
    });
  }

  /* ---------- Typing line ---------- */
  const typed = document.getElementById("typed");
  const roles = ["Full Stack Developer", "CSS NC II Passer", "First-Year Student", "HTML · CSS · JavaScript"];

  if (typed && !reduceMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    const tick = () => {
      const role = roles[roleIndex];
      typed.textContent = role.slice(0, charIndex);

      if (!deleting && charIndex === role.length) {
        deleting = true;
        window.setTimeout(tick, 1700);
        return;
      }
      if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        window.setTimeout(tick, 220);
        return;
      }

      charIndex += deleting ? -1 : 1;
      window.setTimeout(tick, deleting ? 40 : 85);
    };

    window.setTimeout(tick, 1900);
  }

  /* ---------- Sidebar drawer ---------- */
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-btn");
  const scrim = document.getElementById("scrim");
  const narrow = window.matchMedia("(max-width: 900px)");

  const openDrawer = () => {
    if (!sidebar || !menuBtn) return;
    sidebar.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
    if (scrim) {
      scrim.hidden = false;
      requestAnimationFrame(() => scrim.classList.add("show"));
    }
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    if (!sidebar || !menuBtn) return;
    sidebar.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    if (scrim) {
      scrim.classList.remove("show");
      window.setTimeout(() => {
        if (!scrim.classList.contains("show")) scrim.hidden = true;
      }, 240);
    }
    document.body.style.overflow = "";
  };

  menuBtn?.addEventListener("click", () => {
    menuBtn.getAttribute("aria-expanded") === "true" ? closeDrawer() : openDrawer();
  });
  scrim?.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar?.classList.contains("open")) {
      closeDrawer();
      menuBtn?.focus();
    }
  });

  narrow.addEventListener("change", (e) => {
    if (!e.matches) closeDrawer();
  });

  /* ---------- Active nav ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".navlink"));

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (narrow.matches) closeDrawer();
    });
  });

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Tabs ---------- */
  document.querySelectorAll("[data-tabs]").forEach((group) => {
    const tabs = Array.from(group.querySelectorAll(".tab"));
    const panels = Array.from(group.querySelectorAll(".tab-panel"));

    const activate = (tab) => {
      const targetId = tab.dataset.panel;

      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
        item.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === targetId);
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const direction = e.key === "ArrowRight" ? 1 : -1;
        const next = tabs[(index + direction + tabs.length) % tabs.length];
        next.focus();
        activate(next);
      });
    });
  });

  /* ---------- Reveal ---------- */
  const revealTargets = document.querySelectorAll(
    ".hero-copy > *, .badge-wrap, .sec-label, .sec-head h2, .sec-intro, .about-text p, " +
    ".facts, .record-list li, .tab-bar, .giant, .cert-card, .stack-card, " +
    ".project-card, .form, .info-panel"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  // Stagger siblings so groups arrive one after another.
  const groups = new Map();
  revealTargets.forEach((el) => {
    const parent = el.parentElement;
    const list = groups.get(parent) || [];
    list.push(el);
    groups.set(parent, list);
  });
  groups.forEach((list) => {
    list.forEach((el, index) => {
      el.style.setProperty("--delay", `${Math.min(index * 70, 350)}ms`);
    });
  });

  const show = (el) => el.classList.add("visible");

  if ("IntersectionObserver" in window) {
    // Two-way reveal: text animates in on the way down and again coming back up.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("visible", entry.isIntersecting);
        });
      },
      { threshold: 0.12, rootMargin: "-2% 0px -8% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach(show);
  }

  // Safety net: anything on screen is shown even if the observer never fires.
  window.setTimeout(() => {
    revealTargets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) show(el);
    });
  }, 2000);

  /* ---------- Intro loader (0 → 100) ---------- */
  const preloader = document.getElementById("preloader");
  const loadCount = document.getElementById("load-count");
  const ringFill = document.getElementById("ring-fill");

  if (preloader && loadCount) {
    const DURATION = 2200;
    const CIRCUMFERENCE = 2 * Math.PI * 88;
    let startedAt = null;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      loadCount.textContent = "100";
      if (ringFill) ringFill.style.strokeDashoffset = "0";

      // Let 100% register before the curtain lifts.
      window.setTimeout(() => {
        preloader.classList.add("is-done");
        document.body.classList.remove("is-loading");
        window.setTimeout(() => preloader.remove(), 900);
      }, 280);
    };

    // Frame-synced, so the number and the ring move together without stepping.
    const drawLoader = (now) => {
      if (startedAt === null) startedAt = now;
      const ratio = Math.min(1, (now - startedAt) / DURATION);
      const eased = 1 - Math.pow(1 - ratio, 3);

      loadCount.textContent = String(Math.round(eased * 100));
      if (ringFill) ringFill.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - eased));

      if (ratio < 1) {
        requestAnimationFrame(drawLoader);
      } else {
        finish();
      }
    };

    requestAnimationFrame(drawLoader);

    // Hidden tabs pause animation frames; never leave the curtain stuck.
    window.setTimeout(() => {
      if (!finished) finish();
    }, DURATION + 700);
  } else {
    document.body.classList.remove("is-loading");
  }

  /* ---------- Scroll progress ---------- */
  const progress = document.getElementById("scroll-progress");
  if (progress) {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ---------- Pointer glow + card spotlight ---------- */
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (finePointer && !reduceMotion) {
    const glow = document.getElementById("cursor-glow");
    if (glow) {
      let gx = window.innerWidth / 2;
      let gy = window.innerHeight / 2;
      let cx = gx;
      let cy = gy;

      window.addEventListener("pointermove", (e) => {
        gx = e.clientX;
        gy = e.clientY;
        glow.classList.add("active");
      });

      const follow = () => {
        cx += (gx - cx) * 0.12;
        cy += (gy - cy) * 0.12;
        glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        requestAnimationFrame(follow);
      };
      follow();
    }

    // Spotlight follows the pointer inside cards and panels.
    document
      .querySelectorAll(".cert-card, .stack-card, .project-card, .glass")
      .forEach((card) => {
        card.addEventListener("pointermove", (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
          card.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
      });

  }

  /* ---------- Badge motion: eased drag + tilt ---------- */
  const lanyard = document.querySelector(".lanyard");
  const badgeWrap = document.querySelector(".badge-wrap");
  const badge = document.querySelector(".badge");
  const hero = document.querySelector(".hero");

  if (lanyard && badgeWrap) {
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    let dragging = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let baseAngle = 0;
    let targetAngle = 0;
    let angle = 0;
    let tiltTargetX = 0;
    let tiltTargetY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let frame = null;

    // One loop eases every transform, so the card glides instead of snapping.
    const render = () => {
      angle += (targetAngle - angle) * 0.18;
      tiltX += (tiltTargetX - tiltX) * 0.12;
      tiltY += (tiltTargetY - tiltY) * 0.12;

      lanyard.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      if (badge) {
        badge.style.transform =
          `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(6px)`;
      }

      const settled =
        Math.abs(targetAngle - angle) < 0.04 &&
        Math.abs(tiltTargetX - tiltX) < 0.04 &&
        Math.abs(tiltTargetY - tiltY) < 0.04;

      if (!settled || dragging) {
        frame = requestAnimationFrame(render);
      } else {
        frame = null;
        lanyard.classList.remove("motion");
        lanyard.style.transform = "";
        if (badge) badge.style.transform = "";
      }
    };

    const wake = () => {
      lanyard.classList.add("motion");
      if (frame === null) frame = requestAnimationFrame(render);
    };

    badgeWrap.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      baseAngle = angle;
      lanyard.classList.add("dragging");
      if (badgeWrap.setPointerCapture && e.pointerId !== undefined) {
        try {
          badgeWrap.setPointerCapture(e.pointerId);
        } catch (err) {
          /* pointer capture is optional */
        }
      }
      wake();
    });

    badgeWrap.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - pointerStartX;
      const dy = Math.abs(e.clientY - pointerStartY);
      targetAngle = clamp(baseAngle + dx * 0.3 - dy * 0.02, -26, 26);
    });

    const release = () => {
      if (!dragging) return;
      dragging = false;
      targetAngle = 0;
      lanyard.classList.remove("dragging");
      wake();

      // If frames are throttled (background tab), still hand the card back to
      // its idle sway instead of leaving it stuck mid-drag.
      window.setTimeout(() => {
        if (dragging) return;
        lanyard.classList.remove("motion");
        lanyard.style.transform = "";
        if (badge) badge.style.transform = "";
      }, 1200);
    };

    badgeWrap.addEventListener("pointerup", release);
    badgeWrap.addEventListener("pointercancel", release);
    badgeWrap.addEventListener("lostpointercapture", release);
    badgeWrap.addEventListener("pointerleave", release);
    badgeWrap.addEventListener("dragstart", (e) => e.preventDefault());

    if (hero) {
      hero.addEventListener("pointermove", (e) => {
        if (dragging) return;
        const rect = hero.getBoundingClientRect();
        tiltTargetX = clamp(-((e.clientY - rect.top) / rect.height - 0.5) * 9, -9, 9);
        tiltTargetY = clamp(((e.clientX - rect.left) / rect.width - 0.5) * 12, -12, 12);
        wake();
      });

      hero.addEventListener("pointerleave", () => {
        tiltTargetX = 0;
        tiltTargetY = 0;
        wake();
      });
    }
  }

  /* ---------- Scroll-linked parallax ---------- */
  const glowA = document.querySelector(".glow-a");
  const glowB = document.querySelector(".glow-b");
  const heroCopy = document.querySelector(".hero-copy");

  if (glowA || glowB || heroCopy) {
    let target = window.scrollY;
    let current = window.scrollY;
    let frame = null;

    const renderScroll = () => {
      current += (target - current) * 0.12;

      if (glowA) glowA.style.transform = `translate3d(0, ${(current * 0.12).toFixed(1)}px, 0)`;
      if (glowB) glowB.style.transform = `translate3d(0, ${(-current * 0.08).toFixed(1)}px, 0)`;
      if (heroCopy) {
        heroCopy.style.transform = `translate3d(0, ${(current * 0.05).toFixed(1)}px, 0)`;
        heroCopy.style.opacity = String(Math.max(0.3, 1 - current / 900));
      }

      if (Math.abs(target - current) > 0.4) {
        frame = requestAnimationFrame(renderScroll);
      } else {
        frame = null;
      }
    };

    window.addEventListener(
      "scroll",
      () => {
        target = window.scrollY;
        if (frame === null) frame = requestAnimationFrame(renderScroll);
      },
      { passive: true }
    );
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (!form) return;

  const setError = (field, message) => {
    const wrapper = field.closest(".field");
    const errorEl = wrapper ? wrapper.querySelector(".error") : null;
    if (wrapper) wrapper.classList.toggle("invalid", Boolean(message));
    if (errorEl) errorEl.textContent = message || "";
    return !message;
  };

  const validate = (field) => {
    const value = field.value.trim();
    const name = field.name;

    if (!value) return setError(field, "This field is required.");
    if (name === "name" && value.length < 2) {
      return setError(field, "Please enter at least 2 characters.");
    }
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return setError(field, "Please enter a valid email address.");
    }
    if (name === "message" && value.length < 10) {
      return setError(field, "Please write at least 10 characters.");
    }
    return setError(field, "");
  };

  const fields = Array.from(form.querySelectorAll("input, textarea"));

  fields.forEach((field) => {
    field.addEventListener("blur", () => validate(field));
    field.addEventListener("input", () => {
      if (field.closest(".field")?.classList.contains("invalid")) validate(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = fields.map((field) => validate(field));
    const firstInvalid = fields[results.indexOf(false)];

    if (firstInvalid) {
      if (note) {
        note.textContent = "Please check the fields marked below.";
        note.classList.remove("ok");
      }
      firstInvalid.focus();
      return;
    }

    const nameField = form.elements.namedItem("name");
    const greeting = nameField ? nameField.value.trim() : "there";

    if (note) {
      note.textContent = `Thanks, ${greeting}! Your message is validated — or email revillabarry@gmail.com directly.`;
      note.classList.add("ok");
    }
    form.reset();
    fields.forEach((field) => setError(field, ""));
  });
});

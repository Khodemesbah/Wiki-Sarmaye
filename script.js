// ===== ویکی‌سرمایه — انیمیشن‌های تعاملی (vanilla JS) =====

// ۱) ظاهرشدن تدریجی عناصر هنگام اسکرول (مثل سایت اپل)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // هر عنصر فقط یک بار انیمیت می‌شود
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  // تاخیر پله‌ای کوچک برای حس موجی‌شدن ورود عناصر
  el.style.transitionDelay = ((i % 4) * 90) + "ms";
  observer.observe(el);
});

// ۲) سایه نوار بالا بعد از شروع اسکرول
const nav = document.getElementById("nav");
window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  },
  { passive: true }
);

// ۳) محو و جابجایی نرم هیرو هنگام اسکرول (پارالاکس سبک)
const hero = document.querySelector(".hero");
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.opacity = String(1 - y / (window.innerHeight * 0.9));
      hero.style.transform = "translateY(" + y * 0.15 + "px)";
    }
  },
  { passive: true }
);

// ۴) دارک مود به سبک اپل
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  // اگر کاربر انتخابی نکرده باشد، از حالت سیستم پیروی می‌کند
  root.setAttribute("data-theme", "dark");
}
document.getElementById("themeToggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next); // انتخاب کاربر ذخیره می‌شود
});

// ۵) منوی همبرگری — با قفل اسکرول مطمئن برای iOS
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
let scrollLockY = 0;
function lockScroll(lock) {
  if (lock) {
    scrollLockY = window.scrollY;
    document.body.classList.add("menu-open");
    document.body.style.top = -scrollLockY + "px";
  } else {
    document.body.classList.remove("menu-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollLockY); // بازگشت به همان نقطه قبل از بازشدن منو
  }
}
burger.addEventListener("click", () => {
  const isOpen = burger.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(isOpen));
  menu.classList.toggle("open");
  lockScroll(isOpen);
});
// با کلیک روی هر لینک، منو بسته می‌شود
menu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
    lockScroll(false);
  });
});

// ۶) هماهنگی رنگ نوار وضعیت iOS با تم
const metaTheme = document.getElementById("metaTheme");
function syncMetaTheme() {
  metaTheme.setAttribute(
    "content",
    root.getAttribute("data-theme") === "dark" ? "#000000" : "#ffffff"
  );
}
syncMetaTheme();
document.getElementById("themeToggle").addEventListener("click", syncMetaTheme);

// ۷) نوار پیشرفت مطالعه + دکمه بازگشت به بالا
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");
window.addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (window.scrollY / max) * 100 + "%";
    toTop.classList.toggle("show", window.scrollY > window.innerHeight);
  },
  { passive: true }
);
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ۸) هایلایت بخش فعال در منو
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        menu.querySelectorAll("a").forEach((a) => {
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
["methods", "compare", "advice"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

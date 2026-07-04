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

// ۵) منوی همبرگری
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  menu.classList.toggle("open");
});
// با کلیک روی هر لینک، منو بسته می‌شود
menu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    menu.classList.remove("open");
  });
});

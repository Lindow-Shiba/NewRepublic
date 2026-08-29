(function () {
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var intro = document.getElementById("intro");
  if (intro) {
    var seen = false;
    try { seen = sessionStorage.getItem("nri_intro_seen") === "1"; } catch (e) {}

    if (reduced || seen) {
      intro.style.display = "none";
    } else {
      document.body.style.overflow = "hidden";
      var lines = intro.querySelectorAll(".intro-log span");
      var titleEl2 = document.getElementById("intro-title");
      var barFill = document.getElementById("intro-bar-fill");
      var skipEl = document.getElementById("intro-skip");
      var dismissed = false;

      function dismiss() {
        if (dismissed) return;
        dismissed = true;
        try { sessionStorage.setItem("nri_intro_seen", "1"); } catch (e) {}
        intro.classList.add("hide");
        document.body.style.overflow = "";
        setTimeout(function () { intro.style.display = "none"; }, 550);
      }

      intro.addEventListener("click", dismiss);
      intro.addEventListener("keydown", dismiss);
      document.addEventListener("keydown", dismiss, { once: true });

      lines.forEach(function (line, i) {
        setTimeout(function () { line.classList.add("show"); }, 220 + i * 260);
      });

      setTimeout(function () { titleEl2.classList.add("show"); }, 220 + lines.length * 260 + 150);
      setTimeout(function () { barFill.style.width = "100%"; }, 220 + lines.length * 260 + 200);
      setTimeout(function () { skipEl.classList.add("show"); }, 220 + lines.length * 260 + 900);
      setTimeout(dismiss, 220 + lines.length * 260 + 2100);
    }
  }

  var titleEl = document.getElementById("boot-title");
  var statusEl = document.getElementById("boot-status");
  if (titleEl && !reduced) {
    var finalHTML = titleEl.innerHTML;
    var finalText = titleEl.textContent;
    var chars = "!<>-_\\/[]{}—=+*^?#________";
    var frame = 0;
    var totalFrames = 14;
    statusEl.textContent = "SYNCING";
    titleEl.setAttribute("aria-label", finalText);
    var interval = setInterval(function () {
      frame++;
      var progress = frame / totalFrames;
      var revealed = Math.floor(progress * finalText.length);
      var out = "";
      for (var i = 0; i < finalText.length; i++) {
        if (i < revealed || finalText[i] === " ") {
          out += finalText[i];
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      titleEl.textContent = out;
      if (frame >= totalFrames) {
        clearInterval(interval);
        titleEl.innerHTML = finalHTML;
        statusEl.textContent = "ONLINE";
      }
    }, 45);
  }
})();

document.getElementById('year').textContent = new Date().getFullYear();
      
      // Typewriter for subtitle p.subTitle (loops, slow and smooth) with caret
      (function initSubtitleTypewriter() {
        const el = document.querySelector('.subTitle');
        if (!el) return;
        const fullText = el.textContent.trim();
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return; // Respect reduced motion

        let idx = 0;
        let isErasing = false;
        const typeDelay = 90; // slower typing
        const eraseDelay = 60; // slower erasing
        const holdAfterType = 4000; // pause after full text
        const holdAfterErase = 600; // pause after clear

        function tick() {
          if (!isErasing) {
            if (idx <= fullText.length) {
              el.textContent = fullText.slice(0, idx);
              if (!el.classList.contains('typing-caret')) el.classList.add('typing-caret');
              idx += 1;
              setTimeout(tick, typeDelay);
            } else {
              setTimeout(() => { isErasing = true; tick(); }, holdAfterType);
            }
          } else {
            if (idx > 0) {
              idx -= 1;
              el.textContent = fullText.slice(0, idx);
              setTimeout(tick, eraseDelay);
            } else {
              isErasing = false;
              setTimeout(tick, holdAfterErase);
            }
          }
        }

        tick();
      })();

      // Typewriter for only the span.report content (loops) without changing other elements
      (function initReportTypewriter() {
        const reportEl = document.querySelector('span.report');
        if (!reportEl) return;
        const original = reportEl.textContent; // includes leading space in markup if any
        const trimmed = original;
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        let idx = 0;
        let isErasing = false;
        const typeDelay = 120; // slightly slower for emphasis
        const eraseDelay = 80;
        const holdAfterType = 6000;
        const holdAfterErase = 500;

        function tick() {
          if (!isErasing) {
            if (idx <= trimmed.length) {
              reportEl.textContent = trimmed.slice(0, idx);
              if (!reportEl.classList.contains('typing-caret')) reportEl.classList.add('typing-caret');
              idx += 1;
              setTimeout(tick, typeDelay);
            } else {
              setTimeout(() => { isErasing = true; tick(); }, holdAfterType);
            }
          } else {
            if (idx > 0) {
              idx -= 1;
              reportEl.textContent = trimmed.slice(0, idx);
              setTimeout(tick, eraseDelay);
            } else {
              isErasing = false;
              setTimeout(tick, holdAfterErase);
            }
          }
        }

        tick();
      })();

      // Percentage counter for .percent (or .parcent) from 0% to 75% (one-time, slow and smooth)
      (function initPercentCounterOnce() {
        const el = document.querySelector('.percent') || document.querySelector('.parcent');
        if (!el) return;
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) { el.textContent = '75%'; return; }
        
        const target = 75;
        const duration = 4000; // slow count-up
        let startTime = null;

        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

        function animate(ts) {
          if (!startTime) startTime = ts;
          const elapsed = ts - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(progress);
          const value = Math.round(eased * target);
          el.textContent = value + '%';
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target + '%';
          }
        }

        requestAnimationFrame(animate);
      })();

      // Draggable slider on .point: drag down maps 75% -> 0%, release stays at position
      (function initDraggablePoint() {
        const point = document.querySelector('.point');
        const percentEl = document.querySelector('.percent') || document.querySelector('.parcent');
        if (!point || !percentEl) return;

        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const maxPercent = 75;
        const maxDrag = 160; // px downward from original position
        let dragging = false;
        let startClientY = 0;
        let dragY = 0; // current displacement (persists after release)

        function setTransform(y) {
          const iy = Math.round(y);
          point.style.transform = `translate3d(0, ${iy}px, 0)`;
        }

        function updatePercentFromY(y) {
          const ratio = 1 - Math.min(Math.max(y / maxDrag, 0), 1);
          const value = Math.round(ratio * maxPercent);
          percentEl.textContent = value + '%';
        }

        function onPointerMove(clientY) {
          if (!dragging) return;
          const dy = clientY - startClientY;
          dragY = Math.max(0, Math.min(maxDrag, dy));
          setTransform(dragY);
          updatePercentFromY(dragY);
        }

        function onPointerUp() {
          if (!dragging) return;
          dragging = false;
          document.removeEventListener('mousemove', mouseMove);
          document.removeEventListener('mouseup', onPointerUp);
          document.removeEventListener('touchmove', touchMove, { passive: false });
          document.removeEventListener('touchend', onPointerUp);
          // stay at current dragY; percent already reflects it
          setTransform(dragY);
          updatePercentFromY(dragY);
        }

        function mouseMove(e) { onPointerMove(e.clientY); }
        function touchMove(e) {
          if (!dragging) return;
          if (e.cancelable) e.preventDefault();
          const t = e.touches[0];
          onPointerMove(t.clientY);
        }

        point.addEventListener('mousedown', (e) => {
          if (e.cancelable) e.preventDefault();
          dragging = true;
          startClientY = e.clientY - dragY; // preserve current offset if mid-anim
          document.addEventListener('mousemove', mouseMove);
          document.addEventListener('mouseup', onPointerUp);
        });

        point.addEventListener('touchstart', (e) => {
          const t = e.touches[0];
          dragging = true;
          startClientY = t.clientY - dragY;
          document.addEventListener('touchmove', touchMove, { passive: false });
          document.addEventListener('touchend', onPointerUp);
        }, { passive: true });

        // Ensure crisp rendering and no flicker
        point.style.willChange = 'transform';
        point.style.backfaceVisibility = 'hidden';
        point.style.transform = 'translate3d(0, 0, 0)';
      })();
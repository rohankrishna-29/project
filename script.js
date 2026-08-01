/* ==========================================================================
   GIRLFRIEND'S DAY — SCRIPT
   Every major section is commented so it's easy to find and edit later.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     0. LOADING SCREEN
     Holds for a deliberate ~2.2s minimum, then lifts like a curtain.
     ------------------------------------------------------------------ */
  const loadingScreen = document.getElementById('loading-screen');
  document.body.classList.add('is-locked');

  window.setTimeout(() => {
    loadingScreen.classList.add('is-hidden');
    document.body.classList.remove('is-locked');
    // The very first beat gets a manual, slightly delayed reveal so the
    // opening line ("Hi.") lands like a held breath, not an instant cut.
    const firstBeat = document.querySelector('#ch1-beats .beat');
    window.setTimeout(() => firstBeat && firstBeat.classList.add('is-visible'), 300);
    window.setTimeout(() => {
      loadingScreen.remove();
    }, 900);
  }, 2200);


  /* ------------------------------------------------------------------
     1. STAR FIELD
     Generates a fixed layer of gently twinkling stars.
     ------------------------------------------------------------------ */
  const starField = document.getElementById('star-field');
  const STAR_COUNT = 70;

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.opacity = (0.2 + Math.random() * 0.6).toFixed(2);
    star.style.animationDelay = `${(Math.random() * 3.5).toFixed(2)}s`;
    star.style.animationDuration = `${(2.5 + Math.random() * 3).toFixed(2)}s`;
    starField.appendChild(star);
  }


  /* ------------------------------------------------------------------
     2. BEAT REVEALS — the heart of the pacing.
     Every ".beat" (a single thought — a line, a photo, a title) fades
     in the moment it scrolls into view, and stays. This is what makes
     scrolling itself feel like it's revealing the next line of a scene,
     rather than everything appearing on a timer regardless of where
     the reader actually is on the page.
     ------------------------------------------------------------------ */
  const beatObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        beatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.beat').forEach((beat) => beatObserver.observe(beat));


  /* ------------------------------------------------------------------
     3. CHAPTER 1 — "LET'S FLY" BUTTON
     ------------------------------------------------------------------ */
  const flyBtn = document.getElementById('fly-btn');
  flyBtn.addEventListener('click', () => {
    document.getElementById('chapter-2').scrollIntoView({ behavior: 'smooth' });
  });


  /* ------------------------------------------------------------------
     4. CHAPTER 5 — MEMORY CARDS (from data/memories.json)
     ------------------------------------------------------------------ */
  const cardGrid = document.getElementById('card-grid');

  fetch('data/memories.json')
    .then((res) => res.json())
    .then((memories) => {
      memories.forEach((mem, i) => {
        const card = document.createElement('div');
        card.className = 'mem-card';
        card.tabIndex = 0;
        card.style.transitionDelay = `${i * 100}ms`;
        card.innerHTML = `
          <p class="mem-card-title">${mem.title}</p>
          <p class="mem-card-body">${mem.body}</p>
        `;
        const toggle = () => card.classList.toggle('is-open');
        card.addEventListener('click', toggle);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        });
        cardGrid.appendChild(card);
      });

      // Fade the cards in once the grid itself is visible
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cardGrid.querySelectorAll('.mem-card').forEach((c) => c.classList.add('is-visible'));
            cardObserver.disconnect();
          }
        });
      }, { threshold: 0.2 });
      cardObserver.observe(cardGrid);
    })
    .catch(() => {
      cardGrid.innerHTML = '<p style="opacity:0.5">Add cards in data/memories.json</p>';
    });


  /* ------------------------------------------------------------------
     5. CHAPTER 5 — TINY QUIZ (from data/quiz.json)
     One question shown at a time, no scoring, just for fun.
     ------------------------------------------------------------------ */
  const quizContainer = document.getElementById('quiz-question');
  let quizData = [];
  let quizIndex = 0;

  fetch('data/quiz.json')
    .then((res) => res.json())
    .then((data) => {
      quizData = data;
      if (quizData.length) renderQuizQuestion();
    })
    .catch(() => {
      quizContainer.innerHTML = '<p style="opacity:0.5">Add questions in data/quiz.json</p>';
    });

  function renderQuizQuestion() {
    const q = quizData[quizIndex];
    quizContainer.innerHTML = `
      <p class="quiz-question-text">${q.question}</p>
      <div class="quiz-options"></div>
      <p class="quiz-response"></p>
      <div class="quiz-nav"></div>
    `;

    const optionsWrap = quizContainer.querySelector('.quiz-options');
    const responseEl = quizContainer.querySelector('.quiz-response');
    const navWrap = quizContainer.querySelector('.quiz-nav');

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        const correct = i === q.correctIndex;
        optionsWrap.querySelectorAll('.quiz-option').forEach((b) => b.disabled = true);
        btn.classList.add(correct ? 'is-correct' : 'is-wrong');
        responseEl.textContent = correct ? q.correctResponse : q.wrongResponse;

        if (quizIndex < quizData.length - 1) {
          const nextBtn = document.createElement('button');
          nextBtn.textContent = 'next →';
          nextBtn.addEventListener('click', () => {
            quizIndex++;
            renderQuizQuestion();
          });
          navWrap.appendChild(nextBtn);
        }
      });
      optionsWrap.appendChild(btn);
    });
  }


  /* ------------------------------------------------------------------
     6. CHAPTER 6 — LETTER (loaded from data/letter.txt)
     Click the seal to unfold the letter, then it types itself out.
     ------------------------------------------------------------------ */
  const letterSeal = document.getElementById('letter-seal');
  const letterPaper = document.getElementById('letter-paper');
  const letterTextEl = document.getElementById('letter-text');
  const letterSkipBtn = document.getElementById('letter-skip');

  let letterContent = '';
  let letterOpened = false;
  let typingComplete = false;
  let typingTimeouts = [];

  fetch('data/letter.txt')
    .then((res) => res.text())
    .then((text) => { letterContent = text.trim(); })
    .catch(() => {
      letterContent = "Couldn't load the letter — check that data/letter.txt exists.";
    });

  function openLetter() {
    if (letterOpened) return;
    letterOpened = true;
    letterSeal.classList.add('is-hidden');
    letterPaper.classList.add('is-open');
    typeLetter();
  }

  function typeLetter() {
    let i = 0;
    const chars = letterContent.split('');

    // Skip button appears after 2s in case she doesn't want to wait
    const skipTimer = window.setTimeout(() => {
      if (!typingComplete) letterSkipBtn.hidden = false;
    }, 2000);
    typingTimeouts.push(skipTimer);

    function typeNext() {
      if (i >= chars.length) {
        typingComplete = true;
        letterSkipBtn.hidden = true;
        return;
      }
      letterTextEl.textContent += chars[i];
      let delay = 30 + Math.random() * 25;
      if (['.', ',', '\n'].includes(chars[i])) delay += 220;
      i++;
      const t = window.setTimeout(typeNext, delay);
      typingTimeouts.push(t);
    }
    typeNext();
  }

  function finishLetterInstantly() {
    typingTimeouts.forEach((t) => window.clearTimeout(t));
    typingTimeouts = [];
    letterTextEl.textContent = letterContent;
    typingComplete = true;
    letterSkipBtn.hidden = true;
  }

  letterSeal.addEventListener('click', openLetter);
  letterSeal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLetter();
    }
  });
  letterSeal.tabIndex = 0;
  letterSkipBtn.addEventListener('click', finishLetterInstantly);


  /* ------------------------------------------------------------------
     7. CHAPTER 7 — FINAL CURTAIN
     Once the very last beat (the closing PS line) has scrolled into
     view and had a moment to sit, the whole screen quietly fades to
     black. No button, nothing pulling the reader further — it just ends.
     ------------------------------------------------------------------ */
  const curtain = document.getElementById('curtain');
  const ch7Beats = document.querySelectorAll('#ch7-beats .beat');
  const lastBeat = ch7Beats[ch7Beats.length - 1];

  if (lastBeat) {
    const endObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => curtain.classList.add('is-visible'), 3200);
          endObserver.disconnect();
        }
      });
    }, { threshold: 0.6 });
    endObserver.observe(lastBeat);
  }

});

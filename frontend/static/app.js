document.addEventListener('DOMContentLoaded', function () {
  const dateButtons = document.querySelectorAll('.date-btn');
  const timeButtons = document.querySelectorAll('.time-btn');

  // Select first date by default
  if (dateButtons.length) {
    dateButtons[0].classList.add('active');
    const selected = dateButtons[0].dataset.iso;
    document.body.dataset.selectedDate = selected;
  }

  dateButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      dateButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const iso = btn.dataset.iso;
      document.body.dataset.selectedDate = iso;
    });
  });

  // Click on a time to "réserver" (demo)
  timeButtons.forEach((t) => {
    t.addEventListener('click', (e) => {
      const movieId = t.dataset.movieId;
      const time = t.dataset.time;
      const date = document.body.dataset.selectedDate || '';
      alert(`Réserver : film #${movieId} — ${date} à ${time}`);
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const dateButtons = Array.from(document.querySelectorAll('.date-btn'));
  const timeButtons = Array.from(document.querySelectorAll('.time-btn'));
  const modal = document.getElementById('booking-modal');
  const modalClose = modal.querySelector('.modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const bkFilm = document.getElementById('bk-film');
  const bkDate = document.getElementById('bk-date');
  const bkTime = document.getElementById('bk-time');
  const bookingForm = document.getElementById('booking-form');

  function setActiveDate(btn) {
    dateButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.dataset.selectedDate = btn.dataset.iso;
  }

  // Select first date by default
  if (dateButtons.length) {
    setActiveDate(dateButtons[0]);
  }

  dateButtons.forEach((btn) => {
    btn.addEventListener('click', () => setActiveDate(btn));
  });

  function openModal(title, date, time) {
    bkFilm.value = title;
    bkDate.value = date;
    bkTime.value = time;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
  }

  timeButtons.forEach((t) => {
    t.addEventListener('click', (e) => {
      const title = t.dataset.title || '';
      const time = t.dataset.time || '';
      const date = document.body.dataset.selectedDate || '';
      openModal(title, date, time);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);

  bookingForm.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const name = document.getElementById('bk-name').value || 'Anonyme';
    const count = document.getElementById('bk-count').value || '1';
    alert(`Réservation confirmée\nFilm: ${bkFilm.value}\nDate: ${bkDate.value}\nSéance: ${bkTime.value}\nNom: ${name}\nPlaces: ${count}`);
    closeModal();
  });
});

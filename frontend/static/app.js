// ========================================
// CINEMA BOOKING APPLICATION
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // ========================================
    // DOM Elements
    // ========================================
    const dateButtons = Array.from(document.querySelectorAll('.date-btn'));
    const timeButtons = Array.from(document.querySelectorAll('.time-btn'));
    const modal = document.getElementById('booking-modal');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const modalClose = modal.querySelector('.modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const bkFilm = document.getElementById('bk-film');
    const bkDate = document.getElementById('bk-date');
    const bkTime = document.getElementById('bk-time');
    const bookingForm = document.getElementById('booking-form');
    const searchInput = document.getElementById('search');
    const movieCards = document.querySelectorAll('.movie-card');

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    let selectedDate = null;
    let reservations = [];

    // Load reservations from localStorage
    function loadReservations() {
        const stored = localStorage.getItem('cinemaReservations');
        if (stored) {
            reservations = JSON.parse(stored);
        }
    }

    // Save reservations to localStorage
    function saveReservations() {
        localStorage.setItem('cinemaReservations', JSON.stringify(reservations));
    }

    // ========================================
    // DATE SELECTION
    // ========================================
    function setActiveDate(btn) {
        dateButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDate = btn.dataset.iso;
        document.body.dataset.selectedDate = selectedDate;
    }

    // Select first date by default
    if (dateButtons.length) {
        setActiveDate(dateButtons[0]);
    }

    dateButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            setActiveDate(btn);
            // Add ripple effect
            addRippleEffect(btn, event);
        });
    });

    // ========================================
    // MODAL MANAGEMENT
    // ========================================
    function openModal(title, date, time) {
        bkFilm.value = title;
        bkDate.value = formatDateForDisplay(date);
        bkTime.value = time;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        bookingForm.reset();
    }

    // ========================================
    // TIME BUTTON HANDLING
    // ========================================
    timeButtons.forEach((t) => {
        t.addEventListener('click', (event) => {
            const title = t.dataset.title || '';
            const time = t.dataset.time || '';
            const date = document.body.dataset.selectedDate || '';
            openModal(title, date, time);
            addRippleEffect(t, event);
        });
    });

    // ========================================
    // MODAL CONTROLS
    // ========================================
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // ========================================
    // BOOKING FORM SUBMISSION
    // ========================================
    bookingForm.addEventListener('submit', function (ev) {
        ev.preventDefault();

        const name = document.getElementById('bk-name').value || 'Anonyme';
        const count = document.getElementById('bk-count').value || '1';
        const film = bkFilm.value;
        const date = bkDate.value;
        const time = bkTime.value;

        // Create reservation object
        const reservation = {
            id: Date.now(),
            film: film,
            date: date,
            time: time,
            name: name,
            seats: count,
            totalPrice: calculatePrice(count),
            bookingDate: new Date().toLocaleString('fr-FR')
        };

        // Save reservation
        reservations.push(reservation);
        saveReservations();

        // Show success message
        showSuccessNotification(name, film, date, time, count);

        closeModal();
    });

    // ========================================
    // PRICE CALCULATION
    // ========================================
    function calculatePrice(seats) {
        // This would ideally come from the server
        const pricePerSeat = 9.0; // Default adult price
        return (pricePerSeat * seats).toFixed(2);
    }

    // ========================================
    // NOTIFICATIONS
    // ========================================
    function showSuccessNotification(name, film, date, time, seats) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <div class="notification-text">
                    <strong>Réservation confirmée !</strong>
                    <p>${name} • ${film} • ${date} à ${time} • ${seats} place(s)</p>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        // Add styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #2ecc71;
                    color: white;
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    z-index: 300;
                    animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 3.7s forwards;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-icon {
                    font-size: 20px;
                    font-weight: bold;
                }
                .notification-text {
                    font-size: 14px;
                }
                .notification-text strong {
                    display: block;
                    margin-bottom: 4px;
                }
                .notification-text p {
                    margin: 0;
                    opacity: 0.9;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                @media (max-width: 768px) {
                    .notification {
                        bottom: 10px;
                        right: 10px;
                        left: 10px;
                        margin: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove notification after animation
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();

            movieCards.forEach((card) => {
                const title = card.dataset.title.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = '';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Add fade-in animation
        if (!document.getElementById('search-styles')) {
            const style = document.createElement('style');
            style.id = 'search-styles';
            style.textContent = `
                .fade-in {
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ========================================
    // RIPPLE EFFECT
    // ========================================
    function addRippleEffect(element, clickEvent) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = clickEvent.clientX - rect.left - size / 2;
        const y = clickEvent.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Add ripple styles if not present
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Make element position relative if not already
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    function formatDateForDisplay(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    // ========================================
    // PAGE LOAD ANIMATIONS
    // ========================================
    function animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.movie-card, .price-card').forEach((el) => {
            observer.observe(el);
        });
    }

    // Initialize scroll animations
    animateOnScroll();

    // ========================================
    // ACCESSIBILITY IMPROVEMENTS
    // ========================================

    // Add keyboard navigation for time buttons
    timeButtons.forEach((btn) => {
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // Load reservations on page load
    loadReservations();

    // ========================================
    // APPLY GRADIENT BACKGROUNDS TO POSTERS
    // ========================================
    document.querySelectorAll('.movie-card').forEach((card) => {
        const color = card.dataset.color;
        const poster = card.querySelector('.movie-poster');
        if (color && poster) {
            poster.style.background = color;
        }
    });

    // ========================================
    // CONSOLE MESSAGE
    // ========================================
    console.log('CinéMax Booking System - Ready! 🎬');
});

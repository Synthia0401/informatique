// ========================================
// CINEMA BOOKING APPLICATION
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // ========================================
    // DOM Elements - Booking
    // ========================================
    const timeButtons = Array.from(document.querySelectorAll('.time-btn'));

    // Calendar elements
    const quickBtns = document.querySelectorAll('.quick-btn');
    const calendarTriggerBtn = document.getElementById('calendar-trigger-btn');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const calendarModal = document.getElementById('calendar-modal');
    const calendarModalBackdrop = document.querySelector('.calendar-modal-backdrop');
    const calendarMonthSelect = document.getElementById('calendar-month');
    const calendarYearSelect = document.getElementById('calendar-year');
    const calendarPrevBtn = document.getElementById('calendar-prev-month');
    const calendarNextBtn = document.getElementById('calendar-next-month');
    const calendarDaysContainer = document.getElementById('calendar-days-container');
    const modal = document.getElementById('booking-modal');
    const modalBackdrop = document.querySelector('#booking-modal .modal-backdrop');
    const modalClose = modal.querySelector('.modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const bkFilm = document.getElementById('bk-film');
    const bkDate = document.getElementById('bk-date');
    const bkTime = document.getElementById('bk-time');
    const bookingForm = document.getElementById('booking-form');
    const searchInput = document.getElementById('search');
    const movieCards = document.querySelectorAll('.movie-card');

    // ========================================
    // DOM Elements - Authentication
    // ========================================
    const accountBtn = document.getElementById('account-btn');
    const accountMenu = document.getElementById('account-menu');
    const accountLoggedIn = document.getElementById('account-logged-in');
    const accountLoggedOut = document.getElementById('account-logged-out');
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    const loginFormSection = document.getElementById('login-form-section');
    const registerFormSection = document.getElementById('register-form-section');
    const logoutBtn = document.getElementById('logout-btn');
    const myBookingsBtn = document.getElementById('my-bookings-btn');
    const bookingsModal = document.getElementById('bookings-modal');
    const bookingsList = document.getElementById('bookings-list');

    let currentUser = null;
    let pendingBooking = null;

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
    // AUTHENTICATION MANAGEMENT
    // ========================================

    async function checkUserStatus() {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();

            if (data.success && data.user) {
                currentUser = data.user;
                updateUIForLoggedIn();
            } else {
                currentUser = null;
                updateUIForLoggedOut();
            }
        } catch (error) {
            console.error('Error checking user status:', error);
        }
    }

    function updateUIForLoggedIn() {
        accountLoggedOut.classList.add('hidden');
        accountLoggedIn.classList.remove('hidden');
        document.getElementById('account-user-name').textContent = `${currentUser.prenom} ${currentUser.nom}`;
        document.getElementById('account-user-email').textContent = currentUser.email;
    }

    function updateUIForLoggedOut() {
        accountLoggedIn.classList.add('hidden');
        accountLoggedOut.classList.remove('hidden');
    }

    function openAuthModal() {
        authModal.classList.remove('hidden');
        authModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeAuthModal() {
        authModal.classList.add('hidden');
        authModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        loginForm.reset();
        registerForm.reset();
    }

    function showLoginForm() {
        loginFormSection.classList.remove('hidden');
        registerFormSection.classList.add('hidden');
        loginTabBtn.classList.add('active');
        registerTabBtn.classList.remove('active');
    }

    function showRegisterForm() {
        loginFormSection.classList.add('hidden');
        registerFormSection.classList.remove('hidden');
        loginTabBtn.classList.remove('active');
        registerTabBtn.classList.add('active');
    }

    // Account button toggle
    accountBtn.addEventListener('click', () => {
        accountMenu.classList.toggle('hidden');
    });

    // Close account menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!accountBtn.contains(e.target) && !accountMenu.contains(e.target)) {
            accountMenu.classList.add('hidden');
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                currentUser = data.user;
                updateUIForLoggedIn();
                closeAuthModal();
                accountMenu.classList.add('hidden');
                showSuccessNotification(`Bienvenue au CinéMax, ${currentUser.prenom}!`);
            } else {
                errorEl.textContent = data.error;
                errorEl.classList.remove('hidden');
            }
        } catch (error) {
            errorEl.textContent = 'Erreur de connexion';
            errorEl.classList.remove('hidden');
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const nom = document.getElementById('register-nom').value;
        const prenom = document.getElementById('register-prenom').value;
        const sexe = document.getElementById('register-sexe').value;
        const ville = document.getElementById('register-ville').value;
        const habitation = document.getElementById('register-habitation').value;
        const errorEl = document.getElementById('register-error');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, nom, prenom, sexe, ville, habitation })
            });

            const data = await response.json();

            if (data.success) {
                currentUser = data.user;
                updateUIForLoggedIn();
                closeAuthModal();
                accountMenu.classList.add('hidden');
                showSuccessNotification(`Bienvenue au CinéMax, ${currentUser.prenom}!`);
            } else {
                errorEl.textContent = data.error;
                errorEl.classList.remove('hidden');
            }
        } catch (error) {
            errorEl.textContent = 'Erreur lors de la création du compte';
            errorEl.classList.remove('hidden');
        }
    });

    // Tab switching
    loginTabBtn.addEventListener('click', () => {
        showLoginForm();
        openAuthModal();
        accountMenu.classList.add('hidden');
    });
    registerTabBtn.addEventListener('click', () => {
        showRegisterForm();
        openAuthModal();
        accountMenu.classList.add('hidden');
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            currentUser = null;
            updateUIForLoggedOut();
            accountMenu.classList.add('hidden');
            showSuccessNotification('Déconnecté');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });

    // My Bookings
    myBookingsBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/my-bookings');
            const data = await response.json();

            bookingsList.innerHTML = '';

            if (data.bookings && data.bookings.length > 0) {
                data.bookings.forEach((booking) => {
                    const bookingEl = document.createElement('div');
                    bookingEl.className = 'booking-item';
                    bookingEl.innerHTML = `
                        <h4>${booking.film_title}</h4>
                        <p><strong>Date:</strong> ${booking.film_date}</p>
                        <p><strong>Heure:</strong> ${booking.film_time}</p>
                        <p><strong>Places:</strong> ${booking.seats}</p>
                        <p class="booking-price">Total: ${booking.total_price}€</p>
                    `;
                    bookingsList.appendChild(bookingEl);
                });
            } else {
                bookingsList.innerHTML = '<p>Aucune réservation pour le moment.</p>';
            }

            bookingsModal.classList.remove('hidden');
            bookingsModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    });

    // ========================================
    // DATE SELECTION - CALENDAR MODAL
    // ========================================

    function openCalendarModal() {
        calendarModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeCalendarModal() {
        calendarModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function updateSelectedDateDisplay() {
        if (selectedDate) {
            const dateObj = new Date(selectedDate);
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            selectedDateDisplay.textContent = dateObj.toLocaleDateString('fr-FR', options);
        }
    }

    // Calendar trigger button
    calendarTriggerBtn.addEventListener('click', openCalendarModal);

    // Close calendar modal on backdrop click
    calendarModalBackdrop.addEventListener('click', closeCalendarModal);

    // ========================================
    // DATE SELECTION - CALENDAR
    // ========================================
    let currentDisplayMonth = new Date().getMonth();
    let currentDisplayYear = new Date().getFullYear();

    function initializeYearSelect() {
        const today = new Date();
        for (let year = today.getFullYear(); year <= today.getFullYear() + 1; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === today.getFullYear()) option.selected = true;
            calendarYearSelect.appendChild(option);
        }
    }

    function renderCalendar() {
        const firstDay = new Date(currentDisplayYear, currentDisplayMonth, 1);
        const lastDay = new Date(currentDisplayYear, currentDisplayMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday = 0

        calendarDaysContainer.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Previous month's days
        const prevMonthLastDay = new Date(currentDisplayYear, currentDisplayMonth, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayBtn = document.createElement('button');
            dayBtn.className = 'calendar-day other-month';
            dayBtn.textContent = prevMonthLastDay - i;
            dayBtn.disabled = true;
            calendarDaysContainer.appendChild(dayBtn);
        }

        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayBtn = document.createElement('button');
            dayBtn.className = 'calendar-day';
            dayBtn.textContent = day;
            dayBtn.type = 'button';

            const currentDate = new Date(currentDisplayYear, currentDisplayMonth, day);
            currentDate.setHours(0, 0, 0, 0);

            // Mark today
            if (currentDate.getTime() === today.getTime()) {
                dayBtn.classList.add('today');
            }

            // Mark selected date
            if (currentDate.toISOString().split('T')[0] === selectedDate) {
                dayBtn.classList.add('active');
            }

            // Disable past dates
            if (currentDate < today) {
                dayBtn.disabled = true;
                dayBtn.classList.add('other-month');
            }

            dayBtn.addEventListener('click', () => {
                const iso = currentDate.toISOString().split('T')[0];
                setSelectedDate(iso);
                updateSelectedDateDisplay();
                renderCalendar();
                updateQuickBtns();
                closeCalendarModal();
            });

            calendarDaysContainer.appendChild(dayBtn);
        }

        // Next month's days
        const totalCells = calendarDaysContainer.children.length;
        const remainingCells = 42 - totalCells; // 6 weeks * 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const dayBtn = document.createElement('button');
            dayBtn.className = 'calendar-day other-month';
            dayBtn.textContent = day;
            dayBtn.disabled = true;
            calendarDaysContainer.appendChild(dayBtn);
        }
    }

    function setSelectedDate(iso) {
        selectedDate = iso;
        document.body.dataset.selectedDate = selectedDate;
    }

    function updateQuickBtns() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const selectedDateObj = new Date(selectedDate);

        quickBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.days === '0' && selectedDateObj.getTime() === today.getTime()) {
                btn.classList.add('active');
            } else if (btn.dataset.days === '1' && selectedDateObj.getTime() === tomorrow.getTime()) {
                btn.classList.add('active');
            }
        });
    }

    // Quick button handlers
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const daysOffset = parseInt(btn.dataset.days);
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + daysOffset);
            newDate.setHours(0, 0, 0, 0);

            currentDisplayMonth = newDate.getMonth();
            currentDisplayYear = newDate.getFullYear();

            calendarMonthSelect.value = currentDisplayMonth;
            calendarYearSelect.value = currentDisplayYear;

            const iso = newDate.toISOString().split('T')[0];
            setSelectedDate(iso);
            updateSelectedDateDisplay();
            renderCalendar();
            updateQuickBtns();
            closeCalendarModal();
        });
    });

    // Calendar navigation
    calendarMonthSelect.addEventListener('change', (e) => {
        currentDisplayMonth = parseInt(e.target.value);
        renderCalendar();
        updateQuickBtns();
    });

    calendarYearSelect.addEventListener('change', (e) => {
        currentDisplayYear = parseInt(e.target.value);
        renderCalendar();
        updateQuickBtns();
    });

    calendarPrevBtn.addEventListener('click', () => {
        currentDisplayMonth--;
        if (currentDisplayMonth < 0) {
            currentDisplayMonth = 11;
            currentDisplayYear--;
        }
        calendarMonthSelect.value = currentDisplayMonth;
        calendarYearSelect.value = currentDisplayYear;
        renderCalendar();
        updateQuickBtns();
    });

    calendarNextBtn.addEventListener('click', () => {
        currentDisplayMonth++;
        if (currentDisplayMonth > 11) {
            currentDisplayMonth = 0;
            currentDisplayYear++;
        }
        calendarMonthSelect.value = currentDisplayMonth;
        calendarYearSelect.value = currentDisplayYear;
        renderCalendar();
        updateQuickBtns();
    });

    // Initialize
    initializeYearSelect();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today.toISOString().split('T')[0]);
    updateSelectedDateDisplay();
    renderCalendar();
    updateQuickBtns();

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
            if (!currentUser) {
                openAuthModal();
                return;
            }
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

    // Close auth modal
    const authModalClose = authModal.querySelector('.modal-close');
    authModalClose.addEventListener('click', closeAuthModal);
    authModal.querySelector('.modal-backdrop').addEventListener('click', closeAuthModal);

    // Close bookings modal
    const bookingsModalClose = bookingsModal.querySelector('.modal-close');
    bookingsModalClose.addEventListener('click', () => {
        bookingsModal.classList.add('hidden');
        bookingsModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    });
    bookingsModal.querySelector('.modal-backdrop').addEventListener('click', () => {
        bookingsModal.classList.add('hidden');
        bookingsModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!calendarModal.classList.contains('hidden')) {
                closeCalendarModal();
            }
            if (!modal.classList.contains('hidden')) {
                closeModal();
            }
            if (!authModal.classList.contains('hidden')) {
                closeAuthModal();
            }
            if (!bookingsModal.classList.contains('hidden')) {
                bookingsModal.classList.add('hidden');
                bookingsModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // ========================================
    // BOOKING FORM SUBMISSION
    // ========================================
    bookingForm.addEventListener('submit', async function (ev) {
        ev.preventDefault();

        if (!currentUser) {
            openAuthModal();
            closeModal();
            return;
        }

        const count = document.getElementById('bk-count').value || '1';
        const film = bkFilm.value;
        const date = bkDate.value;
        const time = bkTime.value;

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    film_title: film,
                    film_date: date,
                    film_time: time,
                    seats: count
                })
            });

            const data = await response.json();

            if (data.success) {
                showSuccessNotification(`${currentUser.prenom}`, film, date, time, count);
                closeModal();
            } else {
                alert('Erreur: ' + data.error);
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Erreur lors de la réservation');
        }
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
                    background: linear-gradient(135deg, #ff8c42 0%, #ffb347 100%);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(255, 140, 66, 0.5);
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

    // Check user authentication status on page load
    checkUserStatus();

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

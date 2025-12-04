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
    const bkDateBtn = document.getElementById('bk-date-btn');
    const bkDateDisplay = document.getElementById('bk-date-display');
    const bkTime = document.getElementById('bk-time');
    const bookingForm = document.getElementById('booking-form');
    const searchInput = document.getElementById('search');
    const movieCards = document.querySelectorAll('.movie-card');

    // Booking Calendar Elements
    const bookingCalendarModal = document.getElementById('booking-calendar-modal');
    const bookingCalendarBackdrop = bookingCalendarModal.querySelector('.calendar-modal-backdrop');
    const bkCalendarMonthSelect = document.getElementById('bk-calendar-month');
    const bkCalendarYearSelect = document.getElementById('bk-calendar-year');
    const bkCalendarPrevBtn = document.getElementById('bk-calendar-prev-month');
    const bkCalendarNextBtn = document.getElementById('bk-calendar-next-month');
    const bkCalendarDaysContainer = document.getElementById('bk-calendar-days-container');

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
    let bkCurrentDisplayMonth = new Date().getMonth();
    let bkCurrentDisplayYear = new Date().getFullYear();
    let bkSelectedDate = null;

    // Movie showtimes data - Extracted from backend
    const movieShowtimes = {
        "Inside Out 2": ["14:00", "17:30", "20:45"],
        "Moana 2": ["13:15", "16:00", "19:00"],
        "Despicable Me 4": ["15:00", "18:30", "22:00"],
        "Deadpool & Wolverine": ["12:45", "15:30", "20:15"],
        "Dune: Part Two": ["16:00", "19:45", "23:00"],
        "Wicked": ["11:30", "14:30", "18:00"],
        "Twisters": ["13:00", "17:00", "21:00"],
        "Furiosa: A Mad Max Saga": ["12:00", "15:00", "18:30"],
        "Godzilla x Kong: The New Empire": ["17:15", "20:30"],
        "Kung Fu Panda 4": ["10:45", "14:15", "19:30"]
    };

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

    // ========================================
    // VALIDATION FUNCTIONS
    // ========================================

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasMinLength = password.length >= 8;

        if (!hasMinLength) {
            return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
        }
        if (!hasUpperCase) {
            return { valid: false, message: 'Le mot de passe doit contenir au moins une majuscule' };
        }
        if (!hasDigit) {
            return { valid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
        }
        return { valid: true, message: '' };
    }

    function validateRegisterForm(email, password, nom, prenom, sexe, ville, habitation) {
        if (!email || !email.trim()) {
            return { valid: false, message: 'L\'email est requis' };
        }
        if (!validateEmail(email)) {
            return { valid: false, message: 'L\'email n\'est pas valide' };
        }
        if (!password || !password.trim()) {
            return { valid: false, message: 'Le mot de passe est requis' };
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return passwordValidation;
        }
        if (!nom || !nom.trim()) {
            return { valid: false, message: 'Le nom est requis' };
        }
        if (!prenom || !prenom.trim()) {
            return { valid: false, message: 'Le prénom est requis' };
        }
        if (!sexe || !sexe.trim()) {
            return { valid: false, message: 'Le sexe est requis' };
        }
        if (!ville || !ville.trim()) {
            return { valid: false, message: 'La ville est requise' };
        }
        if (!habitation || !habitation.trim()) {
            return { valid: false, message: 'L\'habitation est requise' };
        }
        return { valid: true, message: '' };
    }

    function validateLoginForm(email, password) {
        if (!email || !email.trim()) {
            return { valid: false, message: 'L\'email est requis' };
        }
        if (!validateEmail(email)) {
            return { valid: false, message: 'L\'email n\'est pas valide' };
        }
        if (!password || !password.trim()) {
            return { valid: false, message: 'Le mot de passe est requis' };
        }
        return { valid: true, message: '' };
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
        showLoginForm(); // Reset to login tab
    }

    function showLoginForm() {
        loginFormSection.classList.remove('hidden');
        registerFormSection.classList.add('hidden');
    }

    function showRegisterForm() {
        loginFormSection.classList.add('hidden');
        registerFormSection.classList.remove('hidden');
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

        // Validate form
        const validation = validateLoginForm(email, password);
        if (!validation.valid) {
            errorEl.textContent = validation.message;
            errorEl.classList.remove('hidden');
            return;
        }

        // Clear previous errors
        errorEl.classList.add('hidden');

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

        // Validate form
        const validation = validateRegisterForm(email, password, nom, prenom, sexe, ville, habitation);
        if (!validation.valid) {
            errorEl.textContent = validation.message;
            errorEl.classList.remove('hidden');
            return;
        }

        // Clear previous errors
        errorEl.classList.add('hidden');

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

    // Auth mode switching - from login to register
    const switchToRegisterBtn = document.getElementById('switch-to-register');
    if (switchToRegisterBtn) {
        switchToRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });
    }

    // Auth mode switching - from register to login
    const switchToLoginBtn = document.getElementById('switch-to-login');
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }

    // Login button from menu
    const loginBtnMenu = document.getElementById('login-btn-menu');
    if (loginBtnMenu) {
        loginBtnMenu.addEventListener('click', () => {
            showLoginForm();
            openAuthModal();
            accountMenu.classList.add('hidden');
        });
    }

    // Logout
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await fetch('/api/logout', { method: 'POST' });
            currentUser = null;
            updateUIForLoggedOut();
            accountMenu.classList.add('hidden');
            showSuccessNotification('Déconnecté');
            // Force update the UI
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('Error logging out:', error);
            showSuccessNotification('Erreur lors de la déconnexion');
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
                        <div class="booking-header">
                            <h4>${booking.film_title}</h4>
                            <div class="booking-actions">
                                <button class="booking-btn edit-btn" data-booking-id="${booking.id}" title="Modifier">✏️</button>
                                <button class="booking-btn delete-btn" data-booking-id="${booking.id}" title="Supprimer">🗑️</button>
                            </div>
                        </div>
                        <p><strong>Date:</strong> ${booking.film_date}</p>
                        <p><strong>Heure:</strong> ${booking.film_time}</p>
                        <p><strong>Places:</strong> ${booking.seats}</p>
                        <p class="booking-price">Total: ${booking.total_price}€</p>
                    `;

                    // Add event listeners for edit and delete buttons
                    const editBtn = bookingEl.querySelector('.edit-btn');
                    const deleteBtn = bookingEl.querySelector('.delete-btn');

                    editBtn.addEventListener('click', () => {
                        editBooking(booking);
                    });

                    deleteBtn.addEventListener('click', () => {
                        deleteBooking(booking.id, bookingEl);
                    });

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
    // BOOKING MANAGEMENT - EDIT & DELETE
    // ========================================

    function populateShowtimes(filmTitle) {
        // Clear existing options except the first one
        while (bkTime.options.length > 1) {
            bkTime.remove(1);
        }

        // Get showtimes for the selected film
        const showtimes = movieShowtimes[filmTitle] || [];

        // Add showtimes as options
        showtimes.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            bkTime.appendChild(option);
        });
    }

    function editBooking(booking) {
        // Remplir le formulaire de réservation avec les données actuelles
        bkFilm.value = booking.film_title;
        document.getElementById('bk-count').value = booking.seats;

        // Set the date using the date picker
        setBkSelectedDate(booking.film_date);

        // Populate showtimes based on the film
        populateShowtimes(booking.film_title);

        // Set the time value
        bkTime.value = booking.film_time;

        // Stocker l'ID de la réservation en édition
        bookingForm.dataset.editingBookingId = booking.id;

        // Fermer le modal des réservations et ouvrir le modal de réservation
        bookingsModal.classList.add('hidden');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    async function deleteBooking(bookingId, bookingEl) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/booking/${bookingId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                // Supprimer l'élément du DOM avec animation
                bookingEl.style.opacity = '0';
                bookingEl.style.transform = 'translateX(-100%)';
                bookingEl.style.transition = 'all 0.3s ease';

                setTimeout(() => {
                    bookingEl.remove();
                    showSuccessNotification('Réservation supprimée');

                    // Si c'est la dernière réservation, afficher le message vide
                    if (bookingsList.children.length === 0) {
                        bookingsList.innerHTML = '<p>Aucune réservation pour le moment.</p>';
                    }
                }, 300);
            } else {
                alert('Erreur: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('Erreur lors de la suppression');
        }
    }

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
            const [year, month, day] = selectedDate.split('-');
            const dateObj = new Date(year, month - 1, day);
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
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const date = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${date}`;
            if (dateStr === selectedDate) {
                dayBtn.classList.add('active');
            }

            // Disable past dates
            if (currentDate < today) {
                dayBtn.disabled = true;
                dayBtn.classList.add('other-month');
            }

            dayBtn.addEventListener('click', () => {
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const date = String(currentDate.getDate()).padStart(2, '0');
                const iso = `${year}-${month}-${date}`;
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

        let selectedDateObj;
        if (selectedDate) {
            const [year, month, day] = selectedDate.split('-');
            selectedDateObj = new Date(year, month - 1, day);
        }

        quickBtns.forEach(btn => {
            btn.classList.remove('active');
            if (selectedDateObj) {
                if (btn.dataset.days === '0' && selectedDateObj.getTime() === today.getTime()) {
                    btn.classList.add('active');
                } else if (btn.dataset.days === '1' && selectedDateObj.getTime() === tomorrow.getTime()) {
                    btn.classList.add('active');
                }
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

            const year = newDate.getFullYear();
            const month = String(newDate.getMonth() + 1).padStart(2, '0');
            const day = String(newDate.getDate()).padStart(2, '0');
            const iso = `${year}-${month}-${day}`;
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
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
    updateSelectedDateDisplay();
    renderCalendar();
    updateQuickBtns();

    // ========================================
    // BOOKING CALENDAR MANAGEMENT
    // ========================================

    function initializeBkYearSelect() {
        const today = new Date();
        for (let year = today.getFullYear(); year <= today.getFullYear() + 1; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === today.getFullYear()) option.selected = true;
            bkCalendarYearSelect.appendChild(option);
        }
    }

    function renderBkCalendar() {
        const firstDay = new Date(bkCurrentDisplayYear, bkCurrentDisplayMonth, 1);
        const lastDay = new Date(bkCurrentDisplayYear, bkCurrentDisplayMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        bkCalendarDaysContainer.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Previous month's days
        const prevMonthLastDay = new Date(bkCurrentDisplayYear, bkCurrentDisplayMonth, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayBtn = document.createElement('button');
            dayBtn.className = 'calendar-day other-month';
            dayBtn.textContent = prevMonthLastDay - i;
            dayBtn.disabled = true;
            bkCalendarDaysContainer.appendChild(dayBtn);
        }

        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayBtn = document.createElement('button');
            dayBtn.className = 'calendar-day';
            dayBtn.textContent = day;
            dayBtn.type = 'button';

            const currentDate = new Date(bkCurrentDisplayYear, bkCurrentDisplayMonth, day);
            currentDate.setHours(0, 0, 0, 0);

            // Mark today
            if (currentDate.getTime() === today.getTime()) {
                dayBtn.classList.add('today');
            }

            // Mark selected date
            if (bkSelectedDate) {
                const [selYear, selMonth, selDay] = bkSelectedDate.split('-');
                const dateStr = `${bkCurrentDisplayYear}-${String(bkCurrentDisplayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (dateStr === bkSelectedDate) {
                    dayBtn.classList.add('active');
                }
            }

            // Disable past dates
            if (currentDate < today) {
                dayBtn.disabled = true;
                dayBtn.classList.add('other-month');
            }

            dayBtn.addEventListener('click', () => {
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const date = String(currentDate.getDate()).padStart(2, '0');
                const iso = `${year}-${month}-${date}`;
                setBkSelectedDate(iso);
                renderBkCalendar();
                closeBkCalendarModal();
            });

            bkCalendarDaysContainer.appendChild(dayBtn);
        }

        // Next month's days
        const totalCells = bkCalendarDaysContainer.children.length;
        const remainingCells = 42 - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const dayBtn = document.createElement('button');
            dayBtn.className = 'calendar-day other-month';
            dayBtn.textContent = day;
            dayBtn.disabled = true;
            bkCalendarDaysContainer.appendChild(dayBtn);
        }
    }

    function setBkSelectedDate(iso) {
        bkSelectedDate = iso;
        const [year, month, day] = iso.split('-');
        bkDate.value = iso;
        const dateObj = new Date(year, month - 1, day);

        // Format court: "jeu. 4 déc."
        const shortText = dateObj.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
        bkDateDisplay.textContent = shortText.charAt(0).toUpperCase() + shortText.slice(1);

        // Mettre à jour les séances quand la date change
        // Pour l'instant, on affiche les mêmes séances pour toutes les dates
        // (car les séances ne varient pas par date dans notre app)
        populateShowtimes(bkFilm.value);
    }

    function openBkCalendarModal() {
        bkCurrentDisplayMonth = new Date().getMonth();
        bkCurrentDisplayYear = new Date().getFullYear();
        bkCalendarMonthSelect.value = bkCurrentDisplayMonth;
        bkCalendarYearSelect.value = bkCurrentDisplayYear;
        renderBkCalendar();
        bookingCalendarModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeBkCalendarModal() {
        bookingCalendarModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Booking calendar event listeners
    bkDateBtn.addEventListener('click', openBkCalendarModal);
    bookingCalendarBackdrop.addEventListener('click', closeBkCalendarModal);

    bkCalendarMonthSelect.addEventListener('change', function() {
        bkCurrentDisplayMonth = parseInt(this.value);
        renderBkCalendar();
    });

    bkCalendarYearSelect.addEventListener('change', function() {
        bkCurrentDisplayYear = parseInt(this.value);
        renderBkCalendar();
    });

    bkCalendarPrevBtn.addEventListener('click', () => {
        bkCurrentDisplayMonth--;
        if (bkCurrentDisplayMonth < 0) {
            bkCurrentDisplayMonth = 11;
            bkCurrentDisplayYear--;
        }
        bkCalendarMonthSelect.value = bkCurrentDisplayMonth;
        bkCalendarYearSelect.value = bkCurrentDisplayYear;
        renderBkCalendar();
    });

    bkCalendarNextBtn.addEventListener('click', () => {
        bkCurrentDisplayMonth++;
        if (bkCurrentDisplayMonth > 11) {
            bkCurrentDisplayMonth = 0;
            bkCurrentDisplayYear++;
        }
        bkCalendarMonthSelect.value = bkCurrentDisplayMonth;
        bkCalendarYearSelect.value = bkCurrentDisplayYear;
        renderBkCalendar();
    });

    // Initialize booking calendar
    initializeBkYearSelect();

    // ========================================
    // MODAL MANAGEMENT
    // ========================================
    function openModal(title, date, time) {
        bkFilm.value = title;

        // Populate showtimes based on the selected film
        populateShowtimes(title);

        // Set the date
        if (date) {
            setBkSelectedDate(date);
        } else {
            // Set today as default
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            setBkSelectedDate(`${year}-${month}-${day}`);
        }

        // Set the time value if provided
        if (time) {
            bkTime.value = time;
        }

        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        bookingForm.reset();
        // Clean up editing state
        delete bookingForm.dataset.editingBookingId;
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
    // RESERVE BUTTON HANDLING
    // ========================================
    const reserveButtons = document.querySelectorAll('.reserve-btn');

    reserveButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            // If not logged in, open auth modal
            if (!currentUser) {
                openAuthModal();

                // After user logs in, show the showtimes
                // We'll use a MutationObserver to detect when user logs in
                const observer = new MutationObserver(() => {
                    if (currentUser) {
                        const showtimesDetails = btn.nextElementSibling;
                        if (showtimesDetails && showtimesDetails.classList.contains('hidden')) {
                            showtimesDetails.classList.remove('hidden');
                        }
                        observer.disconnect();
                    }
                });
                observer.observe(document.body, { attributes: true, subtree: true });
                return;
            }

            // If logged in, toggle showtimes display
            const showtimesDetails = btn.nextElementSibling;
            if (showtimesDetails && showtimesDetails.classList.contains('showtimes-details')) {
                showtimesDetails.classList.toggle('hidden');
            }
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

    // Update showtimes when film selection changes
    bkFilm.addEventListener('change', function() {
        populateShowtimes(this.value);
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

        const isEditing = bookingForm.dataset.editingBookingId;
        const method = isEditing ? 'PUT' : 'POST';
        const endpoint = isEditing ? `/api/booking/${isEditing}` : '/api/booking';

        try {
            const response = await fetch(endpoint, {
                method: method,
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
                const message = isEditing
                    ? `Réservation modifiée ! ${film} • ${date} à ${time} • ${count} place(s)`
                    : `Réservation confirmée ! ${film} • ${date} à ${time} • ${count} place(s)`;
                showSuccessNotification(message);

                // Nettoyer les données d'édition
                delete bookingForm.dataset.editingBookingId;

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
    function showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <div class="notification-text">
                    <p>${message}</p>
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
    // SEARCH FUNCTIONALITY WITH SUGGESTIONS
    // ========================================
    const searchSuggestions = document.getElementById('search-suggestions');

    if (searchInput) {
        // Fonction pour filtrer les films par query
        function filterMovies(query) {
            if (!query.trim()) {
                movieCards.forEach((card) => {
                    card.style.display = '';
                });
                searchSuggestions.classList.add('hidden');
                return;
            }

            const lowerQuery = query.toLowerCase();
            const filtered = [];

            movieCards.forEach((card) => {
                const title = card.dataset.title.toLowerCase();
                if (title.startsWith(lowerQuery)) {
                    card.style.display = '';
                    card.classList.add('fade-in');
                    filtered.push(card);
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Fonction pour afficher les suggestions
        function showSuggestions(query) {
            if (!query.trim()) {
                searchSuggestions.classList.add('hidden');
                return;
            }

            const lowerQuery = query.toLowerCase();
            const suggestions = [];

            movieCards.forEach((card) => {
                const title = card.dataset.title;
                const director = card.querySelector('.movie-director')?.textContent || '';
                const rating = card.querySelector('.movie-meta')?.textContent || '';

                if (title.toLowerCase().startsWith(lowerQuery)) {
                    suggestions.push({
                        title: title,
                        director: director.replace('<strong>Réalisateur:</strong>', '').trim(),
                        rating: rating,
                        card: card
                    });
                }
            });

            // Afficher les suggestions
            if (suggestions.length > 0) {
                searchSuggestions.innerHTML = suggestions.map((item, index) => `
                    <div class="search-suggestion-item" data-index="${index}">
                        <div class="search-suggestion-icon">🎬</div>
                        <div class="search-suggestion-info">
                            <div class="search-suggestion-title">${item.title}</div>
                            <div class="search-suggestion-detail">${item.director}</div>
                        </div>
                        <div class="search-suggestion-rating">${item.rating}</div>
                    </div>
                `).join('');

                // Ajouter les event listeners aux suggestions
                document.querySelectorAll('.search-suggestion-item').forEach((item) => {
                    item.addEventListener('click', () => {
                        const suggestionIndex = parseInt(item.dataset.index);
                        searchInput.value = suggestions[suggestionIndex].title;
                        searchSuggestions.classList.add('hidden');
                        filterMovies(suggestions[suggestionIndex].title);
                        // Scroller vers le film
                        document.getElementById('movies').scrollIntoView({ behavior: 'smooth' });
                    });

                    // Hover effect
                    item.addEventListener('mouseenter', () => {
                        document.querySelectorAll('.search-suggestion-item').forEach(el => el.classList.remove('active'));
                        item.classList.add('active');
                    });
                });

                searchSuggestions.classList.remove('hidden');
            } else {
                searchSuggestions.innerHTML = '<div class="search-no-results">Aucun film trouvé</div>';
                searchSuggestions.classList.remove('hidden');
            }
        }

        // Event listener pour l'input
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            filterMovies(query);
            showSuggestions(query);
        });

        // Event listener pour fermer les suggestions au focus
        searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim()) {
                showSuggestions(e.target.value);
            }
        });

        // Fermer les suggestions quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search')) {
                searchSuggestions.classList.add('hidden');
            }
        });

        // Ajouter les animations fade-in
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

// ========================================
// CINEMA BOOKING APPLICATION
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // ========================================
    // DOM Elements - Booking
    // ========================================

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
    const loginFormSection = document.getElementById('login-form-section');
    const registerFormSection = document.getElementById('register-form-section');
    const logoutBtn = document.getElementById('logout-btn');
    const myBookingsBtnSection = document.getElementById('my-bookings-btn-hero');
    const bookingsModal = document.getElementById('bookings-modal');
    const bookingsList = document.getElementById('bookings-list');

    let currentUser = null;
    let pendingBooking = null;

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    let reservations = [];

    // Cache for showtimes with IDs
    let cachedShowtimes = [];
    let selectedShowtime = null;

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

    // Price categories
    const PRICES = {
        "adult": 9.0,
        "child": 6.0,
        "senior": 7.0,
        "student": 7.5,
        "disabled": 6.5,
        "unemployed": 6.5
    };

    const PRICE_LABELS = {
        "adult": "Adulte - 9.0€",
        "child": "Enfants - 6.0€",
        "senior": "Seniors - 7.0€",
        "student": "Étudiants - 7.5€",
        "disabled": "Personnes handicapées - 6.5€",
        "unemployed": "Demandeurs d'emploi - 6.5€"
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

        // Show admin buttons or "Mes réservations" based on user role
        if (currentUser.is_admin) {
            myBookingsBtnSection.classList.add('hidden');
            document.getElementById('add-film-btn-hero').classList.remove('hidden');
            document.getElementById('add-showtime-btn-hero').classList.remove('hidden');
        } else {
            myBookingsBtnSection.classList.remove('hidden');
            document.getElementById('add-film-btn-hero').classList.add('hidden');
            document.getElementById('add-showtime-btn-hero').classList.add('hidden');
        }
    }

    function updateUIForLoggedOut() {
        accountLoggedIn.classList.add('hidden');
        accountLoggedOut.classList.remove('hidden');
        // Hide all user/admin buttons in hero
        document.getElementById('my-bookings-btn-hero').classList.add('hidden');
        document.getElementById('add-film-btn-hero').classList.add('hidden');
        document.getElementById('add-showtime-btn-hero').classList.add('hidden');
        // Hide "Mes réservations" button in prices section
        myBookingsBtnSection.classList.add('hidden');
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
    // Function to load and display bookings
    async function showMyBookings() {
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
                                <button class="booking-btn edit-btn" data-booking-id="${booking.id}" title="Modifier">Modifier</button>
                                <button class="booking-btn delete-btn" data-booking-id="${booking.id}" title="Supprimer">Supprimer</button>
                                <button class="booking-btn payment-btn" data-booking-id="${booking.id}" data-amount="${booking.total_price}" title="Paiement">Paiement</button>
                            </div>
                        </div>
                        <p><strong>Date:</strong> ${booking.film_date}</p>
                        <p><strong>Heure:</strong> ${booking.film_time}</p>
                        <p><strong>Places:</strong> ${booking.seats}</p>
                        <p class="booking-price">Total: ${booking.total_price}€</p>
                    `;

                    // Add event listeners for edit, delete and payment buttons
                    const editBtn = bookingEl.querySelector('.edit-btn');
                    const deleteBtn = bookingEl.querySelector('.delete-btn');
                    const paymentBtn = bookingEl.querySelector('.payment-btn');

                    editBtn.addEventListener('click', () => {
                        editBooking(booking);
                    });

                    deleteBtn.addEventListener('click', () => {
                        deleteBooking(booking.id, bookingEl);
                    });

                    paymentBtn.addEventListener('click', () => {
                        processPayment(booking);
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
    }

    // Add click listener to bookings button
    myBookingsBtnSection.addEventListener('click', showMyBookings);

    // ========================================
    // BOOKING MANAGEMENT - EDIT & DELETE
    // ========================================

    async function populateShowtimes(filmTitle) {
        // Clear existing options except the first one
        while (bkTime.options.length > 1) {
            bkTime.remove(1);
        }

        // Reset cached showtimes and selected showtime
        cachedShowtimes = [];
        selectedShowtime = null;

        // Get the selected date
        const selectedDate = bkDate.value;

        // If we have both film and date, fetch showtimes from backend
        if (filmTitle && selectedDate) {
            try {
                const response = await fetch(`/api/showtimes/${selectedDate}`);
                const data = await response.json();

                if (data && data.showtimes && data.showtimes.length > 0) {
                    const allShowtimes = data.showtimes || [];
                    // Filter by film title
                    const showtimes = allShowtimes.filter(s => s.film_title === filmTitle);

                    console.log('Populated showtimes:', showtimes);
                    cachedShowtimes = showtimes; // Cache the full showtime objects

                    // Add showtimes as options
                    showtimes.forEach(showtime => {
                        const option = document.createElement('option');
                        option.value = String(showtime.id); // Store ID as value
                        option.dataset.time = showtime.film_time; // Store time as dataset
                        option.dataset.theatre = showtime.theatre_id; // Store theatre ID as dataset
                        option.textContent = `${showtime.film_time} - ${showtime.available_seats} places`;
                        bkTime.appendChild(option);
                    });
                } else {
                    console.warn('No showtimes found from API, using fallback');
                    // Fallback to default showtimes
                    const showtimes = movieShowtimes[filmTitle] || [];
                    showtimes.forEach(time => {
                        const option = document.createElement('option');
                        option.value = time;
                        option.textContent = time;
                        bkTime.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Error fetching showtimes:', error);
                // Fallback to default showtimes
                const showtimes = movieShowtimes[filmTitle] || [];
                showtimes.forEach(time => {
                    const option = document.createElement('option');
                    option.value = time;
                    option.textContent = time;
                    bkTime.appendChild(option);
                });
            }
        } else if (filmTitle) {
            // If no date selected, use default showtimes
            const showtimes = movieShowtimes[filmTitle] || [];
            showtimes.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                bkTime.appendChild(option);
            });
        }
    }

    async function editBooking(booking) {
        // Remplir le formulaire de réservation avec les données actuelles
        bkFilm.value = booking.film_title;
        document.getElementById('bk-count').value = booking.seats;

        // Set the date input directly
        bkDate.value = booking.film_date;

        // Populate showtimes based on the film (wait for it to complete)
        await populateShowtimes(booking.film_title);

        // Find and select the correct showtime option by matching the film_time
        let foundOption = false;
        for (let i = 0; i < bkTime.options.length; i++) {
            const option = bkTime.options[i];
            if (option.dataset.time === booking.film_time) {
                bkTime.selectedIndex = i;
                bkTime.value = option.value;
                foundOption = true;

                // Trigger change event to update hidden fields
                const event = new Event('change', { bubbles: true });
                bkTime.dispatchEvent(event);
                break;
            }
        }

        if (!foundOption) {
            console.warn(`Could not find option for time: ${booking.film_time}`);
        }

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
    // PAYMENT MANAGEMENT
    // ========================================
    async function processPayment(booking) {
        const amount = booking.total_price;
        const confirmation = confirm(`Confirmer le paiement de ${amount}€ pour "${booking.film_title}" ?`);

        if (!confirmation) {
            return;
        }

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    booking_id: booking.id,
                    amount: amount,
                    film_title: booking.film_title,
                    film_date: booking.film_date,
                    film_time: booking.film_time
                })
            });

            const data = await response.json();

            if (data.success) {
                showSuccessNotification(`Paiement de ${amount}€ effectué avec succès !`);
                // Recharger les réservations
                await showMyBookings();
            } else {
                alert('Erreur: ' + (data.error || 'Le paiement a échoué'));
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Erreur lors du traitement du paiement');
        }
    }

    // ========================================
    // MODAL MANAGEMENT
    // ========================================
    function openModal(title, date, time) {
        bkFilm.value = title;

        // Populate showtimes based on the selected film
        populateShowtimes(title);

        // Set the date input
        if (date) {
            bkDate.value = date;
        } else {
            // Set today as default
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            bkDate.value = `${year}-${month}-${day}`;
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
        // Hide seat categories section
        document.getElementById('seat-categories').classList.add('hidden');
        // Clean up editing state
        delete bookingForm.dataset.editingBookingId;
    }

    // ========================================
    // SEAT CATEGORIES MANAGEMENT
    // ========================================
    function generateSeatCategories(count) {
        const seatCategoryList = document.getElementById('seat-category-list');
        const seatCategories = document.getElementById('seat-categories');

        seatCategoryList.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            const seatRow = document.createElement('div');
            seatRow.className = 'seat-row';
            seatRow.innerHTML = `
                <label>Place ${i}</label>
                <select class="seat-category-select" data-seat="${i}">
                    ${Object.entries(PRICE_LABELS).map(([key, label]) =>
                        `<option value="${key}">${label}</option>`
                    ).join('')}
                </select>
                <span class="seat-price" data-seat="${i}">9.00€</span>
            `;
            seatCategoryList.appendChild(seatRow);

            // Add event listener pour calculer le prix
            const select = seatRow.querySelector('.seat-category-select');
            select.addEventListener('change', calculateTotalPrice);
        }

        // Show the seat categories section
        seatCategories.classList.remove('hidden');
        calculateTotalPrice();
    }

    function calculateTotalPrice() {
        const selects = document.querySelectorAll('.seat-category-select');
        let totalPrice = 0;

        selects.forEach((select) => {
            const category = select.value;
            const price = PRICES[category];
            const seatNumber = select.dataset.seat;

            // Update the price display for this seat
            const priceSpan = document.querySelector(`.seat-price[data-seat="${seatNumber}"]`);
            if (priceSpan) {
                priceSpan.textContent = price.toFixed(2) + '€';
            }

            totalPrice += price;
        });

        // Update total price
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    }

    // ========================================
    // RESERVE BUTTON HANDLING
    // ========================================
    const reserveButtons = document.querySelectorAll('.reserve-btn');

    reserveButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            // Get the movie data from button attributes
            const movieTitle = btn.getAttribute('data-title');

            // If not logged in, open auth modal first
            if (!currentUser) {
                openAuthModal();
                return;
            }

            // If logged in, open the booking modal directly
            openModal(movieTitle);
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

    // Update showtimes when date changes
    bkDate.addEventListener('change', function() {
        populateShowtimes(bkFilm.value);
    });

    // Generate seat categories when seat count changes
    const bkCount = document.getElementById('bk-count');
    bkCount.addEventListener('change', function() {
        const count = parseInt(this.value);
        if (count > 0) {
            generateSeatCategories(count);
        } else {
            document.getElementById('seat-categories').classList.add('hidden');
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
        const showtimeId = document.getElementById('bk-showtime-id').value;
        const theatreId = document.getElementById('bk-theatre-id').value;
        const selectedSeatsJson = document.getElementById('bk-selected-seats').value;

        // Validation des champs obligatoires
        if (!film || !film.trim()) {
            alert('⚠️ Erreur: Le champ "Film" est obligatoire');
            return;
        }

        if (!date || !date.trim()) {
            alert('⚠️ Erreur: Le champ "Date" est obligatoire');
            return;
        }

        if (!time || time === '') {
            alert('⚠️ Erreur: Le champ "Séance" est obligatoire');
            return;
        }

        if (!count || count === '') {
            alert('⚠️ Erreur: Le champ "Nombre de places" est obligatoire');
            return;
        }

        // Validate that seats have been selected
        let selectedSeats = [];
        if (selectedSeatsJson && selectedSeatsJson !== '[]') {
            try {
                selectedSeats = JSON.parse(selectedSeatsJson);
            } catch (e) {
                console.error('Error parsing selected seats:', e);
            }
        }

        if (selectedSeats.length === 0) {
            alert('⚠️ Erreur: Vous devez choisir vos places avant de confirmer la réservation');
            return;
        }

        // Collect seat categories
        const seatCategories = [];
        const categorySelects = document.querySelectorAll('.seat-category-select');
        if (categorySelects.length > 0) {
            categorySelects.forEach((select) => {
                seatCategories.push(select.value);
            });
        } else {
            // If no categories selected (shouldn't happen), use default
            for (let i = 0; i < count; i++) {
                seatCategories.push('adult');
            }
        }

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
                    seats: count,
                    seat_categories: seatCategories,
                    selected_seats: selectedSeats,
                    showtime_id: showtimeId ? parseInt(showtimeId) : null,
                    theatre_id: theatreId ? parseInt(theatreId) : null
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

    // ========================================
    // SEAT SELECTION LOGIC
    // ========================================
    const seatSelectionModal = document.getElementById('seat-selection-modal');
    const chooseSeatsBtn = document.getElementById('choose-seats-btn');
    const confirmSeatsBtn = document.getElementById('confirm-seats-btn');
    const cancelSeatsBtn = document.getElementById('cancel-seats-btn');
    const seatLayout = document.getElementById('seat-layout');

    let currentShowtimeId = null;
    let currentTheatreId = null;
    let selectedSeatsData = [];

    // Function to load and display seats for a showtime
    async function loadSeatLayout(showtimeId) {
        try {
            const response = await fetch(`/api/seats/${showtimeId}`);
            const data = await response.json();

            if (!data.success) {
                alert('Erreur: ' + data.error);
                return;
            }

            currentShowtimeId = showtimeId;
            currentTheatreId = data.theatre_id;
            selectedSeatsData = [];

            // Store theatre ID in hidden field
            document.getElementById('bk-theatre-id').value = data.theatre_id;

            // Clear previous layout
            seatLayout.innerHTML = '';

            // Build seat layout
            data.rows.forEach((row) => {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'seat-row-display';

                const labelSpan = document.createElement('span');
                labelSpan.className = 'seat-row-label';
                labelSpan.textContent = row.row;
                rowDiv.appendChild(labelSpan);

                row.seats.forEach((seat) => {
                    const seatBtn = document.createElement('button');
                    seatBtn.type = 'button';
                    seatBtn.className = 'seat-btn';
                    seatBtn.textContent = seat.number;
                    seatBtn.dataset.row = row.row;
                    seatBtn.dataset.seat = seat.number;

                    if (seat.booked) {
                        seatBtn.classList.add('booked');
                        seatBtn.disabled = true;
                    } else {
                        seatBtn.addEventListener('click', toggleSeatSelection);
                    }

                    rowDiv.appendChild(seatBtn);
                });

                seatLayout.appendChild(rowDiv);
            });

            // Add legend
            const legend = document.createElement('div');
            legend.className = 'seat-legend';
            legend.innerHTML = `
                <div class="legend-item">
                    <div class="legend-box available"></div>
                    <span>Disponible</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box booked"></div>
                    <span>Occupé</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box selected"></div>
                    <span>Sélectionné</span>
                </div>
            `;
            seatLayout.appendChild(legend);

            // Show modal
            seatSelectionModal.classList.remove('hidden');
            seatSelectionModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            updateSeatCount();

        } catch (error) {
            console.error('Error loading seats:', error);
            alert('Erreur lors du chargement des places');
        }
    }

    function toggleSeatSelection(e) {
        const btn = e.target;
        const row = btn.dataset.row;
        const seat = parseInt(btn.dataset.seat);

        const seatId = `${row}-${seat}`;

        if (btn.classList.contains('selected')) {
            btn.classList.remove('selected');
            selectedSeatsData = selectedSeatsData.filter(s => s.seatId !== seatId);
        } else {
            const requiredCount = parseInt(document.getElementById('bk-count').value);
            if (selectedSeatsData.length >= requiredCount) {
                alert(`Vous ne pouvez sélectionner que ${requiredCount} place(s)`);
                return;
            }
            btn.classList.add('selected');
            selectedSeatsData.push({ row, seat, seatId });
        }

        updateSeatCount();
    }

    function updateSeatCount() {
        const selectedCount = document.getElementById('selected-count');
        const requiredCount = document.getElementById('required-count');
        const totalCount = parseInt(document.getElementById('bk-count').value) || 0;

        selectedCount.textContent = selectedSeatsData.length;
        requiredCount.textContent = totalCount;
    }

    // Event listeners for seat selection modal
    chooseSeatsBtn.addEventListener('click', async function() {
        // Get selected showtime ID directly from the value
        const showtimeId = parseInt(bkTime.value);

        if (!showtimeId) {
            alert('Veuillez d\'abord sélectionner une séance');
            return;
        }

        console.log('Choose seats button clicked:', {
            showtimeId: showtimeId,
            bkTime_value: bkTime.value
        });

        console.log('Loading seats for showtime:', showtimeId);
        await loadSeatLayout(showtimeId);
    });

    confirmSeatsBtn.addEventListener('click', function() {
        const requiredCount = parseInt(document.getElementById('bk-count').value);
        if (selectedSeatsData.length !== requiredCount) {
            alert(`Vous devez sélectionner exactement ${requiredCount} place(s)`);
            return;
        }

        // Store selected seats
        document.getElementById('bk-selected-seats').value = JSON.stringify(selectedSeatsData);

        // Close modal
        seatSelectionModal.classList.add('hidden');
        seatSelectionModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';

        // Show seat categories
        generateSeatCategories(requiredCount);
    });

    cancelSeatsBtn.addEventListener('click', function() {
        seatSelectionModal.classList.add('hidden');
        seatSelectionModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    });

    // Close seat selection modal with X button
    const seatModalClose = seatSelectionModal.querySelector('.modal-close');
    seatModalClose.addEventListener('click', function() {
        seatSelectionModal.classList.add('hidden');
        seatSelectionModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    });

    // Update show/hide of "Choisir mes places" button when showtime is selected
    bkTime.addEventListener('change', function() {
        const showtimeId = this.value;

        console.log('bkTime changed:', {
            value: showtimeId,
            selectedOption: this.options[this.selectedIndex]
        });

        if (showtimeId) {
            // Show the button
            document.getElementById('seat-selection-button').classList.remove('hidden');

            // Store the showtime ID in the hidden field
            document.getElementById('bk-showtime-id').value = showtimeId;

            // Find the selected showtime from cache for additional data
            const selectedOption = this.options[this.selectedIndex];
            const time = selectedOption.dataset.time;
            const theatre = selectedOption.dataset.theatre;

            console.log('Showtime selected:', {
                showtimeId: showtimeId,
                time: time,
                theatre: theatre
            });
        } else {
            document.getElementById('seat-selection-button').classList.add('hidden');
        }
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
    // ADMIN PANEL
    // ========================================
    const adminModal = document.getElementById('admin-modal');
    const addShowtimeForm = document.getElementById('add-showtime-form');

    // Admin hero buttons
    const addFilmBtnHero = document.getElementById('add-film-btn-hero');
    const addShowtimeBtnHero = document.getElementById('add-showtime-btn-hero');

    if (addFilmBtnHero) {
        addFilmBtnHero.addEventListener('click', () => {
            adminModal.classList.remove('hidden');
            adminModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    if (addShowtimeBtnHero) {
        addShowtimeBtnHero.addEventListener('click', () => {
            adminModal.classList.remove('hidden');
            adminModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close admin modal
    const adminModalClose = adminModal.querySelector('.modal-close');
    if (adminModalClose) {
        adminModalClose.addEventListener('click', () => {
            adminModal.classList.add('hidden');
            adminModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        });
        adminModal.querySelector('.modal-backdrop').addEventListener('click', () => {
            adminModal.classList.add('hidden');
            adminModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        });
    }

    // Handle add showtime form submission
    if (addShowtimeForm) {
        addShowtimeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const filmTitle = document.getElementById('admin-film').value;
            const dateValue = document.getElementById('admin-date').value;
            const timeValue = document.getElementById('admin-time').value;
            const theatreId = document.getElementById('admin-theatre').value;
            const errorEl = document.getElementById('admin-showtime-error');

            if (!filmTitle || !dateValue || !timeValue || !theatreId) {
                errorEl.textContent = 'Tous les champs sont requis';
                errorEl.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch('/api/admin/showtime', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        film_title: filmTitle,
                        film_date: dateValue,
                        film_time: timeValue,
                        theatre_id: parseInt(theatreId)
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showSuccessNotification('Séance ajoutée avec succès!');
                    addShowtimeForm.reset();
                    errorEl.classList.add('hidden');
                    setTimeout(() => {
                        adminModal.classList.add('hidden');
                        adminModal.setAttribute('aria-hidden', 'true');
                        document.body.style.overflow = 'auto';
                    }, 500);
                } else {
                    errorEl.textContent = data.error || 'Erreur lors de l\'ajout de la séance';
                    errorEl.classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error adding showtime:', error);
                errorEl.textContent = 'Erreur lors de la connexion au serveur';
                errorEl.classList.remove('hidden');
            }
        });
    }


    // ========================================
    // CONSOLE MESSAGE
    // ========================================
    console.log('CinéMax Booking System - Ready! 🎬');
});

// File: app-main.js
document.addEventListener('DOMContentLoaded', async () => {    // === DOM ELEMENTS ===
    const elements = {
        loadingScreen: document.querySelector('.loading-screen'),
        textAnimation: document.querySelector('.text-animation'),
        contactModal: document.getElementById('contactModal'),
        contactForm: document.querySelector('.contact-form'),
        openModalBtn: document.getElementById('openContactModalBtn'),
        successMessage: document.getElementById('successMessage'),
        errorMessage: document.getElementById('errorMessage'),
        toggleIP: document.getElementById('toggleIP'),
        ipElement: document.getElementById('ipAddress'),
        toggleSpan: document.getElementById('toggleIP')?.querySelector('span'),
        mainContainer: document.querySelector('.main-container')
    };    // === STATE MANAGEMENT ===
    const state = {
        isIPHidden: true,
        ipAddress: null,
        isLoading: true
    };// === LOADING SCREEN FUNCTIONS ===
    const hideLoadingScreen = () => {
        if (!elements.loadingScreen || !elements.textAnimation) return;
        elements.loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
            state.isLoading = false;
            setTimeout(() => {
                elements.textAnimation.classList.add('start-animation');
            }, 100);
        }, 500);
    };

    // Tampilkan loading screen selama 5 detik
    setTimeout(hideLoadingScreen, 5000);

    // === IP ADDRESS FUNCTIONS ===
    const fetchIPAddress = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP:', error);
            return 'Error loading IP';
        }
    };

    const updateIPDisplay = () => {
        if (!elements.ipElement || !elements.toggleSpan) return;
        elements.toggleSpan.textContent = state.isIPHidden ? 'Show IP' : 'Hide IP';
        if (state.ipAddress) {
            elements.ipElement.textContent = state.ipAddress;
            elements.ipElement.classList.toggle('masked', state.isIPHidden);
        }
    };    // === EVENT LISTENERS ===
    elements.openModalBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        elements.contactModal.style.display = 'flex';
        setTimeout(() => {
            elements.contactModal.classList.add('active');
        }, 10);
    });
      elements.contactModal?.addEventListener('click', (e) => {
        if (e.target === elements.contactModal) {
            const container = elements.contactModal.querySelector('.modal-container');
            container.style.animation = 'modalSlideOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            elements.contactModal.style.animation = 'modalFadeIn 0.4s ease forwards reverse';
            
            setTimeout(() => {
                elements.contactModal.classList.remove('active');
                elements.contactModal.style.display = 'none';
                container.style.animation = '';
                elements.contactModal.style.animation = '';
            }, 400);
        }
    });

    elements.toggleIP?.addEventListener('click', (e) => {
        e.preventDefault();
        state.isIPHidden = !state.isIPHidden;
        updateIPDisplay();
    });

    // Limit submissions per IP using localStorage as a simple workaround (not secure, but works for static site)
function getSubmissionCount() {
    return parseInt(localStorage.getItem('contactFormSubmissions') || '0', 10);
}
function incrementSubmissionCount() {
    localStorage.setItem('contactFormSubmissions', (getSubmissionCount() + 1).toString());
}

const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(event) {
    if (getSubmissionCount() >= 1) {
        event.preventDefault();
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').textContent = 'You have reached the submission limit for this device.';
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const formData = new FormData(form);

    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
    })
    .then(() => {
        incrementSubmissionCount();
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
        form.reset(); // Reset the form fields
        // Sembunyikan pesan sukses setelah 5 detik
        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
        }, 5000);
    })
    .catch(() => {
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'block';
    });
});    // === INITIALIZE ===
    const init = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        hideLoadingScreen();
        state.ipAddress = await fetchIPAddress();
        updateIPDisplay();
    };

    init();
});

// Disable right click and inspect element
window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
window.addEventListener('keydown', function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        e.stopPropagation();
    }
});

// Disable all mouse clicks (left, right, middle) KECUALI tombol kontak dan input/textarea dalam modal
function isAllowedClickTarget(target) {
    // Izinkan klik pada tombol kontak dan input/textarea di dalam modal kontak
    return (
        (target.closest && target.closest('#openContactModalBtn')) ||
        (target.closest && target.closest('#contactModal') && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'))
    );
}
window.addEventListener('mousedown', function(e) {
    if (!isAllowedClickTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);
window.addEventListener('mouseup', function(e) {
    if (!isAllowedClickTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);
window.addEventListener('click', function(e) {
    if (!isAllowedClickTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

// Izinkan context menu (copy/paste) di input/textarea dalam modal
window.addEventListener('contextmenu', function(e) {
    if (e.target.closest && e.target.closest('#contactModal') && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        // allow context menu
        return;
    }
    e.preventDefault();
});

// Fitur translate: arahkan ke Google Translate di tab baru
const translateBtn = document.getElementById('translateBtn');
const messageTextarea = document.getElementById('message');
// Fallback: jika API gagal, tampilkan hasil dummy agar user tahu tombol bekerja
if (translateBtn && messageTextarea) {
    translateBtn.addEventListener('click', async function() {
        const text = messageTextarea.value.trim();
        if (!text) return;
        translateBtn.disabled = true;
        translateBtn.querySelector('span').textContent = 'Translating...';
        try {
            // Ganti URL di bawah dengan endpoint API yang Anda deploy
            const res = await fetch('https://free-translate-api.fly.dev/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: text,
                    source: 'auto',
                    target: 'en'
                })
            });
            const data = await res.json();
            if (data.translatedText) {
                messageTextarea.value = data.translatedText;
            } else {
                alert('Failed to translate: ' + (data.error || 'Unknown error'));
            }
        } catch (e) {
            alert('Failed to translate: ' + e.message);
        }
        translateBtn.disabled = false;
        translateBtn.querySelector('span').textContent = 'Translate';
    });
}
document.addEventListener('DOMContentLoaded', async () => {
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
    };

    const state = {
        isIPHidden: true,
        ipAddress: null,
        isLoading: true,
        devtoolsOpen: false
    };

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

    setTimeout(hideLoadingScreen, 5000);

    function showDevtoolsWarning() {
        if (state.devtoolsOpen) return;
        state.devtoolsOpen = true;
        elements.mainContainer.style.display = 'none';
        if (elements.contactModal) elements.contactModal.style.display = 'none';
        let warn = document.createElement('div');
        warn.className = 'devtools-warning';
        warn.innerHTML = '<div class="devtools-title">Security Warning!</div>' +
            '<div class="devtools-desc">Developer Tools detected.<br>For security reasons, the entire page is hidden.<br>Close DevTools to continue.</div>';
        document.body.appendChild(warn);
        document.body.style.overflow = 'hidden';
    }

    function hideDevtoolsWarning() {
        if (!state.devtoolsOpen) return;
        const warn = document.querySelector('.devtools-warning');
        if (warn) warn.remove();
        elements.mainContainer.style.display = '';
        document.body.style.overflow = '';
        state.devtoolsOpen = false;
    }

    window.addEventListener('keydown', function(e) {
        if (e.key === 'F12') {
            showDevtoolsWarning();
            e.preventDefault();
            return;
        }
        
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key.toLowerCase() === 'i')) {
            showDevtoolsWarning();
            e.preventDefault();
            return;
        }
        
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key.toLowerCase() === 'j')) {
            showDevtoolsWarning();
            e.preventDefault();
            return;
        }
        
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key.toLowerCase() === 'c')) {
            showDevtoolsWarning();
            e.preventDefault();
            return;
        }
        
        if (e.ctrlKey && (e.key === 'U' || e.key.toLowerCase() === 'u')) {
            showDevtoolsWarning();
            e.preventDefault();
            return;
        }
    });

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

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
    };

    elements.openModalBtn?.addEventListener('click', (e) => {
        if (state.devtoolsOpen) return;
        e.preventDefault();
        elements.contactModal.style.display = 'flex';
        setTimeout(() => {
            elements.contactModal.classList.add('active');
            updateSubmissionCountdown();
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

    function canSubmitAgain() {
        const last = localStorage.getItem('contactFormLastSubmit');
        if (!last) return true;
        const lastTime = parseInt(last, 10);
        const now = Date.now();
        return (now - lastTime) > 86400000; // 24 jam
    }

    function getLastSubmitTime() {
        const last = localStorage.getItem('contactFormLastSubmit');
        return last ? parseInt(last, 10) : null;
    }

    function updateSubmissionCountdown() {
        const countdownEl = document.getElementById('submissionCountdown');
        const last = getLastSubmitTime();
        if (!last) {
            countdownEl.style.display = 'none';
            return;
        }
        const now = Date.now();
        const diff = 86400000 - (now - last);
        if (diff <= 0) {
            countdownEl.style.display = 'none';
            return;
        }
        countdownEl.style.display = 'block';
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        countdownEl.textContent = `You can submit again in ${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }
    setInterval(updateSubmissionCountdown, 1000);
    updateSubmissionCountdown();

    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(event) {
        if (!canSubmitAgain()) {
            event.preventDefault();
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').textContent = 'You can only submit once every 24 hours.';
            document.getElementById('errorMessage').style.display = 'block';
            updateSubmissionCountdown();
            return;
        }
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => {
            localStorage.setItem('contactFormLastSubmit', Date.now().toString());
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('errorMessage').style.display = 'none';
            form.reset();
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        })
        .catch(() => {
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'block';
        });
    });    const init = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        hideLoadingScreen();
        state.ipAddress = await fetchIPAddress();
        updateIPDisplay();
    };

    init();
});

window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
window.addEventListener('keydown', function(e) {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        e.stopPropagation();
    }
});

function isAllowedClickTarget(target) {
    return (
        (target.closest && target.closest('#openContactModalBtn')) ||
        (target.closest && target.closest('#contactModal') && (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.id === 'translateBtn' ||
            target.closest('#translateBtn') ||
            target.id === 'toggleIP' ||
            target.closest('#toggleIP') ||
            target.tagName === 'BUTTON' || 
            target.type === 'submit'
        )) ||
        (target.tagName === 'BUTTON' && target.type === 'submit')
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
    if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
        return;
    }
    if (!isAllowedClickTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

window.addEventListener('contextmenu', function(e) {
    if (e.target.closest && e.target.closest('#contactModal') && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
    }
    e.preventDefault();
});

const translateBtn = document.getElementById('translateBtn');
const messageTextarea = document.getElementById('message');
if (translateBtn && messageTextarea) {
    translateBtn.querySelector('span').textContent = 'Translate English';
    translateBtn.addEventListener('click', async function() {
        const text = messageTextarea.value.trim();
        if (!text) return;
        translateBtn.disabled = true;
        translateBtn.querySelector('span').textContent = 'Translating...';
        try {
            const res = await fetch('/.netlify/functions/translate-deepl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await res.json();
            console.log('DeepL API response:', data);
            if (data.translations && data.translations[0] && data.translations[0].text) {
                document.getElementById('message').value = data.translations[0].text;
                console.log('Translated text:', data.translations[0].text);
            } else {
                alert('Failed to translate: ' + (data.message || 'Unknown error'));
                console.log('Translate failed:', data);
            }
        } catch (e) {
            alert('Failed to translate: ' + e.message);
            console.log('Translate error:', e);
        }
        translateBtn.disabled = false;
        translateBtn.querySelector('span').textContent = 'Translate English';
    });
}
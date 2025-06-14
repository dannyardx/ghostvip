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
    });    // === INITIALIZE ===
    const init = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        hideLoadingScreen();
        state.ipAddress = await fetchIPAddress();
        updateIPDisplay();
    };

    init();
});
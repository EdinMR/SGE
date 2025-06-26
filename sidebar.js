// components/sidebar.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.module-view');
    const pageTitle = document.getElementById('pageTitle');

    // --- Core Functions ---

    /**
     * @function showView
     * @description Hides all views and displays the selected one with a fade-in effect.
     * @param {string} viewId - The ID of the view to display (e.g., 'dashboard-view').
     */
    const showView = (viewId) => {
        // Hide all views
        views.forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });

        // Show the target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.style.display = 'block';
            setTimeout(() => targetView.classList.add('active'), 10); // Small delay for transition
            
            // Update the page title
            const titleElement = targetView.querySelector('h2');
            pageTitle.textContent = titleElement ? titleElement.textContent : 'Dashboard';
        }
    };

    /**
     * @function setActiveLink
     * @description Removes the active class from all links and adds it to the selected one.
     * @param {HTMLElement} activeLink - The navigation link to set as active.
     */
    const setActiveLink = (activeLink) => {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };
    
    /**
     * @function handleNavigation
     * @description Handles click events on the navigation links and updates the URL hash.
     * @param {Event} event - The click event.
     */
    const handleNavigation = (event) => {
        event.preventDefault();
        const link = event.currentTarget;
        const viewId = link.getAttribute('data-view');
        
        // Update URL hash without reloading the page
        window.location.hash = link.getAttribute('href').substring(1);

        showView(viewId);
        setActiveLink(link);
        
        // Hide sidebar on mobile after clicking a link
        if (window.innerWidth < 768) {
            sidebar.classList.add('-translate-x-full');
        }
    };

    /**
     * @function initializeView
     * @description Sets the initial view based on the URL hash or defaults to the dashboard.
     */
    const initializeView = () => {
        const initialHash = window.location.hash.substring(1); // Get hash without '#'
        const initialLink = initialHash ? document.querySelector(`a[href="#${initialHash}"]`) : null;

        if (initialLink) {
            showView(initialLink.getAttribute('data-view'));
            setActiveLink(initialLink);
        } else {
            // Default view and link if hash is invalid or missing
            showView('dashboard-view');
            setActiveLink(document.querySelector('a[href="#dashboard"]'));
        }
    };

    // --- Event Listeners ---
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });

    // --- Initializations ---
    initializeView();
});
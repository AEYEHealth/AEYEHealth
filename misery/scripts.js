window.onload = function() {
    document.getElementById('light-dark-switch').addEventListener('click', function() {
        var body = document.body; // Note: can just use document.body
        var button = document.getElementById('light-dark-switch');
    
        // Check the current theme
        if (body.classList.contains('dark-mode')) {
            // If it's dark mode, switch to light mode
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            button.textContent = 'Light Mode';
        } else {
            // If it's light mode, switch to dark mode
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            button.textContent = 'Dark Mode';
        }
    });
}

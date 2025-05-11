document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Form submission
    const contactForm = document.querySelector('form');
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = contactForm.querySelector("input[placeholder='Name']").value;
        const email = contactForm.querySelector("input[placeholder='Email']").value;
        const phone = contactForm.querySelector("input[placeholder='Phone Number']").value;
        const message = contactForm.querySelector("textarea").value;

        try {
            const response = await fetch("http://localhost:5500/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, phone, message })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Thank you for your message! We will contact you soon.");
                contactForm.reset();
            } else {
                alert("Failed to send message: " + (data.message || "Please try again later"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
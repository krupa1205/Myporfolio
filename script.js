// Theme Toggle Functionality (keep this as is)
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.innerHTML = currentTheme === 'dark' ? 
  '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.innerHTML = newTheme === 'dark' ?
    '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Main Form Submission Logic
document.addEventListener('DOMContentLoaded', async () => {
  const projectForm = document.getElementById('projectForm');
  const projectsContainer = document.getElementById('projectsContainer');

  // Load projects when page loads
  await loadProjects();

  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log("Form submit triggered"); // Debug log

      const submitBtn = projectForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      try {
        // Get form data
        const techCheckboxes = Array.from(document.querySelectorAll('input[name="tech"]:checked'));
        const technologies = techCheckboxes.map(checkbox => checkbox.value).join(', ');

        const projectData = {
          project_name: document.getElementById('projectName').value.trim(),
          project_type: document.getElementById('projectType').value,
          technologies: technologies,
          description: document.getElementById('projectDesc').value.trim(),
          github_link: document.getElementById('githubLink').value.trim() || null
        };

        console.log("Submitting:", projectData); // Debug log

        // Validate required fields
        if (!projectData.project_name || !projectData.project_type || !projectData.description) {
          throw new Error('Please fill in all required fields');
        }

        // Send to backend
        const response = await fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData)
        });

        console.log("Response status:", response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit project');
        }

        const result = await response.json();
        console.log("Success:", result); // Debug log

        showMessage('Project submitted successfully!', 'success');
        projectForm.reset();
        await loadProjects(); // Refresh the projects list
      } catch (error) {
        console.error("Error:", error.message); // Debug log
        showMessage(error.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Project';
      }
    });
  }

  // Function to load projects from backend
  async function loadProjects() {
    if (!projectsContainer) return;

    try {
      projectsContainer.innerHTML = '<p>Loading projects...</p>';
      
      const response = await fetch('http://localhost:5000/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }

      const projects = await response.json();
      console.log("Loaded projects:", projects); // Debug log

      if (projects.length === 0) {
        projectsContainer.innerHTML = '<p>No projects submitted yet. Be the first!</p>';
        return;
      }

      projectsContainer.innerHTML = '';
      projects.forEach(project => {
        const projectEl = document.createElement('div');
        projectEl.className = 'dynamic-project';
        projectEl.innerHTML = `
          <h3>${project.project_name}</h3>
          <div class="dynamic-tech">
            ${project.technologies.split(', ').map(tech => `<span>${tech}</span>`).join('')}
          </div>
          <p>${project.description}</p>
          <small>Type: ${project.project_type}</small>
          ${project.github_link ? `<br><a href="${project.github_link}" target="_blank" class="btn-secondary"><i class="fab fa-github"></i> View on GitHub</a>` : ''}
        `;
        projectsContainer.appendChild(projectEl);
      });
    } catch (error) {
      console.error("Load error:", error); // Debug log
      projectsContainer.innerHTML = `<p>Error loading projects: ${error.message}</p>`;
    }
  }
});

// Show message function
function showMessage(text, type = 'success') {
  console.log(`Showing message: ${text}`); // Debug log
  const existing = document.querySelector('.status-message');
  if (existing) existing.remove();

  const message = document.createElement('div');
  message.className = `status-message ${type}`;
  message.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    ${text}
  `;
  document.body.appendChild(message);

  setTimeout(() => {
    message.style.opacity = '0';
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

// Add message styles
const messageStyle = document.createElement('style');
messageStyle.textContent = `
  .status-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 30px;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: fadeInOut 3s ease forwards;
    background: linear-gradient(90deg, #6c63ff, #ff6b6b);
    color: white;
    opacity: 1;
  }
  .status-message.error {
    background: linear-gradient(90deg, #ff416c, #ff4b2b);
  }
  @keyframes fadeInOut {
    0% { opacity: 0; top: 10px; }
    10% { opacity: 1; top: 20px; }
    90% { opacity: 1; top: 20px; }
    100% { opacity: 0; top: 10px; }
  }
`;
document.head.appendChild(messageStyle);
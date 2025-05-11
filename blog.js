// Theme Toggle with dark purple theme
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? 'light' : 'dark';
    themeToggle.textContent = isDark ? 'dark_mode' : 'light_mode';
    
    // Update emoji picker theme if it exists
    const emojiPicker = document.querySelector('.chat-form em-emoji-picker');
    if (emojiPicker) {
      emojiPicker.setAttribute('theme', isDark ? 'light' : 'dark');
    }
    
    // Store theme preference in localStorage
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
}

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.dataset.theme = savedTheme;
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
  }
});

// Blog Data & Cards
let blogs = [
  {
    id: 1,
    title: "JavaScript Basics",
    excerpt: "Learn JS in 10 minutes!",
    category: "Tech",
    readTime: "5",
    thumbnail: "https://via.placeholder.com/300x150?text=JS",
    author: {
      name: "Jane Doe",
      bio: "Web Developer",
      avatar: "https://via.placeholder.com/50?text=JD"
    },
    likes: 10,
    comments: [
      { id: 1, author: "User1", text: "Great post!", date: "2023-05-15" },
      { id: 2, author: "User2", text: "Very helpful, thanks!", date: "2023-05-16" }
    ],
    isUserPost: false
  },
  {
    id: 2,
    title: "Paris Travel Guide",
    excerpt: "Best places to visit in Paris.",
    category: "Travel",
    readTime: "8",
    thumbnail: "https://via.placeholder.com/300x150?text=Paris",
    author: {
      name: "John Smith",
      bio: "Travel Blogger",
      avatar: "https://via.placeholder.com/50?text=JS"
    },
    likes: 15,
    comments: [
      { id: 1, author: "TravelLover", text: "Can't wait to visit!", date: "2023-05-10" }
    ],
    isUserPost: false
  }
];

// User-submitted posts
let userPosts = [];

// Render main blogs
function renderBlogs(blogsToRender = blogs) {
  const container = document.getElementById('blog-container');
  if (!container) return;
  
  container.innerHTML = blogsToRender.map(blog => `
    <div class="blog-card">
      <div class="blog-header">
        <h3 class="blog-title">${blog.title}</h3>
        <span class="blog-category">${blog.category}</span>
      </div>
      <div class="blog-content">
        <p class="blog-text">${blog.excerpt}</p>
      </div>
      <div class="blog-footer">
        <div class="blog-actions">
          <button class="like-btn" onclick="toggleLike(${blog.id})">
            <span class="material-symbols-outlined">thumb_up</span>
            <span class="like-count">${blog.likes}</span>
          </button>
          <button class="comment-btn" onclick="toggleComments(${blog.id})">
            <span class="material-symbols-outlined">comment</span>
            <span>${blog.comments.length}</span>
          </button>
        </div>
        <span class="blog-date">Posted on ${new Date().toLocaleDateString()}</span>
      </div>
      <div class="comments-section" id="comments-${blog.id}" style="display:none;">
        <h4>Comments (${blog.comments.length})</h4>
        <div class="comment-list">
          ${blog.comments.map(comment => `
            <div class="comment">
              <div class="comment-avatar">${comment.author.charAt(0)}</div>
              <div class="comment-content">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-date">${comment.date}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <form class="comment-form" onsubmit="addComment(event, ${blog.id})">
          <input type="text" placeholder="Add a comment..." required>
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  `).join('');
}

// Render user posts
function renderUserPosts() {
  const container = document.getElementById('user-posts-container');
  if (!container) return;
  
  if (userPosts.length === 0) {
    container.innerHTML = '<p class="no-posts">No posts yet. Share your thoughts!</p>';
    return;
  }
  
  container.innerHTML = `
    <h2>Your Posts</h2>
    <div class="user-posts-grid">
      ${userPosts.map(post => `
        <div class="user-blog-card" data-id="${post.id}">
          ${post.thumbnail ? `<img src="${post.thumbnail}" alt="${post.title}" class="post-thumbnail">` : ''}
          <div class="blog-header">
            <h3 class="blog-title">${post.title}</h3>
            <span class="blog-category">${post.category}</span>
          </div>
          <div class="blog-content">
            <p class="blog-text">${post.content}</p>
          </div>
          <div class="blog-footer">
            <div class="blog-actions">
              <button class="like-btn" onclick="toggleLike(${post.id}, true)">
                <span class="material-symbols-outlined">thumb_up</span>
                <span class="like-count">${post.likes}</span>
              </button>
              <button class="delete-btn" onclick="deleteUserPost(${post.id})">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
            <span class="blog-date">Posted on ${post.date}</span>
          </div>
          <div class="comments-section">
            <h4>Comments (${post.comments.length})</h4>
            <div class="comment-list">
              ${post.comments.map(comment => `
                <div class="comment">
                  <div class="comment-avatar">${comment.author.charAt(0)}</div>
                  <div class="comment-content">
                    <div class="comment-author">${comment.author}</div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-date">${comment.date}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <form class="comment-form" onsubmit="addCommentToPost(event, ${post.id})">
              <input type="text" placeholder="Add a comment..." required>
              <button type="submit">Post</button>
            </form>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Handle post form submission
const postForm = document.getElementById('post-form');
if (postForm) {
  postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('post-title').value;
    const category = document.getElementById('post-category').value;
    const content = document.getElementById('post-content').value;
    const imageInput = document.getElementById('post-image');
    
    // Create thumbnail from uploaded image or use placeholder
    let thumbnail = 'https://via.placeholder.com/300x150?text=Blog+Image';
    if (imageInput.files && imageInput.files[0]) {
      thumbnail = URL.createObjectURL(imageInput.files[0]);
    }
    
    const newPost = {
      id: Date.now(),
      title,
      content,
      category,
      thumbnail,
      author: {
        name: "You",
        avatar: "https://via.placeholder.com/50?text=Y"
      },
      date: new Date().toLocaleDateString(),
      likes: 0,
      comments: [],
      isUserPost: true
    };
    
    userPosts.unshift(newPost); // Add new post at beginning
    renderUserPosts();
    
    // Reset form
    this.reset();
    
    // Scroll to the user posts section
    document.getElementById('user-posts-section').scrollIntoView({ behavior: 'smooth' });
  });
}

// Toggle like on a post
function toggleLike(postId, isUserPost = false) {
  const postsArray = isUserPost ? userPosts : blogs;
  const post = postsArray.find(p => p.id === postId);
  
  if (post) {
    post.likes += post.isLiked ? -1 : 1;
    post.isLiked = !post.isLiked;
    
    if (isUserPost) {
      renderUserPosts();
    } else {
      renderBlogs();
    }
  }
}

// Toggle comments visibility
function toggleComments(postId) {
  const commentsSection = document.getElementById(`comments-${postId}`);
  if (commentsSection) {
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
  }
}

// Add comment to main blog post
function addComment(event, postId) {
  event.preventDefault();
  const input = event.target.querySelector('input');
  const commentText = input.value.trim();
  
  if (commentText) {
    const post = blogs.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        id: Date.now(),
        author: "You",
        text: commentText,
        date: new Date().toLocaleDateString()
      });
      renderBlogs();
      input.value = '';
    }
  }
}

// Add comment to user post
function addCommentToPost(event, postId) {
  event.preventDefault();
  const input = event.target.querySelector('input');
  const commentText = input.value.trim();
  
  if (commentText) {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        id: Date.now(),
        author: "You",
        text: commentText,
        date: new Date().toLocaleDateString()
      });
      renderUserPosts();
      input.value = '';
    }
  }
}

// Delete user post
function deleteUserPost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    userPosts = userPosts.filter(post => post.id !== postId);
    renderUserPosts();
  }
}

// Search & Filter
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = blogs.filter(blog => 
      blog.title.toLowerCase().includes(term) || 
      blog.excerpt.toLowerCase().includes(term)
    );
    renderBlogs(filtered);
  });
}

const categoryFilter = document.getElementById('category-filter');
if (categoryFilter) {
  categoryFilter.addEventListener('change', (e) => {
    const category = e.target.value;
    const filtered = category === 'all' ? blogs : blogs.filter(blog => blog.category === category);
    renderBlogs(filtered);
  });
}

// Newsletter
function subscribe() {
  const emailInput = document.getElementById('email');
  if (emailInput) {
    const email = emailInput.value;
    if (email) {
      alert(`Thanks for subscribing, ${email}!`);
      emailInput.value = "";
    }
  }
}

// Chatbot functionality remains unchanged
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = fileUploadWrapper.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");
const API_KEY = "AIzaSyAsFnYr7crXT1OdkuCFdbblMZDTLlG6sIk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");
  chatHistory.push({
    role: "user",
    parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
  });
  
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: chatHistory,
    }),
  };
  
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerText = apiResponseText;
    chatHistory.push({
      role: "model",
      parts: [{ text: apiResponseText }],
    });
  } catch (error) {
    console.log(error);
    messageElement.innerText = error.message;
    messageElement.style.color = "#ff0000";
  } finally {
    userData.file = {};
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  messageInput.value = "";
  messageInput.dispatchEvent(new Event("input"));
  fileUploadWrapper.classList.remove("file-uploaded");
  
  const messageContent = `<div class="message-text"></div>
                          ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;
  const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
  outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  
  setTimeout(() => {
    const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path
              d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"/></svg>
          <div class="message-text">
            <div class="thinking-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>`;
    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse(incomingMessageDiv);
  }, 600);
};

messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && !e.shiftKey && userMessage && window.innerWidth > 768) {
    handleOutgoingMessage(e);
  }
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    fileInput.value = "";
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64String = e.target.result.split(",")[1];
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };
  };
  reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

const picker = new EmojiMart.Picker({
  theme: "light",
  skinTonePosition: "none",
  previewPosition: "none",
  onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  },
});
document.querySelector(".chat-form").appendChild(picker);
sendMessage.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderBlogs();
  renderUserPosts();
  
  // Initialize emoji picker with correct theme
  const picker = document.querySelector('.chat-form em-emoji-picker');
  if (picker) {
    picker.setAttribute('theme', document.body.dataset.theme === 'dark' ? 'dark' : 'light');
  }
});
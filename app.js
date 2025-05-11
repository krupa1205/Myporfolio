import { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert('Error submitting form');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" required 
             onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <input type="email" name="email" placeholder="Email" required 
             onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <input type="tel" name="phone" placeholder="Phone" 
             onChange={(e) => setFormData({...formData, phone: e.target.value})} />
      <textarea name="message" placeholder="Message" required 
                onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
      <button type="submit">Send Message</button>
    </form>
  );
}
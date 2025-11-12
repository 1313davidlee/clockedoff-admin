// apps/blog/pages/edit/add.js
import { useState } from 'react';
import { useRouter } from 'next/router';

const emptyPost = {
  title: '',
  subtitle: '',
  summary: '',
  category: '',
  lead_art: '',
  date: '',
  dark_mode: false,
  post_type: 'photojournal',
  content: [],
};

export default function AddPostPage() {
  const router = useRouter();
  const [post, setPost] = useState(structuredClone(emptyPost));
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhotoChange = (index, e) => {
    const { name, value } = e.target;
    setPost((prev) => {
      const updatedContent = [...(prev.content || [])];
      updatedContent[index] = {
        ...updatedContent[index],
        [name]: value,
      };
      return { ...prev, content: updatedContent };
    });
  };

  const addPhoto = () => {
    setPost((prev) => ({
      ...prev,
      content: [...(prev.content || []), { url: '', caption: '' }],
    }));
  };

  const removePhoto = (index) => {
    setPost((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/add-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to create post');
      }

      const { id } = await res.json();
      alert('Post created!');
      router.push(`/blog/edit/${id}`).catch(() => {});
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-black)]">Create New Post</h2>
        <button type="submit" className="admin-button">
          Publish Post
        </button>
      </div>
      {error && <p className="text-[var(--color-red)] mb-4">Error: {error}</p>}

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <label className="admin-label">
          Title
          <input name="title" value={post.title} onChange={handleChange} placeholder="Title" className="admin-input" required />
        </label>
        <label className="admin-label">
          Subtitle
          <input name="subtitle" value={post.subtitle} onChange={handleChange} placeholder="Subtitle" className="admin-input" />
        </label>
        <label className="admin-label">
          Summary
          <input name="summary" value={post.summary} onChange={handleChange} placeholder="Summary" className="admin-input" />
        </label>
        <label className="admin-label">
          Category
          <input name="category" value={post.category} onChange={handleChange} placeholder="Category" className="admin-input" />
        </label>
        <label className="admin-label">
          Lead Image ID
          <input name="lead_art" value={post.lead_art} onChange={handleChange} placeholder="Lead Image ID" className="admin-input" />
        </label>
        <label className="admin-label">
          Date
          <input name="date" value={post.date} onChange={handleChange} placeholder="Date" className="admin-input" />
        </label>
        <label className="admin-label">
          Post Type
          <select name="post_type" value={post.post_type} onChange={handleChange} className="admin-select">
            <option value="standard">Standard</option>
            <option value="photojournal">Photojournal</option>
            <option value="essay">Essay</option>
            <option value="banner">Banner</option>
          </select>
        </label>
        <label className="flex items-center gap-3 text-xs uppercase tracking-[0.3em]">
          <span>Dark Mode</span>
          <input type="checkbox" name="dark_mode" checked={post.dark_mode} onChange={handleChange} className="w-4 h-4 border-2 border-[var(--color-black)]" />
        </label>
      </div>

      <h3 className="text-xl font-bold mb-4 text-[var(--color-black)]">Images</h3>
      <div className="admin-photo-grid">
        {post.content?.map((photo, index) => {
          const imagePath = photo?.url ? `https://photos.smugmug.com/photos/i-${photo?.url}/0/X5/i-${photo?.url}-X5.jpg` : null;
          return (
            <div key={index} className="admin-photo-card">
              <label className="admin-label">
                Photo ID
                <input
                  name="url"
                  value={photo?.url}
                  onChange={(e) => handlePhotoChange(index, e)}
                  placeholder="Image ID"
                  className="admin-input"
                />
              </label>
              {imagePath && <img src={imagePath} alt="preview" className="w-full h-48 object-cover border-2 border-[var(--color-black)] rounded-lg mt-3" />}
              <label className="admin-label mt-4">
                Caption
                <textarea
                  name="caption"
                  value={photo?.caption}
                  onChange={(e) => handlePhotoChange(index, e)}
                  placeholder="Caption"
                  className="admin-textarea"
                />
              </label>
              <button type="button" onClick={() => removePhoto(index)} className="admin-button secondary mt-4 w-full">
                Remove Photo
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mb-4">
        <button type="button" onClick={addPhoto} className="admin-button secondary w-full">
          + Add Photo
        </button>
      </div>
      <button type="submit" className="admin-button w-full">
        Create Post
      </button>
    </form>
  );
}

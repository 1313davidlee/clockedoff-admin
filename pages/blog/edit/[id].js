// apps/blog/pages/edit/[id].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getPostById } from '../../../lib/posts';

export async function getServerSideProps({ params }) {
  try {
    const postData = await getPostById(params.id);
    return { props: { initialPost: postData, id: params.id } };
  } catch (error) {
    return { notFound: true };
  }
}

export default function EditPostPage({ initialPost, id }) {
  const router = useRouter();
  const [post, setPost] = useState(initialPost);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhotoChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContent = [...post.content];
    updatedContent[index][name] = value;
    setPost((prev) => ({ ...prev, content: updatedContent }));
  };

  const addPhoto = () => {
    setPost((prev) => ({
      ...prev,
      content: [...prev.content, { url: '', caption: '' }],
    }));
  };

  const removePhoto = (index) => {
    const updatedContent = post.content.filter((_, i) => i !== index);
    setPost((prev) => ({ ...prev, content: updatedContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/edit-post`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, id }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to update post');
      }
      alert("nice babe")
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const confirmation = window.prompt('Type "delete" to permanently remove this post.');
    if (confirmation?.toLowerCase() !== 'delete') {
      alert('Deletion cancelled.');
      return;
    }

    try {
      setDeleting(true);
      const res = await fetch('/api/delete-post', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to delete post');
      }

      alert('Post deleted.');
      router.push('/blog/edit').catch(() => {});
    } catch (err) {
      setDeleting(false);
      alert(err.message);
    }
  };

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <h2 className="text-2xl font-bold text-[var(--color-black)]">Edit “{post.title || 'Post'}”</h2>
        <button type="submit" className="admin-button">
          Update Post
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <label className="admin-label">
          Title
          <input name="title" value={post.title} onChange={handleChange} placeholder="Title" className="admin-input" />
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

      <div className="flex gap-4 mb-6">
        <button type="button" onClick={addPhoto} className="admin-button secondary w-full">
          + Add Photo
        </button>
      </div>
      <button type="button" onClick={handleDelete} disabled={deleting} className="admin-button w-full">
        {deleting ? 'Deleting…' : 'Delete Post'}
      </button>
    </form>
  );
}

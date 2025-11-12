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

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '80%', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Edit “{post.title || 'Post'}”</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <label>
          Title
          <input name="title" value={post.title} onChange={handleChange} placeholder="Title" style={{ width: '100%', padding: '0.5rem' }} />
        </label>
        <label>
          Subtitle
          <input name="subtitle" value={post.subtitle} onChange={handleChange} placeholder="Subtitle" style={{ width: '100%', padding: '0.5rem' }} />
        </label>
        <label>
          Summary
          <input name="summary" value={post.summary} onChange={handleChange} placeholder="Summary" style={{ width: '100%', padding: '0.5rem' }} />
        </label>
        <label>
          Category
          <input name="category" value={post.category} onChange={handleChange} placeholder="Category" style={{ width: '100%', padding: '0.5rem' }} />
        </label>
        <label>
          Lead Image ID
          <input name="lead_art" value={post.lead_art} onChange={handleChange} placeholder="Lead Image ID" style={{ width: '100%', padding: '0.5rem' }} />
        </label>
        <label>
          Date
          <input name="date" value={post.date} onChange={handleChange} placeholder="Date" style={{ width: '100%', padding: '0.5rem' }} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" name="dark_mode" checked={post.dark_mode} onChange={handleChange} /> Enable dark mode
        </label>
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Images</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {post.content?.map((photo, index) => {
          const imagePath = photo?.url ? `https://photos.smugmug.com/photos/i-${photo?.url}/0/X5/i-${photo?.url}-X5.jpg` : null;
          return (
            <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{flexDirection: 'column'}}>
              <label style={{ marginBottom: '0.5rem' }}>Photo ID:</label>
                <input
                  name="url"
                  value={photo?.url}
                  onChange={(e) => handlePhotoChange(index, e)}
                  placeholder="Image ID"
                  style={{ width: '50%', marginLeft: '0.5rem', padding: '0.5rem' }}
                />
                </div>
              {imagePath && <img src={imagePath} alt="preview" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '4px' }} />}
              <label style={{ marginTop: '0.5rem' }}>
                <textarea
                  name="caption"
                  value={photo?.caption}
                  onChange={(e) => handlePhotoChange(index, e)}
                  placeholder="Caption"
                  rows={5}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                />
              </label>
              <button type="button" onClick={() => removePhoto(index)} style={{ color: 'red', border: 'none', background: 'transparent', cursor: 'pointer', marginTop: '0.5rem' }}>× Remove</button>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button type="button" onClick={addPhoto} style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}>+ Add New Photo</button>
        <button type="submit" style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}>Update Post</button>
      </div>
    </form>
  );
}
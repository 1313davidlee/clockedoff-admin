import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end();

  const { id, title, subtitle, summary, content, category, lead_art, post_type, date, dark_mode, secret } = req.body;

  if (!id) return res.status(400).json({ error: 'Post ID is required' });

  try {
    const postRef = db.collection('posts').doc(id);
    const doc = await postRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedData = {
        title,
        subtitle,
        summary,
        content,
        category,
        lead_art,
        post_type,
        date,
        dark_mode,
        updated: new Date(),
      };
      
      // Remove undefined fields
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key] === undefined) {
          delete updatedData[key];
        }
      });
      console.log('hello?')
      await postRef.update(updatedData);
      res.status(200).json({ message: 'Post updated successfully' });
      
  } catch (e) {
    res.status(500).json({ error: 'Failed to update post', details: e.message });
  }
}

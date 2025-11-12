import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const { id } = req.body ?? {};

  if (!id) {
    return res.status(400).json({ error: 'Post ID is required' });
  }

  try {
    const docRef = db.collection('posts').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await docRef.delete();
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete post', details: error.message });
  }
}

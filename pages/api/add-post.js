import db from '../../lib/db'


export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { title, subtitle, summary, content, category, lead_art, post_type, date, dark_mode, secret } = req.body;

  // 🔐 Simple access gate — change 'yourpassword' to your real admin password
  /*if (secret !== process.env.ADMIN_POST_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }*/

  try {
    const doc = await db.collection('posts').add({
      title,
      subtitle,
      summary,
      content,
      category,
      lead_art,
      post_type,
      date,
      dark_mode,
      created: new Date()
    });

    res.status(200).json({ id: doc.id });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create post', details: e.message });
  }
}

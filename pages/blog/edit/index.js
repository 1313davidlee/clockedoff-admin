import { useRouter } from 'next/router'
import { getPosts } from '../../../lib/posts'

export async function getStaticProps() {
  const recentPosts = await getPosts()
  return {
    props: {
      recentPosts,
    },
    revalidate: 60,
  }
}

export default function EditIndex({ recentPosts }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--color-cream)] py-16 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto admin-surface p-8">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h2 className="text-3xl font-bold text-[var(--color-black)] uppercase tracking-tight">Manage Posts</h2>
          <button
            onClick={() => router.push('/blog/edit/add')}
            className="admin-button text-sm"
          >
            + New Post
          </button>
        </div>
        <p className="text-sm text-[var(--color-black)]/70 mb-6">Select an existing post to edit or create a new one.</p>

        {recentPosts?.length === 0 ? (
          <p className="text-[var(--color-black)]/70">No posts found.</p>
        ) : (
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <button
                  onClick={() => router.push(`/blog/edit/${post.id}`)}
                  className="w-full text-left px-5 py-3 border-2 border-[var(--color-black)] rounded-lg hover:bg-[var(--color-blue)] transition text-[var(--color-black)] font-semibold uppercase tracking-wide"
                >
                  {post.title || 'Untitled Post'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

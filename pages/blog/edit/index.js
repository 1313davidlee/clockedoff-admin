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
    <div className="min-h-screen bg-gray-50 py-16 px-6 sm:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Posts</h2>
          <button
            onClick={() => router.push('/blog/edit/add')}
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            + New Post
          </button>
        </div>
        <p className="text-gray-600 mb-4">Select an existing post to edit or create a new one.</p>

        {recentPosts?.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <button
                  onClick={() => router.push(`/blog/edit/${post.id}`)}
                  className="w-full text-left px-5 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-gray-800 font-medium"
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

import Link from 'next/link'

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <AdminTile title="Recipes" href="/admin/recipes" />
          <AdminTile title="Blog" href="/blog/edit" />
        </div>
      </div>
    </div>
  )
}



function AdminTile({ title, href }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between min-h-[220px]">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2>
        <p className="text-gray-600 text-sm">Manage {title.toLowerCase()} content and settings.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={href}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition whitespace-nowrap"
        >
          View
        </Link>
        <Link
          href={`${href}/add`}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition whitespace-nowrap"
        >
          Create
        </Link>
      </div>
    </div>
  )
}

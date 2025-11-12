import Link from 'next/link'

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-[var(--color-black)] uppercase tracking-tight">ClockedOff Admin</h1>
        <div className="admin-divider mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AdminTile title="Recipes" href="/admin/recipes" />
          <AdminTile title="Blog" href="/blog/edit" />
        </div>
      </div>
    </div>
  )
}



function AdminTile({ title, href }) {
  return (
    <div className="admin-surface p-6 flex flex-col justify-between min-h-[220px] bg-white">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-black)] uppercase tracking-tight">{title}</h2>
        <p className="text-sm text-[var(--color-black)]/70">Manage {title.toLowerCase()} content and settings.</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href={href} className="admin-button text-sm">
          View
        </Link>
        <Link href={`${href}/add`} className="admin-button secondary text-sm">
          Create
        </Link>
      </div>
    </div>
  )
}

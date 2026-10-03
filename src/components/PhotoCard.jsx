function fallbackImage(photoId) {
  return `https://picsum.photos/seed/${photoId}/640/420`;
}

export default function PhotoCard({ photo, onViewDetails }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={photo.url}
          alt={photo.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage(photo.id);
          }}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
            Photo ID: {photo.id}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Album ID: {photo.albumId}
          </span>
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold capitalize leading-5 text-slate-800 dark:text-slate-100">
          {photo.title}
        </h3>

        <button
          type="button"
          onClick={() => onViewDetails(photo)}
          className="mt-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

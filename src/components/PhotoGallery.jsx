import { useEffect, useMemo, useState } from "react";
import PhotoCard from "./PhotoCard";

const PHOTOS_URL = "https://jsonplaceholder.typicode.com/photos";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [albumFilter, setAlbumFilter] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPhotos() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(PHOTOS_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch photos (${response.status})`);
        }

        const data = await response.json();
        setPhotos(data.slice(0, 100));
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        setError(err.message || "Something went wrong while fetching photos.");
      } finally {
        setLoading(false);
      }
    }

    loadPhotos();

    return () => controller.abort();
  }, []);

  const albumIds = useMemo(() => {
    const unique = [...new Set(photos.map((photo) => photo.albumId))];
    return unique.sort((a, b) => a - b);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLowerCase();

    return photos.filter((photo) => {
      const matchesSearch =
        query === "" ||
        photo.title.toLowerCase().includes(query) ||
        String(photo.id).includes(query) ||
        String(photo.albumId).includes(query);

      const matchesAlbum =
        albumFilter === "all" || String(photo.albumId) === albumFilter;

      return matchesSearch && matchesAlbum;
    });
  }, [photos, search, albumFilter]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, photo ID, or album ID"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-500 transition focus:border-indigo-400 focus:bg-white focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
          />
        </label>

        <label className="w-full sm:w-52">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Album Filter
          </span>
          <select
            value={albumFilter}
            onChange={(event) => setAlbumFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-500 transition focus:border-indigo-400 focus:bg-white focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
          >
            <option value="all">All albums</option>
            {albumIds.map((albumId) => (
              <option key={albumId} value={albumId}>
                Album {albumId}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && (
        <p className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
          Loading photos with fetch()...
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredPhotos.length} of {photos.length} photos
          </p>

          {filteredPhotos.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No photos match your search or album filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onViewDetails={setSelectedPhoto}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-details-title"
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = `https://picsum.photos/seed/${selectedPhoto.id}/900/560`;
              }}
              className="h-64 w-full object-cover sm:h-72"
            />
            <div className="space-y-3 p-5">
              <h2
                id="photo-details-title"
                className="text-lg font-semibold capitalize text-slate-900 dark:text-white"
              >
                {selectedPhoto.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Photo ID: {selectedPhoto.id}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Album ID: {selectedPhoto.albumId}
              </p>
              <p className="break-all text-sm text-slate-500 dark:text-slate-400">
                API URL: {selectedPhoto.url}
              </p>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

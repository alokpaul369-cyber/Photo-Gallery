export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6 lg:px-8">
        <p>© {year} Photo Gallery. Built with React + Vite.</p>
        <p>
          Data from{" "}
          <a
            href="https://jsonplaceholder.typicode.com/photos"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            JSONPlaceholder Photos API
          </a>
        </p>
      </div>
    </footer>
  );
}

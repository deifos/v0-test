export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-4 bottom-0 z-50 border-t border-t-slate-200">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Built by{" "}
          <a
            href="https://x.com/deifosv"
            className="underline hover:text-gray-900 dark:hover:text-gray-200"
          >
            vlad
          </a>
        </p>
        <p>
          Follow me on X{" "}
          <a
            href="https://x.com/florinpop1705/status/1834645096567869538"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900 dark:hover:text-gray-200"
          >
            @deifosv
          </a>
        </p>
      </div>
    </footer>
  );
}

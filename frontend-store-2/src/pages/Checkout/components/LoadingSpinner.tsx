export function LoadingSpinner() {
  return (
    <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-white/60">
      <div className="flex h-24 w-24 items-center justify-center rounded-md border border-gray-200 bg-white shadow-o-md">
        <span className="loader"></span>
      </div>
    </div>
  );
}

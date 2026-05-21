const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function ContinueWithFacebook() {
  return (
    <a
      href={`${API_URL}/auth/facebook`}
      className="flex w-full items-center justify-center gap-3 rounded-md bg-[#1877F2] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#166FE5]"
    >
      <FacebookMark className="h-4 w-4" />
      Continue with Facebook
    </a>
  );
}

function FacebookMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

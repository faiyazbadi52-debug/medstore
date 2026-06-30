@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; }
  body {
    font-family: "Inter", system-ui, sans-serif;
    @apply bg-gray-50 text-gray-900 antialiased;
  }
  h1, h2, h3, h4 { @apply font-semibold; }
}

@layer components {
  .btn-primary {
    @apply bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-xl
           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
           active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2;
  }
  .btn-secondary {
    @apply bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium
           px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95
           focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2;
  }
  .btn-danger {
    @apply bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-xl
           transition-all duration-200 disabled:opacity-50 active:scale-95
           focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2;
  }
  .input {
    @apply w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900
           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
           placeholder:text-gray-400 transition-all duration-200 bg-white;
  }
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-5;
  }
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
}

/* Smooth scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { @apply bg-gray-100; }
::-webkit-scrollbar-thumb { @apply bg-gray-300 rounded-full; }

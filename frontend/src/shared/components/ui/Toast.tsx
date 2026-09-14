type ToastProps = {
    message: string;
  };
  
  export function Toast({ message }: ToastProps) {
    return (
      <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl border border-violet-500/30 bg-zinc-900/95 px-5 py-4 text-white shadow-2xl shadow-violet-900/30 backdrop-blur-xl">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/15 text-green-400">
          ✓
        </span>
  
        <span className="text-sm font-medium">
          {message}
        </span>
      </div>
    );
  }
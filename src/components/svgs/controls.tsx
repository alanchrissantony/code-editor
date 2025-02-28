export function RunCodeIcon(){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>
    )
}

export function PreviewCodeIcon(){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#666"><path d="M600-120q-33 0-56.5-23.5T520-200v-560q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H600Zm-400 0q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v560q0 33-23.5 56.5T360-120H200Zm0-640v560h160v-560H200Z"/></svg>
    )
}

export const Spinner = () => (
    <svg
      className="animate-spin h-6 w-6 text-gray-200"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  );
  
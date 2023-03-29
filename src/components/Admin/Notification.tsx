interface NotificationProps {
  code: number;
  notice: string;
  width?: string;
  height?: string;
}

export default function Notification({
  code,
  notice,
  width,
  height,
}: NotificationProps) {
  const styles = {
    6899: {
      className: "border-2 border-bad bg-[#FCEDE9]",
      Icon: (
        <svg
          viewBox="0 0 512 512"
          fill="currentColor"
          height="100%"
          width="100%"
          className="text-bad"
        >
          <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0 0 114.6 0 256s114.6 256 256 256zm-81-337c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
        </svg>
      ),
    },
    6900: {
      className: "border-2 border-neutral bg-[#F7EBD8]",
      Icon: (
        <svg
          viewBox="0 0 1024 1024"
          fill="currentColor"
          height="100%"
          width="100%"
          className="text-neutral"
        >
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
        </svg>
      ),
    },
    6901: {
      className: "border-2 border-good bg-[#D3EEDA]",
      Icon: (
        <svg
          viewBox="0 0 1024 1024"
          fill="currentColor"
          height="100%"
          width="100%"
          className="text-good"
        >
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" />
        </svg>
      ),
    },
  };

  if (code != 6899 && code != 6900 && code != 6901) return <></>;
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border-2 p-2 text-[#434D54] h-[${
        height ?? "60px"
      }] w-[${width ?? "full"}] ${styles[code].className}`}
    >
      <div className="h-full">{styles[code].Icon}</div>
      <div>{notice}</div>
    </div>
  );
}

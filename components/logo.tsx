export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 10L30 30H10L20 10Z" className="fill-primary" />
      <path
        d="M40 20C40 25.5228 35.5228 30 30 30C24.4772 30 20 25.5228 20 20C20 14.4772 24.4772 10 30 10C35.5228 10 40 14.4772 40 20Z"
        className="fill-primary/80"
      />
      <text x="45" y="25" className="fill-foreground text-[12px] font-bold">
        VERIFY
      </text>
    </svg>
  )
}


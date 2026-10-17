export default function Label({ n, children, className = "" }: { n: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`label t-meta ${className}`} data-fade>
      <span>({n})</span>
      <span>—</span>
      <span>{children}</span>
    </p>
  );
}

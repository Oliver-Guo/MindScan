export default function Navbar() {
  return (
    <nav className="border-b border-border/50 bg-mindscan-surface/80 backdrop-blur sticky top-0 z-10">
      <div className="container mx-auto flex h-14 items-center px-4">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-mindscan-emotion">Mind</span>
          <span className="text-mindscan-detection">Scan</span>
          <span className="text-foreground/70 ml-1 text-sm font-normal">AI</span>
        </span>
      </div>
    </nav>
  )
}

import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface-toolbar/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
            3D
          </div>
          <span className="text-lg font-semibold text-text-primary group-hover:text-accent-primary-hover transition-colors duration-150">
            WebGL Learn
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="https://threejs.org/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary hover:text-accent-cyan transition-colors duration-150 hidden sm:inline"
          >
            Three.js 文档
          </a>
        </div>
      </div>
    </nav>
  );
}
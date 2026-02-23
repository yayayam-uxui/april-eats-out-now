import { PitchNavBar } from './PitchNavBar';

interface PitchLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  fullWidth?: boolean;
}

export function PitchLayout({ children, sidebar, rightSidebar, fullWidth }: PitchLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F3F2EE]">
      <PitchNavBar />
      <div className="pt-14">
        {fullWidth ? (
          <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 py-6 grid gap-4" style={{ gridTemplateColumns: sidebar ? '220px 1fr' : rightSidebar ? '1fr 300px' : '1fr' }}>
            {sidebar && <aside className="hidden md:block">{sidebar}</aside>}
            <main className="min-w-0">{children}</main>
            {rightSidebar && <aside className="hidden lg:block">{rightSidebar}</aside>}
          </div>
        )}
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';

const COLORS: Record<string, string> = {
  N: 'bg-emerald-500',
  B: 'bg-sky-500',
  F: 'bg-amber-500',
  C: 'bg-violet-500',
  S: 'bg-rose-500',
  D: 'bg-teal-500',
  L: 'bg-orange-500',
  A: 'bg-indigo-500',
  R: 'bg-pink-500',
  M: 'bg-cyan-500',
};

function getColor(name: string) {
  return COLORS[name.charAt(0).toUpperCase()] ?? 'bg-[#0A66C2]';
}

interface StartupAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  logoUrl?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-24 h-24 text-3xl',
};

export function StartupAvatar({ name, size = 'md', logoUrl, className }: StartupAvatarProps) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={cn('rounded-full object-cover border-2 border-white', sizeMap[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-bold border-2 border-white shrink-0',
        getColor(name),
        sizeMap[size],
        className
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Layers, AlignLeft, Variable, GitCommit, PlayCircle } from 'lucide-react';
import clsx from 'clsx';

const icons = {
  1: AlignLeft,
  2: Layers,
  3: Variable,
  4: GitCommit,
  5: PlayCircle,
};

const gradients = {
  1: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
  2: 'from-purple-500/20 to-pink-500/20 border-purple-500/50',
  3: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/50',
  4: 'from-orange-500/20 to-amber-500/20 border-orange-500/50',
  5: 'from-rose-500/20 to-red-500/20 border-rose-500/50',
};

export default function ModuleNode({ data }: { data: any }) {
  const Icon = icons[data.step as keyof typeof icons] || AlignLeft;
  const gradientClass = gradients[data.step as keyof typeof gradients] || gradients[1];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: data.isActive ? 1.1 : 1, opacity: data.isDimmed ? 0.4 : 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={clsx(
        'relative px-6 py-4 shadow-2xl rounded-2xl bg-neutral-900/80 backdrop-blur-xl border-2 min-w-[300px] transition-all duration-300',
        data.isActive ? 'ring-4 ring-white/50 z-50 ' + gradientClass :
          data.isDimmed ? 'grayscale border-neutral-800 bg-neutral-900/40' :
            gradientClass
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-neutral-300 border-2 border-neutral-900 !rounded-full"
      />

      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-white/10 text-white backdrop-blur-sm shadow-inner shadow-white/10">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-1">
            Module {data.step}
          </span>
          <h3 className="text-lg font-semibold text-white leading-tight">
            {data.label}
          </h3>
          {data.description && (
            <p className="mt-2 text-sm text-neutral-400">
              {data.description}
            </p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-neutral-300 border-2 border-neutral-900 !rounded-full"
      />
    </motion.div>
  );
}

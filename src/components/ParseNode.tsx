import { Handle, Position } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function ParseNode({ data }: { data: any }) {
    // data.label: Grammar symbol
    // data.value: Computed attribute (if active)
    // data.isActive: bool (is it currently evaluated?)
    // data.isEvaluated: bool (has it been evaluated?)

    return (
        <div
            className={clsx(
                'relative px-4 py-2 min-w-[80px] min-h-[50px] flex items-center justify-center text-center shadow-2xl rounded-xl border-2 transition-all duration-300',
                data.isActive ? 'bg-indigo-600 border-indigo-500 shadow-indigo-500/50 scale-110 z-50' :
                    data.isEvaluated ? 'bg-emerald-900/40 border-emerald-500/50' :
                        'bg-neutral-900/80 border-neutral-700'
            )}
        >
            <Handle type="target" position={Position.Top} className="opacity-0" />

            <div className="flex flex-col items-center justify-center">
                <span className={clsx(
                    "text-xl font-bold transition-colors",
                    data.isActive ? "text-white" : "text-neutral-200"
                )}>
                    {data.label}
                </span>

                <AnimatePresence>
                    {data.isEvaluated && data.value !== undefined && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="text-sm mt-1 font-mono font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50 truncate max-w-full"
                        >
                            val = {data.value}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
}

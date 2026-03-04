import ParseTreeVisualizer from '@/components/ParseTreeVisualizer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ParseTreePage() {
    return (
        <main className="w-full h-screen bg-neutral-950 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 w-full p-6 z-10 flex items-center justify-between pointer-events-none">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 pointer-events-auto">
                        Annotated Parse Tree
                    </h1>
                    <p className="text-neutral-400 mt-1 font-medium pointer-events-auto">
                        Synthesized Attribute Evaluation for Arithmetic Expressions
                    </p>
                </div>

                <Link
                    href="/"
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-full border border-neutral-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Modules
                </Link>
            </div>

            <div className="flex-1 w-full pt-20">
                <ParseTreeVisualizer />
            </div>
        </main>
    );
}

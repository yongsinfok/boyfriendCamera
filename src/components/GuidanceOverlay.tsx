import React from 'react';
import { Guidance } from '../utils/compositionLogic';

interface GuidanceOverlayProps {
    guidance: Guidance;
    debugInfo?: string;
}

const GuidanceOverlay: React.FC<GuidanceOverlayProps> = ({ guidance, debugInfo }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4">
            {/* Top Bar - Debug Info or Settings */}
            <div className="w-full flex justify-between items-start">
                <div className="bg-black/50 text-white text-xs p-1 rounded">
                    {debugInfo}
                </div>
            </div>

            {/* Center Grid - Rule of Thirds */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className={`
                                border-white/20 
                                ${i < 3 ? 'border-b' : ''} 
                                ${i >= 6 ? 'border-t' : ''}
                                ${(i % 3) !== 2 ? 'border-r' : ''}
                                flex items-center justify-center
                                transition-all duration-300
                                ${guidance.targetGridIndex === i ? 'bg-green-500/20 shadow-[inset_0_0_20px_rgba(34,197,94,0.3)]' : ''}
                            `}
                        >
                            {guidance.targetGridIndex === i && (
                                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Guidance Message */}
            <div className="w-full flex flex-col items-center mb-10">
                <div className={`text-2xl font-bold drop-shadow-md ${guidance.color} bg-black/60 px-4 py-2 rounded-full transition-all duration-300`}>
                    {guidance.text}
                </div>
            </div>
        </div>
    );
};

export default GuidanceOverlay;

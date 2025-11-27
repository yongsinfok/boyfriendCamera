'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useObjectDetection } from '../hooks/useObjectDetection';
import { analyzeComposition, Guidance } from '../utils/compositionLogic';
import GuidanceOverlay from './GuidanceOverlay';

const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: "environment"
};

const CameraView: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const { detect, predictions, isLoading } = useObjectDetection();
    const [guidance, setGuidance] = useState<Guidance>({ text: 'Initializing AI...', color: 'text-white' });
    const [debugStr, setDebugStr] = useState('');
    const [zoom, setZoom] = useState(1);
    const [zoomCap, setZoomCap] = useState<{ min: number, max: number } | null>(null);

    const runDetection = useCallback(async () => {
        if (
            webcamRef.current &&
            webcamRef.current.video &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            await detect(video);

            // Analyze composition
            const newGuidance = analyzeComposition(predictions, videoWidth, videoHeight);
            setGuidance(newGuidance);

            // Debug info
            setDebugStr(`Obj: ${predictions.length} | ${predictions[0]?.score.toFixed(2) || 0}`);
        }
    }, [detect, predictions]);

    useEffect(() => {
        const interval = setInterval(() => {
            runDetection();
        }, 100); // Run every 100ms (~10fps)
        return () => clearInterval(interval);
    }, [runDetection]);

    const setZoomLevel = async (level: number) => {
        if (!webcamRef.current || !webcamRef.current.video) return;
        const stream = webcamRef.current.video.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];

        try {
            await track.applyConstraints({
                advanced: [{ zoom: level } as any]
            } as any);
            setZoom(level);
        } catch (e) {
            console.error("Zoom failed", e);
        }
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black text-white">
                    Loading AI Model...
                </div>
            )}

            <Webcam
                ref={webcamRef}
                audio={false}
                className="absolute inset-0 w-full h-full object-cover"
                videoConstraints={videoConstraints}
                playsInline
                muted
                onUserMedia={(stream) => {
                    const track = stream.getVideoTracks()[0];
                    const capabilities = track.getCapabilities() as any;
                    if (capabilities.zoom) {
                        setZoomCap({ min: capabilities.zoom.min, max: capabilities.zoom.max });
                    }
                }}
            />

            <GuidanceOverlay guidance={guidance} debugInfo={debugStr} />

            {/* Zoom Controls */}
            {zoomCap && (
                <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4 z-30">
                    {[0.5, 1, 2, 3].map(z => {
                        if (z < zoomCap.min || z > zoomCap.max) return null;
                        return (
                            <button
                                key={z}
                                onClick={() => setZoomLevel(z)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border ${zoom === z ? 'bg-yellow-500/80 border-yellow-300 text-black' : 'bg-black/40 border-white/30 text-white'} font-bold transition-all`}
                            >
                                {z}x
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default CameraView;

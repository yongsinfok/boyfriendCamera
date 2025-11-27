import { useEffect, useState, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export interface Detection {
    bbox: [number, number, number, number];
    class: string;
    score: number;
}

export const useObjectDetection = () => {
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const [predictions, setPredictions] = useState<Detection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const loadedModel = await cocoSsd.load({
                    base: 'lite_mobilenet_v2' // Use a lighter model for mobile performance
                });
                setModel(loadedModel);
                setIsLoading(false);
            } catch (err) {
                console.error('Failed to load model', err);
                setIsLoading(false);
            }
        };
        loadModel();
    }, []);

    const detect = async (video: HTMLVideoElement) => {
        if (model && video.readyState === 4) {
            const results = await model.detect(video);
            // Filter for 'person' class only as that's our main subject
            const personDetections = results.filter(p => p.class === 'person');
            setPredictions(personDetections);
        }
    };

    return { model, predictions, detect, isLoading };
};

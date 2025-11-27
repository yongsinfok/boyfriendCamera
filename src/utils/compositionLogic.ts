import { Detection } from '../hooks/useObjectDetection';

export type Guidance = {
    text: string;
    icon?: 'move-left' | 'move-right' | 'move-up' | 'move-down' | 'zoom-in' | 'zoom-out' | 'perfect';
    color: string;
};

export const analyzeComposition = (
    predictions: Detection[],
    videoWidth: number,
    videoHeight: number
): Guidance => {
    if (predictions.length === 0) {
        return { text: 'Looking for subject...', color: 'text-yellow-400' };
    }

    // Assume the largest person is the main subject
    const subject = predictions.reduce((prev, current) => {
        return (prev.bbox[2] * prev.bbox[3] > current.bbox[2] * current.bbox[3]) ? prev : current;
    });

    const [x, y, width, height] = subject.bbox;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // Rule of Thirds Grid Lines (approximate)
    const thirdW = videoWidth / 3;
    const thirdH = videoHeight / 3;

    // Check Size (Distance)
    const areaRatio = (width * height) / (videoWidth * videoHeight);

    // Logic for Distance
    if (areaRatio < 0.10) {
        return { text: 'Too far! Move closer or Zoom In (2x)', icon: 'zoom-in', color: 'text-blue-400' };
    }
    if (areaRatio > 0.6) {
        return { text: 'Too close! Move back', icon: 'zoom-out', color: 'text-red-400' };
    }

    // Logic for Composition (Center or Thirds)
    // For simplicity, let's guide to the center-middle for now, or the nearest third intersection
    // Let's try to guide to the center for a basic portrait

    const deadZoneX = videoWidth * 0.1; // 10% tolerance
    const deadZoneY = videoHeight * 0.1;

    const targetX = videoWidth / 2;
    const targetY = videoHeight / 2;

    const diffX = targetX - centerX;
    const diffY = targetY - centerY;

    if (Math.abs(diffX) > deadZoneX) {
        if (diffX > 0) return { text: 'Move Camera Left', icon: 'move-left', color: 'text-orange-400' };
        return { text: 'Move Camera Right', icon: 'move-right', color: 'text-orange-400' };
    }

    if (Math.abs(diffY) > deadZoneY) {
        if (diffY > 0) return { text: 'Move Camera Up', icon: 'move-up', color: 'text-orange-400' };
        return { text: 'Move Camera Down', icon: 'move-down', color: 'text-orange-400' };
    }

    return { text: 'Perfect! Shoot now!', icon: 'perfect', color: 'text-green-500' };
};

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
    // const centerY = y + height / 2; // Not strictly needed for all logic

    // Frame dimensions
    const frameArea = videoWidth * videoHeight;
    const subjectArea = width * height;
    const areaRatio = subjectArea / frameArea;

    // 1. DISTANCE LOGIC
    if (areaRatio < 0.15) {
        return { text: 'Too far! Move Closer', icon: 'zoom-in', color: 'text-blue-400' };
    }
    if (areaRatio > 0.7) {
        return { text: 'Too close! Move Back', icon: 'zoom-out', color: 'text-red-400' };
    }

    // 2. CENTERING LOGIC (Horizontal)
    const deadZoneX = videoWidth * 0.15;
    const targetX = videoWidth / 2;
    const diffX = targetX - centerX;

    if (Math.abs(diffX) > deadZoneX) {
        if (diffX > 0) return { text: 'Move Left ⬅️', icon: 'move-left', color: 'text-orange-400' };
        return { text: 'Move Right ➡️', icon: 'move-right', color: 'text-orange-400' };
    }

    // 3. HEADROOM LOGIC (Vertical)
    // y is the top coordinate of the bbox.
    // If y is very small, head is at the top edge.
    // If y is large, there is lots of space above head.

    const headroomRatio = y / videoHeight;

    if (y < videoHeight * 0.05) {
        return { text: 'Tilt Up (Head cut off)', icon: 'move-up', color: 'text-red-400' };
    }

    if (headroomRatio > 0.25) {
        // Too much empty space above
        return { text: 'Tilt Down (Too much headroom)', icon: 'move-down', color: 'text-orange-400' };
    }

    // 4. ANGLE / STYLE SUGGESTIONS
    const subjectAspectRatio = height / width;

    // Full body shot (Tall aspect ratio) -> Suggest lower angle for "long legs" effect
    // We assume full body if aspect ratio is high and we are not too close
    if (subjectAspectRatio > 2.0 && areaRatio < 0.5) {
        return { text: 'Try Lower Angle (Longer Legs)', icon: 'perfect', color: 'text-purple-400' };
    }

    // Portrait/Selfie (Close up) -> Suggest higher angle for slimming effect
    // If we are relatively close and aspect ratio is normal
    if (areaRatio > 0.35) {
        return { text: 'Try Higher Angle (Flattering)', icon: 'perfect', color: 'text-purple-400' };
    }

    return { text: 'Perfect! Shoot! 🔥', icon: 'perfect', color: 'text-green-500' };
};

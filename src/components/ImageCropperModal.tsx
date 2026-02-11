import { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

interface ImageCropperModalProps {
    isOpen: boolean;
    imageSrc: string | null;
    onComplete: (croppedImage: string) => void;
    onCancel: () => void;
}

export default function ImageCropperModal({ isOpen, imageSrc, onComplete, onCancel }: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        // Set width/height to the cropped area size
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // Draw the cropped image
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        // Resize to 300x300 for storage efficiency (if larger)
        const MAX_SIZE = 300;
        let finalCanvas = canvas;

        if (pixelCrop.width > MAX_SIZE || pixelCrop.height > MAX_SIZE) {
            const resizeCanvas = document.createElement('canvas');
            const scale = Math.min(MAX_SIZE / pixelCrop.width, MAX_SIZE / pixelCrop.height);

            resizeCanvas.width = pixelCrop.width * scale;
            resizeCanvas.height = pixelCrop.height * scale;

            const resizeCtx = resizeCanvas.getContext('2d');
            resizeCtx?.drawImage(canvas, 0, 0, resizeCanvas.width, resizeCanvas.height);
            finalCanvas = resizeCanvas;
        }

        return finalCanvas.toDataURL('image/jpeg', 0.8);
    };

    const handleSave = async () => {
        if (imageSrc && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                onComplete(croppedImage);
            } catch (e) {
                console.error(e);
            }
        }
    };

    if (!isOpen || !imageSrc) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden flex flex-col h-[500px]">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800">이미지 편집</h3>
                </div>

                <div className="relative flex-1 bg-gray-900 w-full">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>

                <div className="p-4 bg-white space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 w-8">Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-2 bg-sage-600 text-white font-medium rounded-lg hover:bg-sage-700 transition-colors"
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useCallback } from "react";
import { Modal, Slider } from "antd";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";

interface ImageCropperModalProps {
  image: string | null;
  open: boolean;
  onCancel: () => void;
  onConfirm: (croppedFile: File, previewUrl: string) => void;
}

export const ImageCropperModal = ({
  image,
  open,
  onCancel,
  onConfirm,
}: ImageCropperModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isProcessing] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = useCallback(
    (
      _: { x: number; y: number },
      pixels: { x: number; y: number; width: number; height: number },
    ) => {
      setCroppedAreaPixels(pixels);
    },
    [],
  );

  const handleConfirm = async () => {
    try {
      if (image && croppedAreaPixels) {
        const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
        const croppedFile = new File([croppedBlob], "avatar.jpg", {
          type: "image/jpeg",
        });
        const previewUrl = URL.createObjectURL(croppedBlob);

        onConfirm(croppedFile, previewUrl);
      }
    } catch (e) {
      console.error("Crop error:", e);
    }
  };

  return (
    <Modal
      className="font-montserrat"
      title="Налаштування аватара"
      open={open}
      onOk={handleConfirm}
      onCancel={onCancel}
      centered
      width={450}
      destroyOnClose
      footer={[
        <div key="footer" className="flex justify-end gap-3 px-2 pb-2">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors font-montserrat"
          >
            Скасувати
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-8 py-2 bg-brand-primary hover:bg-brand-dark text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 font-montserrat"
          >
            {isProcessing ? "Обробка..." : "Застосувати"}
          </button>
        </div>,
      ]}
    >
      <div className="relative w-full h-64 bg-gray-50 rounded-xl overflow-hidden mt-5">
        {image && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        )}
      </div>
      <div className="mt-6 flex items-center gap-4 px-2 pb-2">
        <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider font-montserrat">
          Масштаб
        </span>
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(v) => setZoom(v)}
          className="flex-1"
          tooltip={{ open: false }}
        />
      </div>
    </Modal>
  );
};

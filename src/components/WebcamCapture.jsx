// src/components-guestbook/WebcamCapture.jsx
import React, { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw } from "lucide-react";

const videoConstraints = {
  width: 320,
  height: 240,
  facingMode: "user",
};

const WebcamCapture = ({ onCapture }) => {
  const [image, setImage] = useState(null);
  const [fotoTaken, setFotoTaken] = useState(false); // Poin 3: State untuk konfirmasi
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setFotoTaken(true); // Poin 3: Set status foto sudah diambil
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImage(null);
    setFotoTaken(false); // Poin 3: Reset status foto
    onCapture(null);
  };

  return (
    <div>
      <label className="block font-semibold text-slate-700 mb-2">
        Foto Diri
      </label>
      <div className="bg-slate-50 p-4 rounded-lg border flex flex-col items-center justify-center gap-4">
        <div className="w-[320px] h-[240px] rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="Hasil foto"
              className="w-full h-full object-cover"
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              mirrored={true}
              className="w-full h-full"
            />
          )}
        </div>
        
        {/* Poin 3: Teks konfirmasi foto */}
        {fotoTaken && (
          <div className="text-center">
            <p className="text-green-600 font-medium text-lg">✓ Foto Sudah Berhasil Diambil</p>
          </div>
        )}
        
        <div>
          {image ? (
            <button
              type="button"
              onClick={retake}
              className="w-40 mt-2 flex items-center justify-center gap-2 bg-amber-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-600 transition transform hover:scale-105"
            >
              <RefreshCw size={16} />
              Ulangi
            </button>
          ) : (
            <button
              type="button"
              onClick={capture}
              className="w-40 mt-2 flex items-center justify-center gap-2 bg-sky-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-600 transition transform hover:scale-105"
            >
              <Camera size={16} />
              Ambil Foto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
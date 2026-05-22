import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { HiDownload, HiLightningBolt } from "react-icons/hi";
import imageCompression from "browser-image-compression";

export default function ImageCompressorPortal() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [rawFiles, setRawFiles] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [targetSize, setTargetSize] = useState(1);
  const [sizeUnit, setSizeUnit] = useState("MB");
  const [isDragging, setIsDragging] = useState(false);

  // Handle File Input Selection
  const handleImageSelection = (e) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    const imageFiles = filesArray.filter((file) =>
      file.type.startsWith("image/"),
    );

    const previews = imageFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setSelectedImages((prev) => [...prev, ...previews]);

    setRawFiles((prev) => [...prev, ...imageFiles]);

    e.target.value = "";
  };

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);

    const filesArray = Array.from(
      e.dataTransfer.files,
    );

    const imageFiles = filesArray.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) return;

    const previews = imageFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setSelectedImages((prev) => [...prev, ...previews]);

    setRawFiles((prev) => [...prev, ...imageFiles]);
  };

  // Delete Image
  const handleDelete = (index) => {
    URL.revokeObjectURL(selectedImages[index]);

    setSelectedImages((prev) =>
      prev.filter((_, idx) => idx !== index),
    );

    setRawFiles((prev) =>
      prev.filter((_, idx) => idx !== index),
    );

    setCompressedFiles((prev) =>
      prev.filter((_, idx) => idx !== index),
    );
  };

  // Compress Images
  const handleCompressImages = async () => {
    if (rawFiles.length === 0) return;

    setIsCompressing(true);

    const calculatedMaxSize =
      sizeUnit === "KB"
        ? targetSize / 1024
        : targetSize;

    const options = {
      maxSizeMB: calculatedMaxSize,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      maxIteration: 20,
    };

    const compressed = [];

    for (let file of rawFiles) {
      try {
        const output = await imageCompression(
          file,
          options,
        );

        compressed.push(output);
      } catch (error) {
        console.error(error);
      }
    }

    setCompressedFiles(compressed);

    setIsCompressing(false);
  };

  // Download Image
  const handleDownload = (file, index) => {
    const url = URL.createObjectURL(file);

    const link = document.createElement("a");

    link.href = url;

    link.download = `compressed_image_${
      index + 1
    }.${file.name.split(".").pop()}`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl min-h-[85vh] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-4/12 p-5 sm:p-7 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white/60 flex flex-col justify-between">
          <div>
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-slate-900">
                Image Studio
              </h1>

              <p className="text-sm sm:text-base text-slate-500 leading-relaxed mt-3">
                Upload, compress, and optimize your
                images instantly with a clean and
                modern experience.
              </p>
            </div>

            {/* UPLOAD AREA */}
            <label
              htmlFor="image-picker"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() =>
                setIsDragging(false)
              }
              onDrop={handleDrop}
              className={`group relative flex flex-col items-center justify-center w-full h-56 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer hover:scale-[1.01]

              ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400"
              }
            `}
            >
              <div className="flex flex-col items-center text-center px-6">
                <div
                  className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-5 transition-all duration-300
                  
                  ${
                    isDragging
                      ? "bg-blue-100 border-blue-300"
                      : "bg-blue-100 border-blue-200"
                  }
                `}
                >
                  <svg
                    className={`w-8 h-8 transition-colors duration-300 ${
                      isDragging
                        ? "text-blue-600"
                        : "text-blue-500"
                    }`}
                    xmlns="http://w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                </div>

                <p className="text-base font-semibold text-slate-800">
                  {isDragging
                    ? "Drop images here"
                    : "Click to upload images"}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  PNG, JPG, WebP, AVIF or GIF
                </p>

                <p className="text-xs text-slate-400 mt-3">
                  or drag & drop your files here
                </p>
              </div>

              <input
                id="image-picker"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelection}
                className="hidden"
              />
            </label>

            {/* TARGET SIZE */}
            <div className="mt-8">
              <label className="block text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
                Target Output Size
              </label>

              <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 focus-within:border-blue-500 transition-colors shadow-sm">
                <input
                  type="number"
                  min="1"
                  value={targetSize}
                  onChange={(e) =>
                    setTargetSize(
                      Math.max(
                        1,
                        Number(e.target.value),
                      ),
                    )
                  }
                  className="w-full bg-transparent px-4 py-3 text-slate-800 outline-none text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Enter target size"
                />

                <select
                  value={sizeUnit}
                  onChange={(e) =>
                    setSizeUnit(e.target.value)
                  }
                  className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none cursor-pointer hover:bg-slate-200"
                >
                  <option value="MB">MB</option>
                  <option value="KB">KB</option>
                </select>
              </div>

              <p className="text-xs text-slate-400 mt-2 px-1">
                Compression will try to match this
                output size.
              </p>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="mt-10">
            {rawFiles.length > 0 && (
              <button
                onClick={handleCompressImages}
                disabled={isCompressing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <HiLightningBolt
                  className={`size-5 text-yellow-300 ${
                    isCompressing
                      ? "animate-pulse"
                      : ""
                  }`}
                />

                {isCompressing
                  ? "Compressing Images..."
                  : `Compress ${
                      rawFiles.length
                    } File${
                      rawFiles.length > 1
                        ? "s"
                        : ""
                    }`}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-8/12 p-5 sm:p-7 lg:p-8 overflow-y-auto bg-slate-50/50">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Workspace
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Preview and download your compressed
                images
              </p>
            </div>

            <div className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm text-slate-600 shadow-sm">
              {selectedImages.length} Selected
            </div>
          </div>

          {/* EMPTY STATE */}
          {selectedImages.length === 0 && (
            <div className="min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center px-6 bg-white">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
                <svg
                  className="w-10 h-10 text-slate-400"
                  xmlns="http://w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 16l5-5 4 4 8-8 1 1v11H3z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                No images uploaded
              </h3>

              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Upload some images to preview and
                compress them beautifully.
              </p>
            </div>
          )}

          {/* IMAGE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {selectedImages.map((src, idx) => (
              <div
                key={idx}
                className="relative group bg-white border border-slate-200 rounded-3xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* DELETE */}
                <button
                  onClick={() => handleDelete(idx)}
                  className="absolute top-4 right-4 z-10 bg-white/90 rounded-full text-slate-500 hover:text-red-500 transition-colors"
                >
                  <IoIosCloseCircle className="size-7" />
                </button>

                {/* IMAGE */}
                <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={src}
                    alt="preview"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                {/* FILE INFO */}
                <div className="mt-4">
                  <p className="text-sm font-medium truncate text-slate-800">
                    {rawFiles[idx]?.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {(
                      rawFiles[idx]?.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>

                {/* DOWNLOAD */}
                <div className="mt-4">
                  {compressedFiles[idx] ? (
                    <button
                      onClick={() =>
                        handleDownload(
                          compressedFiles[idx],
                          idx,
                        )
                      }
                      className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm text-white"
                    >
                      <HiDownload className="size-4" />
                      Download
                    </button>
                  ) : (
                    <div className="w-full py-3 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs uppercase tracking-wider text-slate-400">
                      Pending
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
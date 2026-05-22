import { useState } from "react";
export const App = () => {
  const [selectedImage, setSelectedImage] = useState([]);
  const handleImageSelection = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((i) =>
        URL.createObjectURL(i),
      );
      setSelectedImage((prev) => prev.concat(newImages));
    }
  };
  console.log(selectedImage);
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-1/2 p-10">
        <div className="grid grid-cols-3 gap-4">
          {selectedImage.length > 0 &&
            selectedImage.map((i) => (
              <div className="">
                
                <img src={i} />
              </div>
            ))}
        </div>
        <label htmlFor="image-picker">Select an image:</label>
        <input
          className="bg-gray-500 rounded-2xl"
          type="file"
          id="image-picker"
          name="image-picker"
          accept="image/*"
          onChange={handleImageSelection}
          multiple
        />
      </div>
    </div>
  );
};

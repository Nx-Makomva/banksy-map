import { FiUpload } from "react-icons/fi";
import "../assets/styles/ArtworkForm.css";
import { createArtwork } from "../services/artworks";
import { useState } from "react";
import { geocodeAddress } from "../services/geocoding";

const ArtworkForm = ({ onClose, refreshTrigger }) => {
  const [form, setForm] = useState({
    title: "",
    discoveryYear: "",
    address: "",
    description: "",
    themeTags: "",
    photos: null,
  });

  const [fileName, setFileName] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const resetForm = () => {
    setForm({
      title: "",
      discoveryYear: "",
      address: "",
      description: "",
      themeTags: "",
      photos: null,
    });
    setFileName("");
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const parseTags = (tags) =>
    tags
      .split(",") // splitting the long string input into an array
      .map((tag) => tag.trim()) // mapping over it and removng whitespace
      .filter((tag) => tag.length > 1); // making sure each tag is actually a word of some sort

  const handleChange = (e) => {
    const { name, value } = e.target;

    // This is just stopping extra input from user
    if (name == "themeTags") {
      const tags = parseTags(value);
      if (tags.length > 3) return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, photos: file }));
    setFileName(file ? file.name : "");
  };

  const HandleAddressBlur = async () => {
    if (form.address) {
      try {
        const coords = await geocodeAddress(form.address);
        setCoordinates(coords);
      } catch (error) {
        console.error("Could not geocode address", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
		// Move this to homepage and add a usestate - refresh (counter) -> add it to dependency array

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("discoveryYear", form.discoveryYear);
    formData.append("address", form.address);
    formData.append("description", form.description);
    formData.append("locationLat", coordinates.lat);
    formData.append("locationLng", coordinates.lng);

    const tags = parseTags(form.themeTags);
    tags.forEach((tag) => {
      formData.append("themeTags", tag);
    });

    if (form.photos) {
      formData.append("photos", form.photos);
      console.log("these are the photos", form.photos);
    }

    await createArtwork(formData);

    resetForm();
    onClose();
		refreshTrigger();
  };

  return (
    <div className="artwork-overlay">
      <div className="artwork-modal">
        <button className="close-button" onClick={handleClose}>
          ❌
        </button>
        <h2>Report A Banksy!</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            placeholder="'Girl with Balloon'"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <label htmlFor="discoveryYear">Discovery Year</label>
          <input
            type="number"
            placeholder="'2002'"
            name="discoveryYear"
            value={form.discoveryYear}
            onChange={handleChange}
            min="1997"
						max={new Date().getFullYear()}
            required
          />
          <label htmlFor="address">Address</label>
          <input
            type="text"
            placeholder="'Waterloo Bridge, South Bank, London, SE1'"
            name="address"
            value={form.address}
            onBlur={HandleAddressBlur}
            onChange={handleChange}
            required
          />
          <label htmlFor="description">Description</label>
          <input
            type="text"
            placeholder="'Red heart-shaped balloon drifting away from young girl reaching out'"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <label htmlFor="themeTags">Themes</label>
          <input
            type="text"
            placeholder="'love, loss, hope, childhood, war'"
            name="themeTags"
            value={form.themeTags}
            onChange={handleChange}
            required
          />
          <small
            style={{
              color:
                form.themeTags.split(",").filter((t) => t.trim()).length >= 3
                  ? "red"
                  : "grey",
            }}
          >
            {`Max 3 tags. You’ve used ${
              form.themeTags.split(",").filter((t) => t.trim()).length
            }/3.`}
          </small>
          <input
            id="picture"
            name="photos"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            required
          />
          <label
            htmlFor="picture"
            className="file-upload-icon"
            title="Upload file"
          >
            <FiUpload />
            <span>{fileName ? fileName : "Upload Image"}</span>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ArtworkForm;

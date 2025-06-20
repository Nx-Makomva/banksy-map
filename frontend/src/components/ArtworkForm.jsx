import { FiUpload } from "react-icons/fi";
import "./ArtworkForm.css";
import { createArtwork } from '../services/artworks';
import { useState } from "react";


const ArtworkForm = ({ onClose }) => {

    const [form, setForm] = useState({
        title: "",
        discoveryYear: "",
        streetName: "",
        city: "",
        location: "",
        description: "",
        themeTags: "",
        photos: null,
    });

    const [fileName, setFileName] = useState("");

    const resetForm = () => {
        setForm({
        title: "",
        discoveryYear: "",
        streetName: "",
        city: "",
        location: "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setForm((prev) => ({ ...prev, photos: file }));
        setFileName(file ? file.name : "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("discoveryYear", form.discoveryYear);
        formData.append("streetName", form.streetName);
        formData.append("city", form.city);
        formData.append("location", form.location);
        formData.append("description", form.description);
        formData.append("themeTags", form.themeTags);

        if (form.photos) {
        formData.append("photos", form.photos);
        }

        await createArtwork(formData);

        resetForm();
        onClose();
    };

    return (
        <div className="artwork-overlay">
        <div className="artwork-modal">
            <button className="close-button" onClick={handleClose} >❌</button>
            <h2>Report A Banksy!</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="text" placeholder="Title" name="title" value={form.title} onChange={handleChange}required />
                <input type="text" placeholder="Discovery Year" name="discoveryYear" value={form.discoveryYear} onChange={handleChange}required />
                <input type="text" placeholder="Street Name" name="streetName" value={form.streetName} onChange={handleChange}required />
                <input type="text" placeholder="City" name="city" value={form.city} onChange={handleChange}required />
                <input type="text" placeholder="Coordinates" name="location" value={form.location} onChange={handleChange}required />
                <input type="text" placeholder="Description" name="description" value={form.description} onChange={handleChange}required />
                <input type="text" placeholder="Themes" name="themeTags" value={form.themeTags} onChange={handleChange}required />
                <input id="picture" name="photos" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileInputChange}required />
                <label htmlFor="picture" className="file-upload-icon" title="Upload file" >
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


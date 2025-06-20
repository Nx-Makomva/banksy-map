import { FiUpload } from "react-icons/fi";
import "../assets/styles/ArtworkForm.css";
import { createArtwork } from '../services/artworks';
import { useState } from "react";


const ArtworkForm = ({ onClose }) => {

    const [form, setForm] = useState({
        title: "",
        discoveryYear: "",
        address: "",
        description: "",
        themeTags: "",
        photos: null,
    });

    const [fileName, setFileName] = useState("");

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
        formData.append("address", form.address);
        formData.append("description", form.description);
        formData.append("themeTags", form.themeTags); 
                        // 👆this is an array so needs a loop to get each tag separately. 
                        // Same thing might be for photos?

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
                <label htmlFor="title">Title</label>
                <input type="text" placeholder="'Girl with Balloon'" name="title" value={form.title} onChange={handleChange}required />
                <label htmlFor="discoveryYear">Discovery Year</label>
                <input type="text" placeholder="'2002'" name="discoveryYear" value={form.discoveryYear} onChange={handleChange}required />
                <label htmlFor="address">Address</label>
                <input type="text" placeholder="'Waterloo Bridge, South Bank, London, SE1'" name="address" value={form.address} onChange={handleChange}required />
                <label htmlFor="description">Description</label>
                <input type="text" placeholder="'Red heart-shaped balloon drifting away from young girl reaching out'" name="description" value={form.description} onChange={handleChange}required />
                <label htmlFor="themeTags">Themes</label>
                <input type="text" placeholder="'love, loss, hope, childhood, war'" name="themeTags" value={form.themeTags} onChange={handleChange}required />
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


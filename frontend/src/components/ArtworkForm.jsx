import { FiUpload } from "react-icons/fi";
import "./ArtworkForm.css";

const ArtworkForm = ({ onClose, fileName, handleFileChange }) => {

    return (
        <div className="artwork-overlay">
        <div className="artwork-modal">
            <button className="close-button" onClick={onClose} >❌</button>
            <h2>Report A Banksy!</h2>
            {/* Add your form fields here */}
            <form>
            <input type="text" placeholder="Title" />
            <input type="text" placeholder="Discovery Year" />
            <input type="text" placeholder="Street Name" />
            <input type="text" placeholder="City" />
            <input type="text" placeholder="Coordinates" />
            <input type="text" placeholder="Description" />
            <input type="text" placeholder="Theme" />
            <input id="picture" name="picture" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
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


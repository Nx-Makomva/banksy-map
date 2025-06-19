import "./ReportButton.css"

const ReportButton = ({ src, alt, onClick }) => {
    return (
        <button className="report-button" onClick={onClick}>
        <img src={src} alt={alt} />
        </button>
    );
};

export default ReportButton;
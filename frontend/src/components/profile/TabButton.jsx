export const TabButton = ({name, value, setActiveTab}) => {
    
    const handleTabClick = (event) => {
        event.preventDefault();
        setActiveTab(name);
    }


    return (
        <>
            <button name={name} value={value} onClick={handleTabClick} className="tab-button">{value}</button>
        </>
    )
}
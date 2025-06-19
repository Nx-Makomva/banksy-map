import { useUser } from "../../contexts/UserContext";


export function ProfileSideBar() {
    const { user } = useUser()

    return (
        <>
        <div className="profileSideBar">
        <p>{`Hello ${user.firstName}`}</p>
        </div>
        </>
    );
}
import React from "react";

const Contact = ({ contact, onChildClick }) => {
    const defaultProfile =
        "https://png.pngitem.com/pimgs/s/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";

    const handleClick = () => {
        onChildClick(contact);
    };

    const { name, profile, lastActive, status, phone } = contact;
    return (
        <div className="contact" onClick={handleClick}>
            <div className="profileImg">
                <img
                    src={profile ? profile : defaultProfile}
                    alt="profile"
                    width={100}
                />
            </div>
            <div className="contact-info">
                <h1 className="name">{name ? name.split(" ")[0].toLowerCase() : phone}</h1>
                <p className="lastmessage">{false ? "Typing..." : "last message"}</p>
            </div>
            <div className="status">
                {status === "online" ? (
                    <span className="onlineIndecator"></span>
                ) : (
                    <p className="lastseen">{lastActive?new Date(lastActive).toLocaleTimeString() :null}</p>
                )}
            </div>
        </div>
    );
};

export default Contact;

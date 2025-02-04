import React, { useState, useContext } from "react";
import { ImCross } from "react-icons/im";
import { GoPersonAdd } from "react-icons/go";
import "../../Styles/createGroupModal.css";
import { getCookie } from "../../Cookie/cookieConfigure";
import axios from "axios";
import { context } from "../../context/UserContext";
import Loadding from "../modals/Loadding";
import ErrorModal from "./ErrorModal";

const CreateGroup = ({ closeModal }) => {
    const { contacts } = useContext(context);

    const [groupName, setGroupName] = useState("");
    const [phone, setPhone] = useState();
    const [selectedContact, setSelectedContact] = useState([]);
    const [isLoadding, setIsLoadding] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const ContactModal = ({ contact, onChildClick }) => {
        return (
            <div className="contactModal-container">
                <img
                    src={contact.profile}
                    alt="img"
                    className="contactModal-img"
                    width={20}
                />
                <p className="contactModal-name">
                    {contact.name.split(" ")[0].toLowerCase()}
                </p>
                <ImCross
                    id="delete-contact-btn"
                    onClick={() => onChildClick(contact)}
                />
            </div>
        );
    };

    const handleAdduser = async () => {
        if (!phone) {
            alert("enter number");
            return 0;
        }
        if (contacts.length) {
            setIsLoadding(true);
            contacts.forEach((contact) => {
                if (contact.phone === phone) {
                    setSelectedContact((prev) => [
                        ...new Set([...prev, contact]),
                    ]);
                    setIsLoadding(false);
                    return 0;
                }
            });
        } else {
            const endPoint = "http://localhost:5500/contact/searchuser";
            try {
                setIsLoadding(true);
                const responce = await axios.get(endPoint, {
                    headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                    },
                    params: {
                        phone,
                    },
                });
                const profileBinaryData = responce.data.profile.data;
                const unit8Array = new Uint8Array(profileBinaryData);
                const profilePhotoLink = URL.createObjectURL(
                    new Blob([unit8Array])
                );
                const user = {
                    profile: profilePhotoLink,
                    name: responce.data.name,
                };
                setSelectedContact((prev) => [...new Set([...prev, user])]);
                setIsLoadding(false);
            } catch (error) {
                setIsLoadding(false);
                alert("not found");
            }
        }
    };
    const handleClick = ({ name }) => {
        setSelectedContact((prev) =>
            selectedContact.filter((contact) => contact.name !== name)
        );
    };

    const handleCreateGroup = async () => {
        if (!groupName) {
            alert("enter a group name");
            return 0;
        }
        try {
            setIsLoadding(true);
            const endPoint = "http://localhost:5500/contact/createGroup";
            const payload = {
                groupName,
                numbers: selectedContact.map((contact) => contact.phone),
            };

            const responce = await axios.post(endPoint, payload, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            });
            if (!responce) throw new Error("Can't create group");
            closeModal();
            setIsLoadding(false);
        } catch (error) {
            setIsLoadding(false);
            setIsError(true);
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="create-group-modal-background">
            <div className="create-group-modal">
                <div className="create-group-modal-header">
                    <div className="title">create group</div>
                    <ImCross
                        id="modal-close-btn"
                        onClick={() => {
                            closeModal();
                        }}
                    />
                </div>
                <div className="create-group-modal-body">
                    <input
                        type="text"
                        className="group-name-input"
                        value={groupName}
                        placeholder="group name"
                        onChange={(e) => {
                            setGroupName(e.target.value);
                        }}
                    />
                    <div className="select-contact-input">
                        <input
                            type="number"
                            className="group-name-input"
                            value={phone}
                            placeholder="select contact by number"
                            onChange={(e) => {
                                setPhone(e.target.value);
                            }}
                        />
                        <GoPersonAdd
                            className="add-icon"
                            onClick={handleAdduser}
                        />
                    </div>
                    <div className="selected-contacts">
                        {selectedContact.map((contact, index) => {
                            return (
                                <ContactModal
                                    key={index}
                                    contact={contact}
                                    onChildClick={handleClick}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="create-group-modal-footer">
                    <button id="group-create-btn" onClick={handleCreateGroup}>
                        create
                    </button>
                    <button
                        id="group-modal-close-btn"
                        onClick={() => {
                            closeModal();
                        }}
                    >
                        close
                    </button>
                </div>
            </div>
            {isLoadding && <Loadding />}
            {isError && (
                <ErrorModal errorMsg={errorMsg} handleError={setIsError} />
            )}
        </div>
    );
};

export default CreateGroup;

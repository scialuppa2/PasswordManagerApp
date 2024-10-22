import React from "react";
import { AiTwotoneContainer } from "react-icons/ai";
import "./PasswordList.css";

const PasswordDirectory = ({ directories, onDirectoryClick }) => {
  return (
    <div className="password-directories">
      {directories.length === 0 ? (
        <p>No directories available.</p>
      ) : (
        <ul>
          {directories.map((directory) => (
            <li
              key={directory.id}
              onClick={() => onDirectoryClick(directory.id)}
            >
              <AiTwotoneContainer /> {directory.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordDirectory;

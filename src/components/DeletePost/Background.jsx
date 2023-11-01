import React from 'react'
import ReactDOM from "react-dom";
import '../Comments/comment.css'

function Background({ children, closeModal }) {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={closeModal}>
      {children}
    </div>,
    document.getElementById("actions")
  );
}

export default Background;

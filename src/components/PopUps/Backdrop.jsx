import React from "react";
import  ReactDOM  from "react-dom";
import '../PopUps/Backdrop.css'



function Backdrop({ children, closeModal }) {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={closeModal}>
      {children} 
    </div>,
    document.getElementById("portal")
  );
}
export default Backdrop

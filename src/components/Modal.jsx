import React, { useEffect, useRef } from "react";
import PreventScroll from "./PreventScroll";
import styles from "./Modal.module.css";

export default function Modal({ closeModal, children }){
    const modalRef = useRef(null);
    const [blockScroll, allowScroll] = PreventScroll();
    
    useEffect(() => {
        document.addEventListener('mousedown', onClickOutside);
        blockScroll();
        return () => {document.removeEventListener('mousedown', onClickOutside); allowScroll();}
    }, [])

    const onClickOutside = (event) => {
        if(modalRef.current && !modalRef.current.contains(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            closeModal();
        }
    }

    return(
        <>
            <div className={styles.modal}>
                <div className={styles.modalOverlay}> 
                    <div className={styles.modalContainer} ref={modalRef}>
                        <button className={styles.closeBtn} onClick={() => closeModal(false)}>&times;</button>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
    } 
import { createContext, useContext, useState } from 'react';
import './Modal.scss';
import CloseIcon from '@mui/icons-material/Close';

const ModalContext = createContext();

export default function Modal({ children }) {
  const [modalHeader, setModalHeader] = useState(null);
  const [modalText, setModalText] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonContainer, setButtonContainer] = useState(
    <div className='button-container'>
      <button className='primary'>Cancel</button>
    </div>
  );

  const newModal = (data) => {
    const { content: modalText = null, buttons = null, header = null } = data;
    setModalHeader(header);
    setModalText(modalText);
    setButtonContainer(<div className='button-container'>{buttons}</div>);
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalHeader(null);
    setModalText(null);
    setButtonContainer(null);
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ newModal, closeModal }}>
      {isOpen && (
        <div className='modal'>
          <div className='content default'>
            {modalHeader && <div className='header'>{modalHeader}</div>}
            <div className='main'>{modalText}</div>
            <div className='footer'>{buttonContainer}</div>
          </div>
          <div className='backdrop'></div>
        </div>
      )}

      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);

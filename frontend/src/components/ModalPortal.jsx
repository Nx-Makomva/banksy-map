import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
  const modalRoot = document.getElementById('modal-root');
  
  if (!modalRoot) {
    const el = document.createElement('div');
    el.id = 'modal-root';
    document.body.appendChild(el);
  }

  return createPortal(children, modalRoot);
};

export default ModalPortal;
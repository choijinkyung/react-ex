import React,{CSSProperties, FC, useCallback} from 'react'
import { CloseModalButton, CreateModal } from './styles'


interface Props{
  children?: React.ReactNode
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
}
const Modal: FC<Props> = ({ children, show, onCloseModal }) => {
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);
  
  if (!show) {
    return null;
  }
  
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  )
}

export default Modal;

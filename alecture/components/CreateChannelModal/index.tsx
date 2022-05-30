import React,{VFC, useCallback} from 'react'
import useInput from '@hooks/useInput'
import Modal from '@components/Modal'
import { Button, Input } from '@pages/SignUp/styles';

interface Props{
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal }) => {
  const [newChannel, onChangeNewChannel] = useInput('');
  const onCreateChannel = useCallback((e: any) => {
    e.stopPropagation();
  }, []);
  
  if (!show) {
    return null;
  }
  
  return (
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel}>
          <label id="channel-label">
            <span> channel name</span>
            <Input id ="channel" onChange={onChangeNewChannel} value={newChannel}/>
          </label>      
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
  )
}

export default CreateChannelModal;

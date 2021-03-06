import React,{VFC, useCallback} from 'react'
import useInput from '@hooks/useInput'
import Modal from '@components/Modal'
import { Button, Input } from '@pages/SignUp/styles';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

interface Props{
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const { data: userData } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);

  const { data: channelData, mutate:revalidateChannel } = useSWR<IChannel[]>(userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null, fetcher);
  
  const onCreateChannel = useCallback((e: any) => {
    e.preventDefault();
    axios.post(`/api/workspaces/${workspace}/channels`, {
      name: newChannel,      
    },
      { withCredentials: true }
    ).then(() => {
      setShowCreateChannelModal(false);
      revalidateChannel();
      setNewChannel('');
    }).catch((error) => {
      toast.error(error.response?.data, { position: 'bottom-center' });
      console.dir(error);
    })
  }, [newChannel]);
  
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

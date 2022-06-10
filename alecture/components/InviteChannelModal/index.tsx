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
  setShowInviteChannelModal: (flag: boolean) => void;
  channel?: string;
}

const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal, channel }) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);

  const { mutate:revalidateMembers } = useSWR<IUser[]>(userData&&channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null, fetcher);
  
  const onInviteMember = useCallback((e: any) => {
    e.preventDefault();
    if (!newMember || !newMember.trim()) return;

    axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
      email: newMember,      
    },
      { withCredentials: true }
    ).then(() => {
      revalidateMembers();
      setShowInviteChannelModal(false);
      setNewMember('')
    }).catch((error) => {
      toast.error(error.response?.data, { position: 'bottom-center' });
      console.dir(error);
    })
  }, [workspace, channel, newMember]);
  
  if (!show) {
    return null;
  }
  
  return (
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <label id="member-label">
            <span>채널 멤버 초대</span>
            <Input id ="member" onChange={onChangeNewMember} value={newMember}/>
          </label>      
          <Button type="submit">초대하기</Button>
        </form>
      </Modal>
  )
}

export default InviteChannelModal;

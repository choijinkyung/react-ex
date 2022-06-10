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
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}

const InviteWorkspaceModal: VFC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);

  const { mutate:revalidateMember } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);
  
  const onInviteMember = useCallback((e: any) => {
    e.preventDefault();
    if (!newMember || !newMember.trim()) return;

    axios.post(`/api/workspaces/${workspace}/members`, {
      email: newMember,      
    },
      { withCredentials: true }
    ).then((response) => {
      revalidateMember();
      setShowInviteWorkspaceModal(false);
      setNewMember('')
    }).catch((error) => {
      toast.error(error.response?.data, { position: 'bottom-center' });
      console.dir(error);
    })
  }, [workspace, newMember]);
  
  if (!show) {
    return null;
  }
  
  return (
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <label id="member-label">
            <span>E-mail</span>
            <Input id ="member" onChange={onChangeNewMember} value={newMember}/>
          </label>      
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
  )
}

export default InviteWorkspaceModal;

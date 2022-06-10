import axios from 'axios';
import React, { Children, VFC, useCallback, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Navigate } from 'react-router-dom'
import { Header,RightMenu,ProfileImg, WorkspaceWrapper, Workspaces,Channels,Chats, WorkspaceName, MenuScroll,ProfileModal, LogOutButton, WorkspaceButton, AddButton, WorkspaceModal } from '@layouts/Workspace/styles'
import gravatar from 'gravatar'
import { Route, Routes,Link } from 'react-router-dom';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { IChannel, IUser } from '@typings/db';
import Modal from '@components/Modal'
import useInput from '@hooks/useInput';
import { Button, Input } from '@pages/SignUp/styles';
import {toast} from 'react-toastify'
import CreateChannelModal from '@components/CreateChannelModal';
import { useParams } from 'react-router';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import ChannelList from '@components/ChannelList'
import DMList from '@components/DMList'


const Channel = loadable(() => import('@pages/Channel'));

const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: VFC = () => {
  const { workspace } = useParams<{ workspace?: string }>(); 

    const { data: userData, error, mutate
  } = useSWR<IUser | false>('/api/users', fetcher);

    const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels`:null, fetcher);

  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);
  
 
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setshowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');


  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true,
    }).then(() => {
      mutate(false, false) // false를 넣어주면 data자리에 false가 들어감
    })
  }, []);

  const onClickUserProfile = useCallback((e: any) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev)
  }, [])

  const onclickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true)
  }, [])
  
  const onCreateWorkspace = useCallback((e: any) => {
    e.preventDefault();
    if (!newWorkspace || !newWorkspace.trim()) return;
    if (!newUrl || !newUrl.trim()) return;
    axios
      .post(
        '/api/workspaces',
        {
          workspace: newWorkspace,
          url: newUrl,
        },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        mutate();
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [newWorkspace, newUrl]);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setshowWorkspaceModal((prev) => !prev);
  }, []);
  
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true)
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true)
  }, []);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true)
  }, []);
  

  if (!userData) {
    return (
      <>
        {< Navigate to="/login" replace />}
      </>
    )
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: "retro" })} alt={userData.nickname}>            
            </ProfileImg>
            {showUserMenu &&
              <Menu style={{ right: 0, top: 38 }} onCloseModal={onClickUserProfile} show={showUserMenu}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, { s: '36px', d: "retro" })} alt={userData.nickname} />  
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
           {userData?.Workspaces?.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/$일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onclickCreateWorkspace}>
          </AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>sleact </WorkspaceName> 
            <MenuScroll>
              <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                <WorkspaceModal>
                  <h2>sleact</h2>
                  <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                  <button onClick={onClickAddChannel}>채널 만들기</button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceModal>
            </Menu>
            <ChannelList/>  
            <DMList />           
            </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel/>} />
            <Route path="/dm/:id" element={<DirectMessage/>} />
          </Routes>
        </Chats>        
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <label id="workspace-label">
            <span> workspace name</span>
            <Input id ="workspace" onChange={onChangeNewWorkspace} value={newWorkspace}/>
          </label>
          <label id="workspace-url-label">
            <span> workspace url</span>
            <Input id ="workspace" onChange={onChangeNewUrl} value={newUrl}/>
          </label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} setShowCreateChannelModal={setShowCreateChannelModal} />        
      <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal} setShowInviteWorkspaceModal={setShowInviteWorkspaceModal} />       
      <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal} channel={''} />       
    </div>
  )
}

export default Workspace
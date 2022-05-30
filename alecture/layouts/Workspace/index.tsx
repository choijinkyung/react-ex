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
import { IUser, IWorkspace } from '@typings/db';
import Modal from '@components/Modal'
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import {toast} from 'react-toastify'
import CreateChannelModal from '@components/CreateChannelModal';


const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));


const Workspace: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setshowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setshowCreateChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const { data: userData, error, mutate
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
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
  
  const onCreateWorkspace = useCallback((e:any) => {
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
  },[newWorkspace,newUrl])

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setshowCreateChannelModal(false);
  },[])

  const toggleWorkspaceModal = useCallback(() => {
    setshowWorkspaceModal((prev) => !prev);  
  }, [])
  
  const onClickAddChannel = useCallback(() => {
    setshowCreateChannelModal(true)
  },[])

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
          {userData?.Workspaces.map((ws:IWorkspace) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onclickCreateWorkspace}>
          </AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>
            {/* {userData?.Workspaces.find()} */}
            sleact   
            <MenuScroll>
              <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                <WorkspaceModal>
                  <h2>sleact</h2>
                  <button onClick={onClickAddChannel}>채널 만들기</button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceModal>
              </Menu>
            </MenuScroll>
          </WorkspaceName>
          <MenuScroll>
            {/* <Menu>
              Menu
            </Menu> */}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel" element={<Channel />} />
            <Route path="/dm" element={<DirectMessage/>} />
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
      <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal}/>        
    </div>
  )
}

export default Workspace
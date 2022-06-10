import fetcher from '@utils/fetcher';
import React, { useCallback } from 'react'
import { useParams, useResolvedPath } from 'react-router';
import useSWR from 'swr';
import { Container, Header } from './styles';
import gravatar from 'gravatar'
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';


const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace?: string, id?: string }>(); 
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher)
  const [chat, onChangeChat] = useInput('')

  const onSubmitForm = useCallback((e:any) => {
    e.preventDefault();
    console.log('submit')
  }, [])
  
  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      {<ChatList />}
      {<ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat}/>}
    </Container>
  )
}

export default DirectMessage;
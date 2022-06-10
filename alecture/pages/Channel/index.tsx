import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import InviteChannelModal from '@components/InviteChannelModal';
import useInput from '@hooks/useInput';
import React, { useCallback } from 'react'
import { useParams } from 'react-router';
import { Container, Header } from './styles';


const Channel = () => {
  const { channel } = useParams<{ channel?: string }>();
  const [chat, onChangeChat,setChat] = useInput('')
  const onSubmitForm = useCallback((e:any) => {
    e.preventDefault();
    console.log('submit')
    setChat('')    
  },[])

  return (
    <Container>
      <Header>
        Channel Page
      </Header>    
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
    </Container>
  )
}

export default Channel;

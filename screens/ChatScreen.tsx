import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BuyerStackParamList, SellerStackParamList, Message } from '../types';
import { useMessagesStore } from '../stores/messagesStore';
import { useAuthStore } from '../stores/authStore';

type ChatScreenNavigationProp =
  | NativeStackNavigationProp<BuyerStackParamList, 'Chat'>
  | NativeStackNavigationProp<SellerStackParamList, 'Chat'>;

type ChatScreenRouteProp =
  | RouteProp<BuyerStackParamList, 'Chat'>
  | RouteProp<SellerStackParamList, 'Chat'>;

interface ChatScreenProps {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

export default function ChatScreen({ route, navigation }: ChatScreenProps): React.ReactElement {
  const { conversationId, receiverName } = route.params;
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const getMessages = useMessagesStore((state) => state.getMessages);
  const addMessage = useMessagesStore((state) => state.addMessage);
  const markAsRead = useMessagesStore((state) => state.markAsRead);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const conversationMessages = getMessages(conversationId);
    setMessages(conversationMessages);
    markAsRead(conversationId, user?.id || '');
  }, [conversationId]);

  const sendMessage = () => {
    if (!inputText.trim() || !user) return;

    const [userId1, userId2] = conversationId.split('-');
    const receiverId = userId1 === user.id ? userId2 : userId1;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId,
      senderName: user.name,
      receiverName,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    addMessage(newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === user?.id;
    const messageTime = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.theirMessage]}>
        <View style={[styles.messageBubble, isMine ? styles.myMessageBubble : styles.theirMessageBubble]}>
          <Text style={[styles.messageText, isMine ? styles.myMessageText : styles.theirMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isMine ? styles.myMessageTime : styles.theirMessageTime]}>
            {messageTime}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubble-ellipses-outline" size={64} color="#ddd" />
      <Text style={styles.emptyText}>Start the conversation</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{receiverName}</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
          activeOpacity={0.7}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4caf50',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: '#e27a14',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#1a1a1a',
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e27a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    marginTop: 12,
  },
});


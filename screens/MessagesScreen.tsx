import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerStackParamList, SellerStackParamList, Conversation } from '../types';
import { useMessagesStore } from '../stores/messagesStore';
import { useAuthStore } from '../stores/authStore';

type MessagesScreenNavigationProp =
  | NativeStackNavigationProp<BuyerStackParamList, 'Messages'>
  | NativeStackNavigationProp<SellerStackParamList, 'Messages'>;

interface MessagesScreenProps {
  navigation: MessagesScreenNavigationProp;
}

export default function MessagesScreen({ navigation }: MessagesScreenProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const conversations = useMessagesStore((state) => state.conversations);

  const userConversations = conversations.filter((conv) =>
    conv.participants.includes(user?.id || '')
  );

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getOtherParticipantName = (conversation: Conversation): string => {
    const otherParticipantId = conversation.participants.find((id) => id !== user?.id);
    return conversation.participantNames[otherParticipantId || ''] || 'Unknown';
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const otherParticipantName = getOtherParticipantName(item);
    const timeAgo = getTimeAgo(new Date(item.lastMessageTime));

    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() =>
          navigation.navigate('Chat' as never, {
            conversationId: item.id,
            receiverName: otherParticipantName,
          } as never)
        }
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(otherParticipantName)}</Text>
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.participantName}>{otherParticipantName}</Text>
            <Text style={styles.timestamp}>{timeAgo}</Text>
          </View>

          {item.listingTitle && (
            <Text style={styles.listingTitle} numberOfLines={1}>
              Re: {item.listingTitle}
            </Text>
          )}

          <Text style={styles.lastMessage} numberOfLines={2}>
            {item.lastMessage}
          </Text>

          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>No Messages Yet</Text>
      <Text style={styles.emptyText}>
        Start chatting with buyers or sellers to discuss orders
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>{userConversations.length} conversations</Text>
      </View>

      <FlatList
        data={userConversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingVertical: 8,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e27a14',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  listingTitle: {
    fontSize: 13,
    color: '#e27a14',
    marginBottom: 4,
    fontWeight: '500',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#e27a14',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});


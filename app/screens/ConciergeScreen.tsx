import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Send } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/contexts/AuthContext';

interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  sender: 'member' | 'concierge';
  text: string;
  created_at: string;
}

interface ConciergeScreenProps {
  navigation: any;
  route?: any;
}

export default function ConciergeScreen({ navigation, route }: ConciergeScreenProps) {
  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Context passed from other screens (venue, booking, etc.)
  const passedContext = route?.params?.context;

  // Initialize conversation on mount
  useEffect(() => {
    if (user?.id) {
      initializeConversation();
    }
  }, [user?.id]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) return;

    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.find((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          setIsTyping(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [conversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  // Initialize or get existing conversation
  const initializeConversation = async () => {
    try {
      console.log('🔄 Initializing conversation...');
      console.log('  User ID:', user?.id);
      setIsLoading(true);

      // Check for existing active conversation
      console.log('🔍 Checking for existing conversation...');
      const { data: existingConvo, error: existingError } = await supabase
        .from('conversations')
        .select('id')
        .eq('member_id', user!.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('  Existing conversation check:', existingConvo ? 'Found' : 'Not found');
      if (existingError && existingError.code !== 'PGRST116') {
        console.error('  Error checking existing conversation:', existingError);
      }

      let convId: string;

      if (existingConvo) {
        console.log('✅ Using existing conversation:', existingConvo.id);
        convId = existingConvo.id;
      } else {
        // Create new conversation
        console.log('📤 Creating new conversation...');
        const { data: newConvo, error } = await supabase
          .from('conversations')
          .insert({
            member_id: user!.id,
            status: 'active',
            metadata: passedContext || {},
          })
          .select('id')
          .single();

        if (error) {
          console.error('❌ Error creating conversation:', error);
          throw error;
        }
        
        console.log('✅ Conversation created:', newConvo.id);
        convId = newConvo.id;

        // Add welcome message
        console.log('📤 Adding welcome message...');
        const { error: welcomeError } = await supabase.from('messages').insert({
          conversation_id: convId,
          user_id: user!.id,
          sender: 'concierge',
          text: `Hey${user?.full_name ? ` ${user.full_name.split(' ')[0]}` : ''}, welcome to Seven Keys. I'm here to help with your requests across all our services. What can I do for you?`,
        });
        
        if (welcomeError) {
          console.error('❌ Error adding welcome message:', welcomeError);
        } else {
          console.log('✅ Welcome message added');
        }
      }

      console.log('📌 Setting conversation ID:', convId);
      setConversationId(convId);

      // Load message history
      console.log('📥 Loading message history...');
      const { data: history, error: historyError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (historyError) {
        console.error('❌ Error loading history:', historyError);
      } else {
        console.log('✅ Loaded', history?.length || 0, 'messages');
      }

      if (history) {
        setMessages(history);
      }
    } catch (error) {
      console.error('❌ Error initializing conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    console.log('📤 sendMessage called');
    console.log('  inputText:', inputText);
    console.log('  conversationId:', conversationId);
    console.log('  user?.id:', user?.id);
    console.log('  isSending:', isSending);

    if (!inputText.trim() || !conversationId || !user?.id || isSending) {
      console.log('⚠️ sendMessage blocked - missing requirements');
      return;
    }

    const messageText = inputText.trim();
    console.log('📝 Message text:', messageText);
    setInputText('');
    setIsSending(true);
    setIsTyping(true);

    try {
      // Optimistically add member message
      const tempId = `temp-${Date.now()}`;
      const tempMessage: Message = {
        id: tempId,
        conversation_id: conversationId,
        user_id: user.id,
        sender: 'member',
        text: messageText,
        created_at: new Date().toISOString(),
      };
      console.log('➕ Adding temp message:', tempId);
      setMessages((prev) => [...prev, tempMessage]);

      // Save member message to database
      console.log('💾 Saving member message to database...');
      const { data: savedMessage, error: saveError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          sender: 'member',
          text: messageText,
        })
        .select()
        .single();

      if (saveError) {
        console.error('❌ Error saving member message:', saveError);
        throw saveError;
      }

      console.log('✅ Member message saved:', savedMessage.id);

      // Replace temp message with real one
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? savedMessage : m))
      );

      // Call Edge Function to get AI response
      console.log('🚀 Calling Edge Function: process-message');
      console.log('  Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
      console.log('  Function URL: https://bjbxwrljmcncfnmcfkps.supabase.co/functions/v1/process-message');
      console.log('  Request body:', {
        message: messageText,
        user_id: user.id,
        conversation_id: conversationId,
      });
      console.log('  Supabase client functions available:', typeof supabase.functions !== 'undefined');
      console.log('  Supabase client functions.invoke available:', typeof supabase.functions?.invoke !== 'undefined');

      const invokeStartTime = Date.now();
      const { data, error } = await supabase.functions.invoke('process-message', {
        body: {
          message: messageText,
          user_id: user.id,
          conversation_id: conversationId,
        },
      });
      const invokeDuration = Date.now() - invokeStartTime;
      console.log(`⏱️ Edge Function call took ${invokeDuration}ms`);

      console.log('📥 Edge Function response received');
      console.log('  Has data:', !!data);
      console.log('  Data:', data);
      console.log('  Has error:', !!error);
      console.log('  Error:', error);

      if (error) {
        console.error('❌ Edge function error:', error);
        console.error('  Error message:', error.message);
        console.error('  Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      console.log('✅ Edge Function call successful');
      console.log('  Response:', data?.response);

      // AI response is saved by the Edge Function and will come via real-time subscription
      // If real-time doesn't work, add the response manually
      if (data?.response) {
        console.log('📨 Adding AI response to messages (fallback)');
        setTimeout(() => {
          setMessages((prev) => {
            // Check if response already added via subscription
            const hasResponse = prev.some(
              (m) => m.sender === 'concierge' && m.text === data.response
            );
            if (hasResponse) {
              console.log('✅ Response already added via subscription');
              return prev;
            }

            console.log('➕ Adding response manually (subscription may not have worked)');
            return [
              ...prev,
              {
                id: `ai-${Date.now()}`,
                conversation_id: conversationId,
                user_id: user.id,
                sender: 'concierge',
                text: data.response,
                created_at: new Date().toISOString(),
              },
            ];
          });
          setIsTyping(false);
        }, 500);
      } else {
        console.log('⚠️ No response in data, waiting for real-time subscription...');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('  Error type:', typeof error);
      console.error('  Error details:', JSON.stringify(error, null, 2));
      setIsTyping(false);
      // Show error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          conversation_id: conversationId,
          user_id: user!.id,
          sender: 'concierge',
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
      console.log('🏁 sendMessage finished');
    }
  };

  // Handle quick action buttons - navigate to form screens
  const handleQuickAction = (actionText: string) => {
    switch (actionText) {
      case "I'd like to make a reservation":
        navigation.navigate('VenueTypeSelection');
        break;
      case "I'd like to book an experience":
        navigation.navigate('ExperienceTypeSelection');
        break;
      case "I'd like to book for a large group":
        navigation.navigate('GroupBookingForm');
        break;
      case "Can you recommend something for me?":
        navigation.navigate('Recommendations');
        break;
      case "I'd like to arrange a corporate booking":
        navigation.navigate('CorporateBookingForm');
        break;
      default:
        // Fallback to chat for unknown actions
        setInputText(actionText);
        setTimeout(() => {
          sendMessage();
        }, 100);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5684C4" />
          <Text style={styles.loadingText}>Connecting to concierge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Concierge</Text>
            <Text style={styles.status}>
              {isTyping ? 'Typing...' : 'Online'}
            </Text>
          </View>
        </View>

        {/* Messages Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === 'member'
                  ? styles.messageWrapperMember
                  : styles.messageWrapperConcierge,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'member'
                    ? styles.messageBubbleMember
                    : styles.messageBubbleConcierge,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
              <Text style={styles.messageTime}>
                {formatTime(message.created_at)}
              </Text>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageWrapper, styles.messageWrapperConcierge]}>
              <View style={[styles.messageBubble, styles.messageBubbleConcierge, styles.typingBubble]}>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions Grid */}
        {messages.length <= 1 && (
          <View style={styles.quickActionsContainer}>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleQuickAction("I'd like to make a reservation")}
                activeOpacity={0.7}
              >
                <Text style={styles.quickActionText}>Make a Reservation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleQuickAction("I'd like to book an experience")}
                activeOpacity={0.7}
              >
                <Text style={styles.quickActionText}>Book an Experience</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleQuickAction("I'd like to book for a large group")}
                activeOpacity={0.7}
              >
                <Text style={styles.quickActionText}>Group Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleQuickAction("Can you recommend something for me?")}
                activeOpacity={0.7}
              >
                <Text style={styles.quickActionText}>Get Recommendations</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleQuickAction("I'd like to arrange a corporate booking")}
                activeOpacity={0.7}
              >
                <Text style={styles.quickActionText}>Corporate Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!isSending}
              onSubmitEditing={sendMessage}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() && !isSending
                ? styles.sendButtonActive
                : styles.sendButtonInactive,
            ]}
            onPress={sendMessage}
            activeOpacity={0.8}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={18} color="#FFFFFF" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  status: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  messageWrapperMember: {
    alignItems: 'flex-end',
  },
  messageWrapperConcierge: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  messageBubbleMember: {
    backgroundColor: '#5684C4',
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  messageBubbleConcierge: {
    backgroundColor: '#1A2A3A',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
    marginHorizontal: 4,
  },
  typingBubble: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  quickActionsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    width: '47%', // 2 columns with gap
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#111D2E',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#5684C4',
  },
  sendButtonInactive: {
    backgroundColor: '#1A2A3A',
  },
});

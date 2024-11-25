import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { salah } from '../../env';
import { DJANGO_API_URL } from '../../env';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false); // For typing animation
  const [loadingWord, setLoadingWord] = useState(''); // Current loading word
  const [selectedAPI, setSelectedAPI] = useState('SFA'); // Default API selection
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const flatListRef = useRef();

  const loadingWords = ['Thinking...', 'Processing...', 'Generating...', 'Almost there...']; // List of loading words

  const handleSend = async () => {
    if (textInput.trim() === '') return;

    const userMessage = { id: Date.now().toString(), text: textInput, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setTextInput(''); // Clear the input

    // Set bot typing state
    setIsBotTyping(true);

    try {
      // Determine API URL based on selectedAPI
      const apiUrl =
        selectedAPI === 'SFA' ? `${salah}/ask` : `${DJANGO_API_URL}/ask/sql`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the server.');
      }

      const data = await response.json();
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong.',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Effect to cycle through loading words every 1 second
  useEffect(() => {
    if (isBotTyping) {
      let index = 0;
      setLoadingWord(loadingWords[index]);
      const interval = setInterval(() => {
        index = (index + 1) % loadingWords.length;
        setLoadingWord(loadingWords[index]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isBotTyping]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContent}
      />
      {isBotTyping && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#4361EE" />
          <Text style={styles.typingText}>{loadingWord}</Text>
        </View>
      )}
      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.dropdownToggle}
          onPress={() => setIsDropdownOpen((prev) => !prev)}
        >
          <Text style={styles.dropdownText}>{selectedAPI}</Text>
          <Icon name={isDropdownOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#fff" />
        </TouchableOpacity>
        {isDropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedAPI('SFA');
                setIsDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>SFA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedAPI('SQL');
                setIsDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>SQL</Text>
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={textInput}
          onChangeText={setTextInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Icon name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#4361EE',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  chatContent: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4361EE',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#515151',
  },
  messageText: {
    color: '#fff',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#515151',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    zIndex: 10,
    width: 100,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4361EE',
    borderRadius: 20,
    padding: 10,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  typingText: {
    marginLeft: 10,
    color: '#515151',
    fontStyle: 'italic',
  },
});

export default ChatScreen;

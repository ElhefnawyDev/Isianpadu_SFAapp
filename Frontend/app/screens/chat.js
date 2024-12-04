import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../../env";
import { DJANGO_API_URL } from "../../env";
import Markdown from "react-native-markdown-display";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false); // For typing animation
  const [loadingWord, setLoadingWord] = useState(""); // Current loading word
  const [selectedAPI, setSelectedAPI] = useState("SFA"); // Default API selection
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const flatListRef = useRef();

  const loadingWords = [
    "Thinking...",
    "Processing...",
    "Generating...",
    "Almost there...",
  ]; // List of loading words

  const handleSend = async () => {
    if (textInput.trim() === "") return;

    const userMessage = {
      id: Date.now().toString(),
      text: textInput,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setTextInput(""); // Clear the input

    // Set bot typing state
    setIsBotTyping(true);

    try {
      // Determine API URL based on selectedAPI
      const apiUrl =
        selectedAPI === "SFA" ? `${API_URL}/ask` : `${DJANGO_API_URL}/database`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the server.");
      }

      const data = await response.json();
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: data.result,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong.",
        sender: "bot",
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
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Markdown
          style={markdownStyles}
        >
          {item.text}
        </Markdown>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View></View>
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
          <Icon
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
        {isDropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedAPI("SFA");
                setIsDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>SFA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedAPI("SQL");
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

const markdownStyles= StyleSheet.create({
    // The main container
    body: {color: "white"},
  
    // Headings
    heading1: {
      flexDirection: 'row',
      fontSize: 32,
    },
    heading2: {
      flexDirection: 'row',
      fontSize: 24,
    },
    heading3: {
      flexDirection: 'row',
      fontSize: 18,
    },
    heading4: {
      flexDirection: 'row',
      fontSize: 16,
    },
    heading5: {
      flexDirection: 'row',
      fontSize: 13,
    },
    heading6: {
      flexDirection: 'row',
      fontSize: 11,
    },
  
    // Horizontal Rule
    hr: {
      backgroundColor: 'white',
      height: 1,
    },
  
    // Emphasis
    strong: {
      color: "white",
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    s: {
      textDecorationLine: 'line-through',
    },
  
    // Blockquotes
    blockquote: {
      backgroundColor: 'white',
      borderColor: '#CCC',
      borderLeftWidth: 4,
      marginLeft: 5,
      paddingHorizontal: 5,
    },
  
    // Lists
    bullet_list: {},
    ordered_list: {},
    list_item: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_icon: {
      marginLeft: 10,
      marginRight: 10,
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_content: {
      flex: 1,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_icon: {
      marginLeft: 10,
      marginRight: 10,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_content: {
      flex: 1,
    },
  
    // Code
    code_inline: {
      borderWidth: 1,
      borderColor: 'white',
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 4,
    },
    code_block: {
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor: 'black',
      padding: 10,
      borderRadius: 4,
    },
    fence: {
      borderWidth: 1,
      borderColor: '#1f467e',
      backgroundColor: '#1f467e',
      padding: 10,
      borderRadius: 4,
    },
  
    // Tables
    table: {
      borderWidth: 1,
      borderColor: '#000000',
      borderRadius: 3,
    },
    thead: {},
    tbody: {},
    th: {
      flex: 1,
      padding: 5,
    },
    tr: {
      borderBottomWidth: 1,
      borderColor: '#000000',
      flexDirection: 'row',
    },
    td: {
      flex: 1,
      padding: 5,
    },
  
    // Links
    link: {
      textDecorationLine: 'underline',
    },
    blocklink: {
      flex: 1,
      borderColor: '#000000',
      borderBottomWidth: 1,
      
    },
  
    // Images
    image: {
      flex: 1,
    },
  
    // Text Output
    text: {color: 'white'},
    textgroup: {color: 'white'},
    paragraph: {
      color: 'white',
      marginTop: 10,
      marginBottom: 10,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100%',
    },
    hardbreak: {
      color: 'white',
      width: '100%',
      height: 1,
    },
    softbreak: {color: 'white'},
  
    // Believe these are never used but retained for completeness
    pre: {},
    inline: {},
    span: {},
  
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#4361EE",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  chatContent: {
    padding: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4361EE",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#1e1e1e",
  },
  messageText: {
    color: "#fff",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  dropdownToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#515151",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 5,
  },
  dropdownMenu: {
    position: "absolute",
    bottom: 60,
    left: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 5,
    zIndex: 10,
    width: 100,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#000",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#4361EE",
    borderRadius: 20,
    padding: 10,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  typingText: {
    marginLeft: 10,
    color: "#515151",
    fontStyle: "italic",
  },
});

export default ChatScreen;

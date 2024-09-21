import Peer from 'peerjs';
import React, { useEffect, useRef, useState } from 'react';

function Chat() {
  const [peerId, setPeerId] = useState('');
  const [connectedPeerId, setConnectedPeerId] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null); // State for the selected image
  const peerRef = useRef(null);

  useEffect(() => {
    peerRef.current = new Peer();

    const peer = peerRef.current;

    peer.on('open', (id) => {
      setPeerId(id);
      console.log('My peer ID:', id);
    });

    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        // Check if data is an image (base64 string or Blob)
        if (data.type === 'image') {
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'image', content: data.content },
          ]);
        } else {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      });

      conn.on('open', () => {
        conn.send('Hello from ' + peerId);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const connectToPeer = () => {
    const peer = peerRef.current;
    const conn = peer.connect(connectedPeerId);

    conn.on('open', () => {
      // Send text message if available
      if (message) {
        conn.send(message);
        setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
        setMessage('');
      }

      // Send image if available
      if (image) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result;
          conn.send({ type: 'image', content: imageData });
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'image', content: imageData },
          ]);
          setImage(null); // Reset image after sending
        };
        reader.readAsDataURL(image); // Convert image to base64 string
      }
    });

    conn.on('data', (data) => {
      if (data.type === 'image') {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'image', content: data.content },
        ]);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });
  };

  return (
    <div>
      <h1>P2P Messaging</h1>
      <div>
        <h2>Your Peer ID: {peerId}</h2>
        <input
          type="text"
          placeholder="Peer ID to connect"
          value={connectedPeerId}
          onChange={(e) => setConnectedPeerId(e.target.value)}
        />
        <button onClick={connectToPeer}>Connect</button>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg, index) =>
            msg.type === 'image' ? (
              <li key={index}>
                <img src={msg.content}  alt="Received" width="200" />
                <a href={msg.content} className="btn" download> click</a>
              </li>
            ) : (
              <li key={index}>{msg}</li>
            )
          )}
        </ul>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={connectToPeer}>Send</button>
    </div>
  );
}

export default Chat;





// import React, { useEffect, useRef, useState } from 'react';
// import SimplePeer from 'simple-peer';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Replace with your signaling server URL

// const Chat = () => {
//   const [peer, setPeer] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const messageInputRef = useRef(null);

//   useEffect(() => {
//     const p = new SimplePeer({ initiator: window.location.hash === '#init' });

//     p.on('signal', data => {
//       socket.emit('signal', data);
//     });

//     p.on('data', data => {
//       setMessages(prevMessages => [...prevMessages, data.toString()]);
//     });

//     socket.on('signal', data => {
//       p.signal(data);
//     });

//     setPeer(p);

//     return () => {
//       p.destroy();
//       socket.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (peer && message) {
//       peer.send(message);
//       setMessages(prevMessages => [...prevMessages, message]);
//       setMessage('');
//       messageInputRef.current.focus();
//     }
//   };

//   return (
//     <div>
//       <h1>P2P Messaging</h1>
//       <div>
//         <div>
//           <h2>Messages</h2>
//           <ul>
//             {messages.map((msg, index) => (
//               <li key={index}>{msg}</li>
//             ))}
//           </ul>
//         </div>
//         <input
//           ref={messageInputRef}
//           type="text"
//           value={message}
//           onChange={e => setMessage(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;






// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// import "./style/chat.css";

// function Chat() {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [sent, setSent] = useState([]);
//   const [image, setImage] = useState(null); // State for the selected image

//   const socket = io.connect('http://localhost:9000');
//   // https://chat-app-neon-one.vercel.app/
//   useEffect(() => {
//     socket.on('message', (message) => {
//       console.log('Message received:', message);
//       setMessages((prevMessages) => {
//         const updatedMessages = [...prevMessages, { type: 'text', content: message }];
//         console.log('Updated messages:', updatedMessages);
//         return updatedMessages;
//       });
//     });

//     socket.on('image', (image) => {
//       console.log('Image received:', image);
//       setMessages((prevMessages) => {
//         const updatedMessages = [...prevMessages, { type: 'image', content: image }];
//         console.log('Updated messages with image:', updatedMessages);
//         return updatedMessages;
//       });
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleSendClick = () => {
//     if (message) {
//       socket.emit('user-message', message);
//       console.log('Message sent:', message);
//       setSent((prevMessages) => [...prevMessages, { type: 'text', content: message }]);
//       setMessage('');
//     }
//     if (image) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64Image = reader.result;
//         socket.emit('user-image', base64Image);
//         console.log('Image sent');
//         setSent((prevMessages) => [...prevMessages, { type: 'image', content: base64Image }]);
//         setImage(null);
//       };
//       reader.readAsDataURL(image);
//     }
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   return (
//     <div>
//       <div className="all-one">
//         <div className="one">
//           {sent.map((msg, index) => (
//             <div className="message" key={index}>
//               {msg.type === 'text' ? (
//                 <h1 className="sent">sent::{msg.content}</h1>
//               ) : (
//                 <img className="sent" src={msg.content} alt="Sent" />
//               )}
//             </div>
//           ))}
//           {messages.map((msg, index) => (
//             <div className="message" key={index}>
//               {msg.type === 'text' ? (
//                 <h1 className="received">received::{msg.content}</h1>
//               ) : (
//                 <img className="received" src={msg.content} alt="Received"  width="200px"  height="200px" />
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="form">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Enter Message"
//           />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//           <button onClick={handleSendClick}>Send</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;

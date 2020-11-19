import React, {useState, useEffect, useRef} from 'react';

import { Button } from '@material-ui/core';
import TelegramIcon from '@material-ui/icons/Telegram';
import './App.css';

import CoverPic from './assets/cover.jpg'
import Abhineet from './assets/abhineet.jpeg'
import Raksha from './assets/raksha.jpeg'
import Image2 from './assets/img2.jpeg'
import eCard from './assets/e-card.jpeg'
import loading from './assets/loading.gif'

import weddingSong from './assets/wedding.mp3'
import eVideo from './assets/e-video.mp4'

const buttonConfig = [
    {
      label: '📅 When is the wedding?',
      id: 'wedding date'
    },
    {
      label: '🕺🏼 When is the Sangeet? 💃',
      id: 'sangeet date'
    },
    {
      label: 'Invitation Card & Video',
      id: 'invitation'
    },
    {
      label: 'Want to see your pics 😍',
      id: 'personal pics'
    },
    {
      label: 'Where do I need to come?',
      id: 'location'
    },  
]

const botConfig = {
  'wedding date': {
    text: [`It's on the <b>11th</b> of December.`, `Yeah we know, it's less than even a month and we are super nervous!`, `Please be there by 6pm 🙏 `],
    audio:  weddingSong
  },
  'sangeet date': {
    text: [`It's on the <b>10th</b> of December.`, `Yeah! He is a really good dancer 🕺. I am not so bad myself 💃🏻`, `Please be there by 6pm 🙏 `]
  },
  'personal pics': {
    image: [Abhineet, Raksha, Image2],
    text: [`Here you go`],
  },
  'location': {
    text: [`It's at <b>Sri Sitaramji Bhawan, Raniganj</b>`, 'you can just follow google maps:'],
    location: 'https://tars-file-upload.s3.amazonaws.com/ByNADi/e8e72425e745b4a32703175a09276c0a--staticmap.png',
    link: 'https://goo.gl/maps/AA7CtMdjwJcqzzs68'
  },
  'invitation': {
    text: [`We may not have it all together, but together we have it all.`],
    image: [eCard],
    video: eVideo
  }
}

function App() {
  const [chatData, setChatData] = useState([
    {
        image: [CoverPic],
        text: ['Hey! 😊', `We, <b>Abhineet</b> and <b>Raksha</b> are getting married. 💍`, 'And we want you to be a part of this celebration as we take the next step together.']
    }
    ]
  )

  const [isInput, setInput] = useState(true);
  const [currentButtonFlow, setCurrentButtonFlow] = useState(buttonConfig)
  const [userSelection, setUserSelection] = useState('');
  const [userData, setuserData] = useState(null)

   const chatRef = useRef(false)
   const audioRef = useRef(false)
   const videoRef = useRef(false)
   
  const renderChat = (data, i) => (
    <>
        {i % 2 === 1 ? (
            <div className="user-response">
              <div className="message user-chat-bubble">{data.userSays}</div>
            </div>
        ) : (
            <div className="bot-response">
                <> 
                  <div >
                      {data.text  && data.text.map((dataText) => <div className="message chat-bubble">
                            <span dangerouslySetInnerHTML={{__html: dataText}}></span>    
                          </div>)
                      }
                      {data.image  && data.image.map((image) => <div className="message-image">
                          <img data-action="zoom" src={image}/>    
                        </div>)
                      }
                      {data.location && <div className="message chat-bubble">
                        <a href={data.link} target="_blank">
                          <img src={data.location} style={{width: '100%'}}/>
                        </a>
                          
                        </div>
                      }
                      {data.audio && <audio ref={audioRef} id="audio">
                        <source type="audio/mpeg"/>
                      </audio>}
                      {data.video && <div className="video-container">
                          <video ref={videoRef} width="200" height="240" controls>
                            <source src={data.video} type="video/mp4" />
                          </video>
                        </div>
                      }

                      {data.typing && <div className="loading chat-bubble">
                          <img src={loading}/>
                        </div>}
                  </div>
                </>
             </div>
           
        )}
    </>
  )

  useEffect(() => {
    if(chatRef.current) {
      const newNode = chatRef
       newNode.current.scrollTop= newNode.current.scrollHeight
    }
  })


  useEffect(() => { 
    if(userSelection === 'wedding date') {
      audioRef.current.src = weddingSong;
      audioRef.current.pause();
      audioRef.current.play();
    }
    if(userSelection === 'invitation') {
      videoRef.current.addEventListener('playing', () => {
        document.getElementById('audio').pause()
      })
    }
  }, [userSelection])

  const inputHandler = (e) => {
    setInput(!isInput)
  }

  useEffect(() => {
    if(userData) {
      setTimeout(() => chatLogicHandler(userData), 2000)
    }
  }, [userData])

  const chatLogicHandler = ( id ) => {
    const cloneChatData = [...chatData];
    cloneChatData.pop()
    const botObj = {
      ...botConfig[id]
    }
    cloneChatData.push(botObj)
    setChatData(cloneChatData)
    setUserSelection(id)
    setInput(!isInput)
  }

  const buttonHandler = (e, id, label) => {
    e.preventDefault();
    const cloneChatData = [...chatData];
    const buttons = currentButtonFlow.filter((buttonFlow) => buttonFlow.id !== id)
    const userObj = {
      userSays: label
    } 
    const botObj = {
      typing: true
    }
    cloneChatData.push(userObj)
    cloneChatData.push(botObj)
    setChatData(cloneChatData)
    setCurrentButtonFlow(buttons)
    setuserData(id)
    setInput(!isInput)
  }

  return (
    <div className="bot">
      <div className="bot-container">
        <div className="bot-section">
          <div className="bot-messages" ref={chatRef} style={isInput ? { height: '75%'} : {height: '88%'}}> 
              {chatData.map((obj, i) => renderChat(obj, i))}
          </div>
          <div className="bot-footer">
            <div className="bot-input-container" onClick={inputHandler}>
              <input
                type="text" 
                placeholder="👇🏻👇🏻 Choose from below... 👇🏻👇🏻"
                className="input"
                disabled
              />
              <TelegramIcon className="input-send"/>
            </div>
            {isInput && <div className="bot-button-container">
              {currentButtonFlow.slice(0,2).map((config, i) => (
                <Button 
                  type="button"
                  className="button" 
                  variant="contained"
                  onClick={(e) => buttonHandler(e, config.id, config.label)}
                >
                    {config.label}
                </Button>
              ))}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

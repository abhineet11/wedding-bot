import React, {useState, useEffect, useRef} from 'react';

import ReactAudioPlayer from 'react-audio-player';
import { Button } from '@material-ui/core';
import TelegramIcon from '@material-ui/icons/Telegram';
import './App.css';

import CoverPic from './assets/cover.jpeg'
import Image1 from './assets/img1.jpeg'
import Image2 from './assets/img2.jpeg'


import weddingSong from './assets/wedding.mp3'

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
    text: [`It's on the <b>11th</b> of December.`, `Yeah we know, it's less than even a month and we are super nervous!`, `Please be there by 6pm 🙏 `]
  },
  'sangeet date': {
    text: [`It's on the <b>10th</b> of December.`, `Yeah! He is a really good dancer 🕺. I am not so bad myself 💃🏻`, `Please be there by 6pm 🙏 `]
  },
  'personal pics': {
    image: [Image1, Image2],
    text: [`Here you go`],
  },
  'location': {
    text: [`It's at <b>Sri Sitaramji Bhawan, Raniganj</b>`, 'you can just follow google maps:'],
    location: 'https://tars-file-upload.s3.amazonaws.com/ByNADi/e8e72425e745b4a32703175a09276c0a--staticmap.png'
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
  const [userSelection, setUserSelection] = useState('')

   const chatRef = useRef(false)
   const audioRef = useRef(false)
   
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
                          <img src={data.location} style={{width: '100%'}}/>
                        </div>
                      }
                      {<audio ref={audioRef}>
                        <source type="audio/mpeg"/>
                      </audio>}
                      {data.typing && 'typing..'}
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
      audioRef.current.src = weddingSong
      audioRef.current.play()
    }
  }, [userSelection])

  const inputHandler = (e) => {
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
      ...botConfig[id]
    }
    cloneChatData.push(userObj)
    cloneChatData.push(botObj)
    setChatData(cloneChatData)
    setCurrentButtonFlow(buttons)
    setUserSelection(id)
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

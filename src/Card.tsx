import React from 'react';
import { FeedbackItem } from './drawmap';
import { MailtoDataUnencoded, makeMailtoUri } from './mail';

interface Props {
    item: FeedbackItem
}

export default function Card(props: Props) {
    const {item} = props;
 
    let imgSrc = `https://s2.googleusercontent.com/s2/favicons?domain_url=${item.Link}`;
    switch (item.Category) {
        case 'park':
          imgSrc= 'https://i.pinimg.com/originals/20/54/42/205442f452d956de1fae3d8fb7c90d10.png';
          break;
        case 'traffic':
          imgSrc = 'https://img.icons8.com/android/24/000000/traffic-light.png';
          break;
        case 'cycle':
          imgSrc ='https://img.icons8.com/cotton/64/000000/bicycle--v1.png';
          break;
        case 'retail':
          imgSrc= 'https://img.icons8.com/pastel-glyph/64/000000/shop.png';
          break;
        case 'housing':
          imgSrc = 'https://img.icons8.com/material-rounded/24/000000/cottage--v2.png'
      }

    let survey: React.ReactNode | undefined;
    if (item.Surveylink) {
        survey = <div style={{
            display: 'flex',
        }}>
            <img 
                height={16}
                width={16}
                style={{margin: '0 4px', padding: 2}}
                alt="Survey"
                src="https://img.icons8.com/wired/64/000000/survey.png"/>
               Fill in the <a href={item.Surveylink} style={{marginLeft: 4}} target="_blank" rel="noopener noreferrer"> survey</a>
        </div>
    }
    
    return (
        <div>
            <div style={{
                display: 'flex',
                margin: '8px 0'
            }}>
                <img 
                    src={imgSrc}
                    height={20}
                    width={20}
                    style={{margin: '0px 4px', marginTop: 4}}
                    alt="icon"
                />
                <h2 style={{margin: 0, marginTop: 4}}><a href={item.Link} target="_blank" rel="noopener noreferrer">{item.Title}</a></h2>
            </div>
            {survey}
            <MailtoElement item={item} />
            <p style={{marginLeft: 4}}>{item.Councilname}</p>
            <p style={{marginLeft: 4}}>{item.Fulldescription}</p>
        </div>
    );
}

function MailtoElement(props: {item: FeedbackItem}) {
  const item = props.item;
  const mailtoDataAgree: MailtoDataUnencoded | null = item.Email ? {
    mailAddress: item.Email,
    subject: `Submission regarding ${item.Title || '<find the title on the council\'s website>'}`,
    body: `I'm emailing you to express my support for the proposal detailed at ${item.Link}.\nReplace this line with your comments to personalise the message!`
  } : null;
  const mailtoDataDisagree: MailtoDataUnencoded | null = item.Email ? {
    mailAddress: item.Email,
    subject: `Submission regarding ${item.Title || '<find the title on the council\'s website>'}`,
    body: `I'm emailing you to express my disagreement with the proposal detailed at ${item.Link}.\nReplace this line with your comments to personalise the message!`

  } : null;
  return mailtoDataAgree && mailtoDataDisagree
       ? (
           <div style={{
               display:'flex',
               alignItems: 'center',
               margin: '8px 0'
           }}>
               <img 
                height={16}
                width={16}
                style={{margin: '0 4px', padding: 2}}
                alt="Email"
                src="https://img.icons8.com/material-outlined/24/000000/important-mail.png"/>
               Email your thoughts
               <a href={makeMailtoUri(mailtoDataAgree)}><button>Agree</button></a>
                <a href={makeMailtoUri(mailtoDataDisagree)}><button>Disagree</button></a>
           </div>
        //     <p>
        //    <a href={makeMailtoUri(mailtoDataAgree)}>I agree 
        //    </a> / 
        //    <a href={makeMailtoUri(mailtoDataDisagree)}>I disagree 
        //     <img src="https://img.icons8.com/cotton/64/000000/thumbs-down--v4.png" height={12}/>
        //    </a>
        // </p>
        )
       : null;
}

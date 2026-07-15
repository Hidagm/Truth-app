import { useState, useEffect, useRef } from "react";

const V={from:"#34d399",to:"#818cf8",mid:"#6ee7b7",bg:"#060d09",card:"#090f0b",border:"#34d39918",borderMid:"#34d39932",text:"#c8ecd8",muted:"#2a4a36",mutedHi:"#3d6b4f",danger:"#f87171",dangerBg:"#f8717114",warn:"#fbbf24",gold:"#f59e0b",goldBg:"#f59e0b14"};
const F="'DM Sans',system-ui,sans-serif";
const SERIF="'Cormorant Garamond',serif";

const SB_URL="https://oeeenddnuezxuxpaywgv.supabase.co";
const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZWVuZGRudWV6eHV4cGF5d2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTIyMjYsImV4cCI6MjA5NDY4ODIyNn0.gsNgusf7FIUoyKW2csCPzNT0H86FVrpJnfNooC-oYxI";
const DEMO_MODE=SB_URL.includes("YOUR_PROJECT");
const DEMO_CODE="000000";
const PROXY_URL=SB_URL+"/functions/v1/auth-proxy";
const sb={
  sendOtp:function(p){
    if(DEMO_MODE)return Promise.resolve({demo:true});
    var body=p.email?{action:"sendOtp",email:p.email}:{action:"sendOtp",phone:p.phone};
    return fetch(PROXY_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(function(r){return r.json();}).catch(function(){return{error:{message:"Network error"}};});
  },
  verifyOtp:function(p){
    if(DEMO_MODE)return Promise.resolve(p.token===DEMO_CODE?{demo:true}:{error:{message:"Wrong code. Use 000000 in demo mode."}});
    var body=p.email?{action:"verifyOtp",email:p.email,token:p.token}:{action:"verifyOtp",phone:p.phone,token:p.token};
    return fetch(PROXY_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(function(r){return r.json().then(function(d){if(d.session&&d.session.access_token)localStorage.setItem("truth_token",d.session.access_token);return d;});}).catch(function(){return{error:{message:"Network error"}};});
  }
};

const PHONE_CODES=[{c:"+297",f:"🇦🇼",n:"Aruba"},{c:"+599",f:"🇧🇶",n:"Bonaire"},{c:"+599",f:"🇨🇼",n:"Curaçao"},{c:"+1",f:"🇺🇸",n:"United States"},{c:"+1",f:"🇨🇦",n:"Canada"},{c:"+44",f:"🇬🇧",n:"United Kingdom"},{c:"+61",f:"🇦🇺",n:"Australia"},{c:"+49",f:"🇩🇪",n:"Germany"},{c:"+33",f:"🇫🇷",n:"France"},{c:"+39",f:"🇮🇹",n:"Italy"},{c:"+34",f:"🇪🇸",n:"Spain"},{c:"+81",f:"🇯🇵",n:"Japan"},{c:"+82",f:"🇰🇷",n:"South Korea"},{c:"+86",f:"🇨🇳",n:"China"},{c:"+91",f:"🇮🇳",n:"India"},{c:"+55",f:"🇧🇷",n:"Brazil"},{c:"+52",f:"🇲🇽",n:"Mexico"},{c:"+7",f:"🇷🇺",n:"Russia"},{c:"+31",f:"🇳🇱",n:"Netherlands"},{c:"+46",f:"🇸🇪",n:"Sweden"},{c:"+65",f:"🇸🇬",n:"Singapore"},{c:"+971",f:"🇦🇪",n:"UAE"},{c:"+27",f:"🇿🇦",n:"South Africa"},{c:"+234",f:"🇳🇬",n:"Nigeria"},{c:"+254",f:"🇰🇪",n:"Kenya"},{c:"+47",f:"🇳🇴",n:"Norway"},{c:"+45",f:"🇩🇰",n:"Denmark"},{c:"+358",f:"🇫🇮",n:"Finland"},{c:"+48",f:"🇵🇱",n:"Poland"},{c:"+380",f:"🇺🇦",n:"Ukraine"},{c:"+90",f:"🇹🇷",n:"Turkey"}].sort(function(a,b){return a.n.localeCompare(b.n);});
const COUNTRIES=["🇦🇼 Aruba","🇦🇺 Australia","🇧🇶 Bonaire","🇧🇷 Brazil","🇨🇼 Curaçao","🇨🇦 Canada","🇨🇳 China","🇩🇰 Denmark","🇫🇮 Finland","🇫🇷 France","🇩🇪 Germany","🇬🇭 Ghana","🇮🇳 India","🇮🇩 Indonesia","🇮🇱 Israel","🇮🇹 Italy","🇯🇵 Japan","🇰🇪 Kenya","🇲🇾 Malaysia","🇲🇽 Mexico","🇳🇱 Netherlands","🇳🇿 New Zealand","🇳🇬 Nigeria","🇳🇴 Norway","🇵🇰 Pakistan","🇵🇭 Philippines","🇵🇱 Poland","🇵🇹 Portugal","🇷🇺 Russia","🇸🇦 Saudi Arabia","🇸🇬 Singapore","🇿🇦 South Africa","🇰🇷 South Korea","🇪🇸 Spain","🇸🇪 Sweden","🇨🇭 Switzerland","🇹🇭 Thailand","🇹🇷 Turkey","🇺🇦 Ukraine","🇦🇪 UAE","🇬🇧 United Kingdom","🇺🇸 United States","🇻🇳 Vietnam","🌍 Prefer not to say"].sort(function(a,b){return a.localeCompare(b);});
const CITIES=["📍 Near me","🗽 New York","🇬🇧 London","🗼 Paris","🏯 Tokyo","🌉 Sydney","🌆 Dubai","🌃 Berlin","🌁 São Paulo","🏙 Toronto","🎭 Barcelona","🌇 Amsterdam","🌴 Miami","🎰 Los Angeles","🌸 Seoul","🏮 Singapore","🛕 Mumbai","🕌 Istanbul","🌊 Cape Town","🎪 Buenos Aires"];
const LANGUAGES=["Arabic","Chinese (Mandarin)","Papiamentu / Papiamento","Danish","Dutch","English","Finnish","French","German","Greek","Hebrew","Hindi","Indonesian","Italian","Japanese","Korean","Malay","Norwegian","Polish","Portuguese","Romanian","Russian","Spanish","Swahili","Swedish","Tamil","Thai","Turkish","Ukrainian","Urdu","Vietnamese"].sort(function(a,b){return a.localeCompare(b);});
const INTENTS=[{id:"curious",l:"Just curious",i:"🔍"},{id:"deep",l:"Deep conversations",i:"🌊"},{id:"fantasy",l:"Exploring fantasies",i:"🌙"},{id:"flirty",l:"Flirty / playful",i:"✨"},{id:"vent",l:"Vent / be heard",i:"🫂"}];
const VIBES=[{id:"t1",l:"Role play"},{id:"t2",l:"Slow burn"},{id:"t3",l:"Dominant energy"},{id:"t4",l:"Submissive energy"},{id:"t5",l:"Late night vibes"},{id:"t6",l:"Creative exploration"}];
const INTERESTS=[{id:"n1",l:"Artsy dates"},{id:"n2",l:"Deep talks"},{id:"n3",l:"Been to therapy"},{id:"n4",l:"Feminism"},{id:"n5",l:"Literature"},{id:"n6",l:"Philosophy"},{id:"n7",l:"Music obsessed"},{id:"n8",l:"Foodies"},{id:"n9",l:"Night owls"},{id:"n10",l:"Solo travelers"}];
const ALL_TO=VIBES.concat(INTERESTS);
const BOK=[{id:"deep",l:"deep topics"},{id:"fantasy",l:"fantasies"},{id:"flirting",l:"flirting"},{id:"photos",l:"photo sharing"},{id:"voice",l:"voice chat"}];
const BNO=[{id:"explicit",l:"explicit messages"},{id:"personal",l:"personal info"},{id:"photos_b",l:"unsolicited photos"},{id:"pressure",l:"pressure"}];
const GENDERS=[{id:"agender",l:"Agender"},{id:"fluid",l:"Gender fluid"},{id:"man",l:"Man"},{id:"nonbinary",l:"Non-binary"},{id:"other",l:"Other"},{id:"prefer_not",l:"Prefer not to say"},{id:"woman",l:"Woman"}];
const RISKY=["nude","explicit","address","come over","phone number","snap","whatsapp"];
const PLANS=[{id:"weekly",label:"Weekly",price:"$4.99",per:"/ week",badge:null},{id:"monthly",label:"Monthly",price:"$14.99",per:"/ month",badge:"Most popular"},{id:"annual",label:"Annual",price:"$69.99",per:"/ year",badge:"Best value"}];
const PF=[{icon:"🥷",label:"Incognito mode",desc:"Browse unseen, hide read receipts"},{icon:"⏳",label:"Expiring messages",desc:"Messages auto-delete after 1h–24h"},{icon:"🌍",label:"City switcher",desc:"Browse any city worldwide"},{icon:"📸",label:"Screenshot alerts",desc:"Know when someone screenshots you"},{icon:"🛰",label:"Safety Signal",desc:"Share live location with a trusted contact"},{icon:"🔥",label:"Boost",desc:"10× more visibility in the feed"},{icon:"✨",label:"Unlimited ads",desc:"Post as many personal ads as you want"},{icon:"💬",label:"Unlimited chats",desc:"No daily chat limit"}];

const T0=Date.now();
const USERS=[
  {id:1,name:"Alex",av:"🌿",intents:["Deep conversations"],compat:94,anon:false,bio:"here to listen and be heard",gender:"Non-binary",country:"🇨🇦 Canada",langs:["English","French"],to:["n2","n3","n6"]},
  {id:2,name:"River",av:"🌙",intents:["Exploring fantasies","Just curious"],compat:81,anon:true,bio:"curious soul, open mind",gender:"Man",country:"🇦🇺 Australia",langs:["English"],to:["t2","t5","n9"]},
  {id:3,name:"Sage",av:"🔥",intents:["Flirty / playful"],compat:76,anon:false,bio:"life is too short to be boring",gender:"Woman",country:"🇧🇷 Brazil",langs:["Portuguese","English"],to:["t1","n1","n8"]},
  {id:4,name:"Echo",av:"💧",intents:["Just curious","Deep conversations"],compat:88,anon:true,bio:"words are my love language",gender:"Prefer not to say",country:"🌍 Prefer not to say",langs:["English","German"],to:["n2","n5","n7"]},
];
const ADS0=[
  {id:"a1",u:USERS[0],text:"Looking for someone to have a real conversation with tonight. No small talk — let's go straight to the weird and wonderful.",exp:T0+3480000,city:"📍 Near me",to:["n2","n6"],liked:false},
  {id:"a2",u:USERS[1],text:"Open to whatever the night brings. Spontaneous, curious, zero judgment. Tell me something you've never told anyone.",exp:T0+1920000,city:"🗽 New York",to:["t5","n9"],liked:false},
  {id:"a3",u:USERS[2],text:"Artsy date? Coffee then a gallery then we'll see. Serious about fun, not much else.",exp:T0+840000,city:"🌴 Miami",to:["n1","n8"],liked:false},
  {id:"a4",u:USERS[3],text:"Night owl seeking another. Late conversations, deep rabbit holes, no agenda. Bonus if you've been to therapy lol.",exp:T0+2700000,city:"📍 Near me",to:["n2","n3","n9"],liked:false},
];
const MSGS0=[
  {id:1,from:"them",text:"hey, saw we matched on deep conversations. what's been on your mind?",time:"9:42 PM",exp:T0+3600000},
  {id:2,from:"me",text:"honestly? trying to figure out what I actually want vs what I think I should want",time:"9:44 PM",exp:T0+3600000},
  {id:3,from:"them",text:"that's so real. society gives us this map but the territory is totally different",time:"9:45 PM",exp:T0+3600000},
];
const CHATS0=[
  {id:1,u:USERS[0],last:"what's been on your mind?",time:"9:42 PM",unread:2,exp:T0+3600000},
  {id:2,u:USERS[2],last:"life is too short!",time:"Yesterday",unread:0,exp:T0+86400000},
  {id:3,u:USERS[3],last:"words are my love language",time:"Mon",unread:1,exp:T0+7200000},
];
const NOTIFS0=[
  {id:1,icon:"💚",text:"Echo wants to connect with you",time:"2m ago",read:false},
  {id:2,icon:"🛡️",text:"You earned the Boundary Keeper badge!",time:"1h ago",read:false},
  {id:3,icon:"📸",text:"Someone screenshotted your ad!",time:"2h ago",read:false},
  {id:4,icon:"💬",text:"Alex sent you a message",time:"3h ago",read:true},
  {id:5,icon:"🔥",text:"7-Day Streak — you're on fire!",time:"1d ago",read:true},
];
const BADGES=[{id:"b1",icon:"🌊",label:"Deep Conversationist",desc:"Had 10+ deep conversations",earned:true},{id:"b2",icon:"🛡️",label:"Boundary Keeper",desc:"Honored boundaries 5 times",earned:true},{id:"b3",icon:"🔥",label:"7-Day Streak",desc:"Used Truth 7 days in a row",earned:true},{id:"b4",icon:"✨",label:"Honest Heart",desc:"Verified real profile 30 days",earned:true},{id:"b5",icon:"⭐",label:"MVP",desc:"Top-rated user this month",earned:false},{id:"b6",icon:"💎",label:"30-Day Streak",desc:"Used Truth 30 days in a row",earned:false},{id:"b7",icon:"🕊️",label:"No Judger",desc:"Received 20 kindness ratings",earned:false},{id:"b8",icon:"🫂",label:"Great Listener",desc:"5 users said you really heard them",earned:false}];
const REPORTS=[{id:1,reporter:"River",reported:"User#4821",reason:"Sent explicit messages",status:"open",time:"10m ago"},{id:2,reporter:"Alex",reported:"User#7723",reason:"Pressure & harassment",status:"reviewing",time:"2h ago"},{id:3,reporter:"Sage",reported:"User#1102",reason:"Fake profile / spam",status:"resolved",time:"1d ago"}];
const BUGS0=[{id:1,title:"Camera fails on iOS 16",sev:"high",status:"open",time:"2h ago"},{id:2,title:"OTP not received on some carriers",sev:"medium",status:"investigating",time:"5h ago"},{id:3,title:"Translate button overlaps small screens",sev:"low",status:"open",time:"1d ago"},{id:4,title:"Badge animation plays twice",sev:"low",status:"resolved",time:"2d ago"}];

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}body{background:#060d09;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#34d39918;}
input::placeholder,textarea::placeholder{color:#2a4a36;}
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
@keyframes glow{0%,100%{opacity:.14}50%{opacity:.32}}
@keyframes drift{0%{transform:translate(0,0)}50%{transform:translate(8px,-12px)}100%{transform:translate(0,0)}}
@keyframes twinkle{0%,100%{opacity:.2}50%{opacity:.9}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pop{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.shell{display:flex;min-height:100vh;background:#060d09;justify-content:center;}
.main{flex:1;display:flex;flex-direction:column;max-width:420px;min-height:100vh;background:#060d09;position:relative;}
.sidebar{display:none;}
@media(min-width:768px){.main{border-radius:24px;min-height:calc(100vh - 48px);margin:24px 0;height:calc(100vh - 48px);box-shadow:0 0 80px #34d39918,0 0 0 1px #34d39918;overflow:hidden;}}
@media(min-width:1100px){.shell{gap:32px;padding:24px 40px;}.sidebar{display:flex;flex-direction:column;gap:6px;width:220px;padding:32px 0;flex-shrink:0;}}
`;

function fmtExp(ms){
  var s=Math.max(0,Math.floor((ms-Date.now())/1000));
  if(s<=0)return"expired";
  if(s<60)return s+"s";
  if(s<3600)return Math.floor(s/60)+"m";
  return Math.floor(s/3600)+"h "+Math.floor((s%3600)/60)+"m";
}
function ExpBadge(props){
  var expiresAt=props.expiresAt;
  var style=props.style||{};
  var _s=useState(fmtExp(expiresAt));var label=_s[0];var setLabel=_s[1];
  useEffect(function(){var t=setInterval(function(){setLabel(fmtExp(expiresAt));},15000);return function(){clearInterval(t);};},[ expiresAt]);
  var urgent=(expiresAt-Date.now())<600000;
  return React.createElement("span",{style:Object.assign({},{padding:"2px 7px",borderRadius:"999px",fontSize:"10px",fontFamily:F,background:urgent?V.danger+"18":V.from+"10",color:urgent?V.danger:V.mid,border:"1px solid "+(urgent?V.danger+"33":V.from+"22"),animation:urgent?"pulse 1.5s ease-in-out infinite":"none"},style)},"⏳ "+label);
}

const NDS=[{id:"c",x:28,y:28,r:3.5,main:true},{id:"a",x:14,y:14,r:2},{id:"b",x:42,y:14,r:2},{id:"d",x:42,y:42,r:2},{id:"e",x:14,y:42,r:2},{id:"f",x:28,y:7,r:1.5},{id:"g",x:49,y:28,r:1.5},{id:"h",x:7,y:28,r:1.5},{id:"i",x:28,y:49,r:1.5}];
const EDS=[["c","a"],["c","b"],["c","d"],["c","e"],["a","f"],["b","f"],["b","g"],["d","g"],["d","i"],["e","i"],["e","h"],["a","h"]];
const NM={};NDS.forEach(function(n){NM[n.id]=n;});

function Mark(props){
  var s=props.s||1;
  var id="g"+Math.round(s*10);
  return(
    <div style={{position:"relative",width:56*s,height:56*s,flexShrink:0}}>
      <div style={{position:"absolute",inset:(-12*s)+"px",borderRadius:"50%",background:"radial-gradient(circle,"+V.from+"33 0%,transparent 70%)",animation:"glow 4s ease-in-out infinite",pointerEvents:"none"}}/>
      <svg width={56*s} height={56*s} viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={V.from}/><stop offset="100%" stopColor={V.to}/></linearGradient>
          <radialGradient id={id+"r"} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={V.mid} stopOpacity="1"/><stop offset="100%" stopColor={V.to} stopOpacity=".5"/></radialGradient>
        </defs>
        {EDS.map(function(e,i){var A=NM[e[0]],B=NM[e[1]];return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={"url(#"+id+")"} strokeWidth=".8" opacity=".35" style={{animation:"twinkle "+(2+i*.2)+"s ease-in-out infinite"}}/>;} )}
        {NDS.filter(function(n){return !n.main;}).map(function(n){return <g key={n.id}><circle cx={n.x} cy={n.y} r={n.r+2} fill={"url(#"+id+")"} fillOpacity=".07"/><circle cx={n.x} cy={n.y} r={n.r} fill={"url(#"+id+"r)"}/></g>;})}
        <circle cx="28" cy="28" r="7" fill={"url(#"+id+")"} fillOpacity=".12" style={{animation:"breathe 3.5s ease-in-out infinite"}}/>
        <circle cx="28" cy="28" r="3.5" fill={"url(#"+id+"r)"}/>
        <circle cx="28" cy="28" r="1.3" fill="#fff" opacity=".9"/>
      </svg>
    </div>
  );
}
function Wm(props){var sz=props.sz||26;return <span style={{fontFamily:SERIF,fontWeight:300,fontSize:sz,letterSpacing:"5px",background:"linear-gradient(135deg,"+V.mid+","+V.to+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",textTransform:"uppercase"}}>Truth</span>;}
function Orb(props){return <div style={Object.assign({},{position:"absolute",borderRadius:"50%",filter:"blur(70px)",opacity:.12,pointerEvents:"none",animation:"drift 10s ease-in-out infinite"},props.style||{})}/>;}
function PBtn(props){var disabled=props.disabled;return <button onClick={props.onClick} disabled={disabled} style={Object.assign({},{width:"100%",padding:"14px",borderRadius:"14px",background:disabled?"#0f1a12":"linear-gradient(135deg,"+V.from+","+V.to+")",border:"1px solid "+(disabled?V.border:"transparent"),color:disabled?V.muted:"#fff",fontSize:"15px",fontWeight:"600",cursor:disabled?"not-allowed":"pointer",fontFamily:F,boxShadow:disabled?"none":"0 0 24px "+V.from+"28",transition:"all .2s"},props.style||{})}>{props.children}</button>;}
function GBtn(props){return <button onClick={props.onClick} style={{width:"100%",padding:"12px",borderRadius:"14px",background:"transparent",border:"1px solid "+V.border,color:V.mutedHi,fontSize:"14px",cursor:"pointer",fontFamily:F,marginTop:"10px"}}>{props.children}</button>;}
function GoldBtn(props){return <button onClick={props.onClick} style={{width:"100%",padding:"14px",borderRadius:"14px",background:"linear-gradient(135deg,"+V.gold+",#f97316)",border:"none",color:"#fff",fontSize:"15px",fontWeight:"700",cursor:"pointer",fontFamily:F,boxShadow:"0 0 28px "+V.gold+"44"}}>{props.children}</button>;}
function Chip(props){var color=props.color||V.from;var active=props.active;return <button onClick={props.onClick} style={{padding:"7px 13px",borderRadius:"999px",border:"1px solid "+(active?color:V.border),background:active?color+"18":"transparent",color:active?color:V.muted,fontSize:"12px",cursor:"pointer",transition:"all .2s",fontFamily:F,marginBottom:"6px",marginRight:"6px"}}>{props.label}</button>;}
function Tog(props){var value=props.value;return <div style={{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer"}} onClick={function(){props.onChange(!value);}}><div style={{width:"40px",height:"22px",borderRadius:"11px",background:value?V.from:"#1a2e1e",position:"relative",transition:"background .3s",flexShrink:0}}><div style={{width:"16px",height:"16px",borderRadius:"50%",background:"#fff",position:"absolute",top:"3px",left:value?"21px":"3px",transition:"left .3s"}}/></div>{props.label&&<span style={{color:V.mutedHi,fontSize:"13px",fontFamily:F}}>{props.label}</span>}</div>;}
function Nav(props){return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"26px"}}><button onClick={props.onBack} style={{background:"none",border:"none",color:V.muted,cursor:"pointer",fontSize:"20px",fontFamily:F}}>←</button><span style={{color:V.muted,fontSize:"10px",letterSpacing:".1em",textTransform:"uppercase",fontFamily:F}}>{props.title}</span>{props.onSkip?<button onClick={props.onSkip} style={{background:"none",border:"none",color:V.muted,cursor:"pointer",fontSize:"13px",fontFamily:F}}>skip</button>:<div style={{width:40}}/>}</div>;}
function Prog(props){return <div style={{height:"2px",background:"#0a150c",flexShrink:0}}><div style={{height:"100%",width:((props.step/props.total)*100)+"%",background:"linear-gradient(90deg,"+V.from+","+V.to+")",transition:"width .4s ease"}}/></div>;}
function LR(){return <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"18px"}}><Mark s={.6}/><Wm sz={18}/></div>;}
function SH(props){return <h2 style={{fontSize:"23px",fontWeight:"700",letterSpacing:"-.03em",marginBottom:"7px",color:V.text,fontFamily:F,lineHeight:1.2}}>{props.children}</h2>;}
function ST(props){return <p style={{color:V.muted,fontSize:"13px",lineHeight:1.7,marginBottom:"22px",fontFamily:F}}>{props.children}</p>;}
function FL(props){return <label style={{color:V.muted,fontSize:"10px",letterSpacing:".1em",marginBottom:"7px",display:"block",textTransform:"uppercase",fontFamily:F}}>{props.children}</label>;}
function Modal(props){return <div style={{position:"absolute",inset:0,background:"#000c",zIndex:50,display:"flex",alignItems:"flex-end",padding:"18px"}} onClick={function(e){if(e.target===e.currentTarget)props.onClose();}}><div style={{background:V.card,borderRadius:"20px",padding:"24px",width:"100%",animation:"slideUp .3s ease",maxHeight:"88vh",overflowY:"auto"}}>{props.children}</div></div>;}
function Sin(props){return <input value={props.value} onChange={function(e){props.onChange(e.target.value);}} placeholder={props.placeholder} style={{width:"100%",padding:"10px 14px",borderRadius:"11px",background:"#0a140c",border:"1px solid "+V.border,color:V.text,fontSize:"13px",fontFamily:F,outline:"none",marginBottom:"10px"}}/>;}
function PBadge(){return <span style={{padding:"2px 7px",borderRadius:"999px",fontSize:"10px",fontFamily:F,background:V.goldBg,color:V.gold,border:"1px solid "+V.gold+"33",fontWeight:"600"}}>✦ Premium</span>;}
function SettSec(props){return <div style={{marginBottom:"22px"}}><div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}><div style={{height:"1px",flex:1,background:V.border}}/><span style={{color:V.muted,fontSize:"10px",letterSpacing:".1em",fontFamily:F,whiteSpace:"nowrap"}}>{props.t}</span><div style={{height:"1px",flex:1,background:V.border}}/></div>{props.c}</div>;}
function SettRow(props){return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid "+V.border}}><div style={{flex:1,marginRight:"14px"}}><div style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{color:V.text,fontSize:"13px",fontFamily:F,fontWeight:"500"}}>{props.l}</div>{props.prem&&<PBadge/>}</div>{props.d&&<div style={{color:V.muted,fontSize:"11px",fontFamily:F,marginTop:"2px",lineHeight:1.4}}>{props.d}</div>}</div>{props.children}</div>;}

function Welcome(props){
  var _v=useState(false);var vis=_v[0];var setVis=_v[1];
  useEffect(function(){var t=setTimeout(function(){setVis(true);},80);return function(){clearTimeout(t);};}, []);
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"32px 24px",position:"relative",overflow:"hidden"}}>
      <Orb style={{width:300,height:300,background:V.from,top:-100,left:-100}}/>
      <Orb style={{width:240,height:240,background:V.to,bottom:40,right:-80,animationDelay:"2s"}}/>
      <Orb style={{width:160,height:160,background:V.mid,bottom:200,left:0,animationDelay:"4s"}}/>
      <div style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(20px)",transition:"all 1.1s ease",display:"flex",flexDirection:"column",alignItems:"center",gap:"20px",width:"100%"}}>
        <Mark s={1.5}/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px"}}><Wm sz={38}/><p style={{fontFamily:F,fontSize:"10px",letterSpacing:"5px",color:V.muted}}>BE SEEN · STAY HIDDEN</p></div>
        <p style={{color:"#2e5040",fontSize:"14px",lineHeight:1.8,maxWidth:"250px",fontFamily:F}}>A space for the parts of you that you usually keep hidden.</p>
        <PBtn onClick={props.onNext} style={{maxWidth:"240px"}}>Welcome</PBtn>
        <p style={{color:"#1a2e1e",fontSize:"10px",letterSpacing:".05em",fontFamily:F}}>SAFE · VERIFIED · 21+ ONLY</p>
      </div>
    </div>
  );
}

function Verify(props){
  var _d=useState(PHONE_CODES.filter(function(c){return c.n==="United States";})[0]||PHONE_CODES[0]);var dial=_d[0];var setDial=_d[1];
  var _sd=useState(false);var showDial=_sd[0];var setShowDial=_sd[1];
  var _dq=useState("");var dialQ=_dq[0];var setDialQ=_dq[1];
  var _ph=useState("");var phone=_ph[0];var setPhone=_ph[1];
  var _em=useState("");var email=_em[0];var setEmail=_em[1];
  var _ue=useState(true);var useEmail=_ue[0];var setUseEmail=_ue[1];
  var _ot=useState("");var otp=_ot[0];var setOtp=_ot[1];
  var _dd=useState("");var dobD=_dd[0];var setDobD=_dd[1];
  var _dm=useState("");var dobM=_dm[0];var setDobM=_dm[1];
  var _dy=useState("");var dobY=_dy[0];var setDobY=_dy[1];
  var _de=useState("");var dobErr=_de[0];var setDobErr=_de[1];
  var _st=useState("contact");var step=_st[0];var setStep=_st[1];
  var _ss=useState("idle");var selfSt=_ss[0];var setSelfSt=_ss[1];
  var _si=useState(null);var selfImg=_si[0];var setSelfImg=_si[1];
  var _ld=useState(false);var loading=_ld[0];var setLoading=_ld[1];
  var _er=useState("");var err=_er[0];var setErr=_er[1];
  var vidRef=useRef(null);var canRef=useRef(null);var strRef=useRef(null);
  var filtered=PHONE_CODES.filter(function(c){return (c.n+" "+c.c).toLowerCase().includes(dialQ.toLowerCase());});
  useEffect(function(){return function(){if(strRef.current)strRef.current.getTracks().forEach(function(t){t.stop();});};}, []);

  function sendOtp(){
    setLoading(true);setErr("");
    var p=useEmail?{email:email,options:{shouldCreateUser:true}}:{phone:dial.c+phone};
    sb.sendOtp(p).then(function(r){if(r.error)setErr(r.error.message);else setStep("otp");setLoading(false);});
  }
  function verifyOtp(){
    setLoading(true);setErr("");
    var p=useEmail?{email:email,token:otp,type:"email"}:{phone:dial.c+phone,token:otp,type:"sms"};
    sb.verifyOtp(p).then(function(r){if(r.error)setErr(r.error.message);else setStep("dob");setLoading(false);});
  }
  function verifyDob(){
    setDobErr("");
    var d=parseInt(dobD),m=parseInt(dobM),y=parseInt(dobY);
    if(!d||!m||!y||y<1900||y>new Date().getFullYear()){setDobErr("Please enter a valid date of birth.");return;}
    if(d<1||d>31||m<1||m>12){setDobErr("Please check day and month values.");return;}
    var dob=new Date(y,m-1,d);var today=new Date();
    var age=today.getFullYear()-dob.getFullYear();
    if(today.getMonth()<dob.getMonth()||(today.getMonth()===dob.getMonth()&&today.getDate()<dob.getDate()))age--;
    if(age<21){setDobErr("You must be 21 or older to use Truth.");return;}
    setStep("selfie");
  }
  function openCam(){
    setSelfSt("camera");setErr("");
    navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false}).then(function(st){
      strRef.current=st;
      if(vidRef.current){vidRef.current.srcObject=st;vidRef.current.play();}
    }).catch(function(){setErr("Camera unavailable — simulated for demo.");setSelfSt("captured");});
  }
  function snap(){
    if(canRef.current&&vidRef.current&&vidRef.current.videoWidth){
      var ctx=canRef.current.getContext("2d");
      canRef.current.width=vidRef.current.videoWidth;canRef.current.height=vidRef.current.videoHeight;
      ctx.save();ctx.scale(-1,1);ctx.drawImage(vidRef.current,-canRef.current.width,0);ctx.restore();
      setSelfImg(canRef.current.toDataURL("image/jpeg",.85));
    }
    if(strRef.current)strRef.current.getTracks().forEach(function(t){t.stop();});
    setSelfSt("captured");
  }
  function process(){
    setStep("processing");
    setTimeout(function(){props.onNext();},1800);
  }

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:"28px 22px",position:"relative",overflow:"hidden"}}>
      <Orb style={{width:180,height:180,background:V.to,top:-20,right:-50}}/>
      <Nav onBack={props.onBack} title="verification"/><LR/>
      <SH>We verify everyone.</SH><ST>Contact, age, then a quick selfie. You can stay anonymous after this.</ST>
      <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 14px",borderRadius:"12px",background:V.from+"08",border:"1px solid "+V.border,marginBottom:"18px"}}>
        <span style={{fontSize:"18px"}}>✉️</span>
        <span style={{color:V.mid,fontSize:"13px",fontFamily:F,fontWeight:"600"}}>Email verification</span>
      </div>
      {step==="contact"&&<div>
        {!useEmail&&<div>
          <FL>Country Code</FL>
          <div style={{position:"relative",marginBottom:"10px"}}>
            <button onClick={function(){setShowDial(!showDial);}} style={{width:"100%",padding:"12px 14px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+(showDial?V.borderMid:V.border),color:V.text,fontSize:"13px",fontFamily:F,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{fontSize:"18px"}}>{dial.f}</span><span style={{color:V.mid,fontWeight:"600"}}>{dial.c}</span><span style={{color:V.muted,flex:1}}>{dial.n}</span><span style={{color:V.muted,fontSize:"11px"}}>{showDial?"▲":"▼"}</span>
            </button>
            {showDial&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:60,background:"#0a140c",border:"1px solid "+V.border,borderRadius:"14px",maxHeight:"220px",overflowY:"auto",boxShadow:"0 12px 40px #000"}}>
              <div style={{padding:"8px 12px",borderBottom:"1px solid "+V.border,position:"sticky",top:0,background:"#0a140c"}}><input value={dialQ} onChange={function(e){setDialQ(e.target.value);}} placeholder="Search country…" style={{width:"100%",background:"none",border:"none",color:V.text,fontSize:"13px",fontFamily:F,outline:"none"}}/></div>
              {filtered.map(function(c,i){return <button key={i} onClick={function(){setDial(c);setShowDial(false);setDialQ("");}} style={{width:"100%",padding:"10px 14px",background:c.n===dial.n?V.from+"10":"transparent",border:"none",borderBottom:"1px solid "+V.border,color:c.n===dial.n?V.from:V.muted,fontSize:"13px",textAlign:"left",cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontSize:"16px"}}>{c.f}</span><span style={{color:V.mid,minWidth:"42px",flexShrink:0}}>{c.c}</span><span>{c.n}</span></button>;})}
            </div>}
          </div>
          <FL>Phone Number</FL>
          <div style={{display:"flex",gap:"8px",marginBottom:"14px"}}>
            <div style={{padding:"12px 13px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+V.border,color:V.mid,fontSize:"13px",fontFamily:F,fontWeight:"600",flexShrink:0}}>{dial.c}</div>
            <input value={phone} onChange={function(e){setPhone(e.target.value);}} placeholder="6 789 0123" style={{flex:1,padding:"12px 14px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+V.border,color:V.text,fontSize:"14px",fontFamily:F,outline:"none"}}/>
          </div>
        </div>}
        {useEmail&&<div style={{marginBottom:"14px"}}><FL>Email Address</FL><input value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="you@example.com" type="email" style={{width:"100%",padding:"12px 14px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+V.border,color:V.text,fontSize:"14px",fontFamily:F,outline:"none",boxSizing:"border-box"}}/></div>}
        {err&&<p style={{color:V.warn,fontSize:"12px",fontFamily:F,marginBottom:"10px",padding:"10px",background:V.warn+"10",borderRadius:"10px",lineHeight:1.5}}>{err}</p>}
        <div style={{flex:1}}/>
        <PBtn onClick={sendOtp} disabled={useEmail?!email.trim():!phone.trim()}>{loading?"Sending…":"Send code"}</PBtn>
      </div>}
      {step==="otp"&&<div>
        <FL>6-digit code</FL>
        <input value={otp} onChange={function(e){setOtp(e.target.value);}} placeholder="000000" maxLength={6} style={{width:"100%",padding:"14px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+(err?V.danger:V.border),color:V.text,fontSize:"26px",fontFamily:F,outline:"none",textAlign:"center",letterSpacing:"8px",marginBottom:"8px"}}/>
        <p style={{color:V.muted,fontSize:"12px",fontFamily:F,marginBottom:"6px"}}>Sent to {useEmail?email:dial.c+" "+phone}</p>
        {DEMO_MODE&&<p style={{color:V.from,fontSize:"12px",fontFamily:F,marginBottom:"14px",padding:"8px 12px",background:V.from+"0d",borderRadius:"9px",border:"1px solid "+V.from+"22"}}>🧪 Demo mode — enter <strong>000000</strong> to continue</p>}
        {err&&<p style={{color:V.danger,fontSize:"12px",fontFamily:F,marginBottom:"12px",padding:"10px",background:V.dangerBg,borderRadius:"10px"}}>{err}</p>}
        <div style={{flex:1}}/>
        <PBtn onClick={verifyOtp} disabled={otp.length<6}>{loading?"Verifying…":"Verify"}</PBtn>
        <GBtn onClick={function(){setStep("contact");setOtp("");setErr("");}}>Change contact</GBtn>
      </div>}
      {step==="dob"&&<div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"12px 14px",borderRadius:"12px",background:V.from+"07",border:"1px solid "+V.border,marginBottom:"18px"}}>
          <span style={{fontSize:"20px"}}>🎂</span>
          <div><p style={{color:V.mid,fontSize:"13px",fontFamily:F,fontWeight:"600"}}>Age verification required</p><p style={{color:V.muted,fontSize:"11px",fontFamily:F,marginTop:"2px",lineHeight:1.4}}>Truth is 21+. Please confirm your date of birth.</p></div>
        </div>
        <FL>Date of Birth</FL>
        <div style={{display:"flex",gap:"10px",marginBottom:"8px"}}>
          {[{l:"Day",p:"DD",ml:2,v:dobD,s:setDobD,flex:1},{l:"Month",p:"MM",ml:2,v:dobM,s:setDobM,flex:1},{l:"Year",p:"YYYY",ml:4,v:dobY,s:setDobY,flex:2}].map(function(f){return <div key={f.l} style={{flex:f.flex}}><label style={{color:V.muted,fontSize:"10px",letterSpacing:".06em",display:"block",marginBottom:"5px",fontFamily:F}}>{f.l}</label><input value={f.v} onChange={function(e){f.s(e.target.value.replace(/\D/g,""));}} placeholder={f.p} maxLength={f.ml} style={{width:"100%",padding:"13px 8px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+(dobErr?V.danger:V.border),color:V.text,fontSize:"18px",fontFamily:F,outline:"none",boxSizing:"border-box",textAlign:"center",fontWeight:"600"}}/></div>;})}
        </div>
        {dobErr&&<div style={{padding:"10px 14px",borderRadius:"10px",background:V.dangerBg,border:"1px solid "+V.danger+"44",marginBottom:"12px",display:"flex",gap:"8px"}}><span style={{fontSize:"14px",flexShrink:0}}>🚫</span><p style={{color:V.danger,fontSize:"12px",fontFamily:F,lineHeight:1.5}}>{dobErr}</p></div>}
        <div style={{padding:"10px 12px",borderRadius:"10px",background:"#0a140c",border:"1px solid "+V.border,marginBottom:"20px"}}><p style={{color:V.muted,fontSize:"11px",fontFamily:F,lineHeight:1.6}}>🔒 Stored securely, never shown to others.</p></div>
        <div style={{flex:1}}/>
        <PBtn onClick={verifyDob} disabled={!dobD||!dobM||!dobY}>Confirm my age</PBtn>
        <GBtn onClick={function(){setStep("otp");setDobErr("");}}>← Back</GBtn>
      </div>}
      {step==="selfie"&&<div>
        <FL>ID Verification</FL>
        <div style={{padding:"12px 14px",borderRadius:"12px",background:V.from+"08",border:"1px solid "+V.border,marginBottom:"14px"}}>
          <p style={{color:V.mid,fontSize:"13px",fontFamily:F,fontWeight:"600",marginBottom:"4px"}}>📸 Selfie holding your ID</p>
          <p style={{color:V.muted,fontSize:"11px",fontFamily:F,lineHeight:1.6}}>Hold your ID, Passport or Driver's Licence next to your face so both are clearly visible. Used for age verification only — never shown to others.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"14px"}}>
          {["🪪 National ID card","📘 Passport","🚗 Driver's licence"].map(function(item){return <div key={item} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 12px",borderRadius:"10px",background:"#0a140c",border:"1px solid "+V.border}}><span style={{fontSize:"15px"}}>{item.split(" ")[0]}</span><span style={{color:V.mutedHi,fontSize:"12px",fontFamily:F}}>{item.split(" ").slice(1).join(" ")}</span></div>;})}
        </div>
        {selfSt==="idle"&&<button onClick={openCam} style={{width:"100%",padding:"24px 20px",borderRadius:"16px",border:"2px dashed "+V.border,background:V.card,color:V.mutedHi,fontSize:"14px",cursor:"pointer",fontFamily:F,display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}><span style={{fontSize:"34px"}}>📷</span><span>Tap to open camera</span><span style={{fontSize:"11px",color:V.muted}}>Face + ID must both be visible</span></button>}
        {selfSt==="camera"&&<div style={{position:"relative",borderRadius:"16px",overflow:"hidden",border:"1px solid "+V.border}}>
          <video ref={vidRef} style={{width:"100%",display:"block",transform:"scaleX(-1)"}} playsInline muted/>
          <canvas ref={canRef} style={{display:"none"}}/>
          <div style={{position:"absolute",top:"10px",left:0,right:0,textAlign:"center"}}><span style={{background:"#000a",color:"#fff",fontSize:"10px",fontFamily:F,padding:"4px 12px",borderRadius:"999px"}}>Hold ID next to your face 🪪</span></div>
          <div style={{position:"absolute",bottom:"14px",left:"50%",transform:"translateX(-50%)"}}>
            <button onClick={snap} style={{width:"64px",height:"64px",borderRadius:"50%",background:"linear-gradient(135deg,"+V.from+","+V.to+")",border:"3px solid #fff",cursor:"pointer",fontSize:"26px",display:"flex",alignItems:"center",justifyContent:"center"}}>📸</button>
          </div>
        </div>}
        {selfSt==="captured"&&<div style={{borderRadius:"16px",overflow:"hidden",border:"1px solid "+V.from+"44",position:"relative"}}>
          {selfImg?<img src={selfImg} style={{width:"100%",display:"block"}} alt="id-selfie"/>:<div style={{padding:"40px",background:V.from+"08",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"}}><span style={{fontSize:"48px"}}>✓</span><span style={{color:V.mid,fontSize:"13px",fontFamily:F}}>Photo captured</span></div>}
          <div style={{position:"absolute",top:"10px",right:"10px",background:V.from+"dd",borderRadius:"7px",padding:"3px 9px"}}><span style={{color:"#fff",fontSize:"11px",fontFamily:F,fontWeight:"600"}}>✓ Captured</span></div>
        </div>}
        {err&&<p style={{color:V.warn,fontSize:"11px",fontFamily:F,marginTop:"8px",lineHeight:1.5}}>{err}</p>}
        <p style={{color:V.muted,fontSize:"10px",fontFamily:F,marginTop:"8px",marginBottom:"14px",textAlign:"center"}}>🔒 Securely verified · Never shown to other users</p>
        <div style={{flex:1}}/>
        {selfSt==="captured"&&<PBtn onClick={process}>Continue →</PBtn>}
        {selfSt==="captured"&&<GBtn onClick={openCam}>Retake photo</GBtn>}
        {selfSt==="idle"&&<GBtn onClick={openCam}>Open camera</GBtn>}
      </div>}
      {step==="processing"&&<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"18px"}}>
        <Mark s={1.1}/><p style={{color:V.text,fontSize:"14px",fontFamily:F,fontWeight:"600"}}>Verifying your selfie…</p>
        <div style={{width:"38px",height:"38px",borderRadius:"50%",border:"2px solid "+V.border,borderTop:"2px solid "+V.from,animation:"spin 1s linear infinite"}}/>
      </div>}
    </div>
  );
}

function Identity(props){
  var _c=useState(null);var choice=_c[0];var setChoice=_c[1];
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:"28px 22px",position:"relative",overflow:"hidden"}}>
      <Orb style={{width:220,height:220,background:V.from,bottom:60,right:-70}}/>
      <Nav onBack={props.onBack} title="identity"/><LR/>
      <SH>How do you want to show up?</SH><ST>You can switch anytime. No commitment.</ST>
      {[{id:"real",icon:"👤",title:"Real profile",desc:"Your name, your photos. Build genuine connections."},{id:"anon",icon:"🎭",title:"Anonymous",desc:"Nickname + avatar. Explore freely, reveal when ready."}].map(function(opt){return(
        <button key={opt.id} onClick={function(){setChoice(opt.id);}} style={{width:"100%",padding:"20px",borderRadius:"18px",marginBottom:"10px",border:"1px solid "+(choice===opt.id?V.from:V.border),background:choice===opt.id?V.from+"0a":V.card,textAlign:"left",cursor:"pointer",fontFamily:F,transition:"all .25s"}}>
          <div style={{fontSize:"24px",marginBottom:"8px"}}>{opt.icon}</div>
          <div style={{color:choice===opt.id?V.mid:V.mutedHi,fontWeight:"600",marginBottom:"3px",fontSize:"15px",fontFamily:F}}>{opt.title}</div>
          <div style={{color:V.muted,fontSize:"13px",lineHeight:1.5,fontFamily:F}}>{opt.desc}</div>
        </button>
      );})}
      <div style={{flex:1}}/><PBtn onClick={props.onNext} disabled={!choice}>Continue</PBtn>
    </div>
  );
}

function Intent(props){
  var _s=useState([]);var sel=_s[0];var setSel=_s[1];
  function tog(id){setSel(function(p){return p.includes(id)?p.filter(function(x){return x!==id;}):[].concat(p,[id]);});}
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:"28px 22px",position:"relative",overflow:"hidden"}}>
      <Orb style={{width:200,height:200,background:V.from,top:-30,right:-50}}/>
      <Nav onBack={props.onBack} title="intent"/><LR/>
      <SH>What kind of connection are you open to?</SH><ST>Select all that resonate. Change anytime.</ST>
      <div style={{display:"flex",flexDirection:"column",gap:"9px",marginBottom:"20px"}}>
        {INTENTS.map(function(opt){var a=sel.includes(opt.id);return(
          <button key={opt.id} onClick={function(){tog(opt.id);}} style={{padding:"14px 16px",borderRadius:"13px",textAlign:"left",border:"1px solid "+(a?V.from:V.border),background:a?V.from+"0c":V.card,cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:"13px",transition:"all .2s"}}>
            <span style={{fontSize:"20px"}}>{opt.i}</span>
            <span style={{color:a?V.mid:V.muted,fontSize:"14px",fontFamily:F,flex:1}}>{opt.l}</span>
            {a&&<span style={{color:V.from,fontSize:"12px"}}>✓</span>}
          </button>
        );})}
      </div>
      <div style={{flex:1}}/><PBtn onClick={props.onNext} disabled={sel.length===0}>Set my intent</PBtn>
    </div>
  );
}

function TurnOns(props){
  var _s=useState([]);var sel=_s[0];var setSel=_s[1];
  function tog(id){setSel(function(p){return p.includes(id)?p.filter(function(x){return x!==id;}):[].concat(p,[id]);});}
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:"28px 22px",position:"relative",overflow:"hidden"}}>
      <Orb style={{width:200,height:200,background:V.to,top:-30,right:-50}}/>
      <Nav onBack={props.onBack} title="turn-ons" onSkip={props.onNext}/><LR/>
      <SH>What are your turn-ons?</SH><ST>Helps match you with the right people. Skip anything you'd rather keep private.</ST>
      <FL>VIBES</FL>
      <div style={{display:"flex",flexWrap:"wrap",marginBottom:"16px"}}>{VIBES.map(function(t){return <Chip key={t.id} label={t.l} active={sel.includes(t.id)} onClick={function(){tog(t.id);}} color={V.to}/>;})}</div>
      <FL>INTERESTS & PERSONALITY</FL>
      <div style={{display:"flex",flexWrap:"wrap",marginBottom:"20px"}}>{INTERESTS.map(function(t){return <Chip key={t.id} label={t.l} active={sel.includes(t.id)} onClick={function(){tog(t.id);}} color={V.from}/>;})}</div>
      <div style={{flex:1}}/><PBtn onClick={props.onNext}>Save my turn-ons</PBtn>
    </div>
  );
}

function Boundaries(props){
  var _ok=useState(["flirting","deep"]);var ok=_ok[0];var setOk=_ok[1];
  var _no=useState(["explicit","pressure"]);var no=_no[0];var setNo=_no[1];
  function togOk(id){setOk(function(p){return p.includes(id)?p.filter(function(x){return x!==id;}):[].concat(p,[id]);});}
  function togNo(id){setNo(function(p){return p.includes(id)?p.filter(function(x){return x!==id;}):[].concat(p,[id]);});}
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:"28px 22px",position:"relative",overflow:"hidden"}}>
      <Nav onBack={props.onBack} title="boundaries"/><LR/>
      <SH>Set your boundaries.</SH><ST>Respected automatically. No awkward conversations.</ST>
      <div style={{marginBottom:"20px"}}><div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"10px"}}><span style={{color:V.from}}>✓</span><span style={{color:V.muted,fontSize:"10px",letterSpacing:".08em",fontFamily:F}}>I'M OKAY WITH</span></div><div style={{display:"flex",flexWrap:"wrap"}}>{BOK.map(function(b){return <Chip key={b.id} label={b.l} active={ok.includes(b.id)} onClick={function(){togOk(b.id);}} color={V.from}/>;})}</div></div>
      <div style={{marginBottom:"20px"}}><div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"10px"}}><span style={{color:V.danger}}>✕</span><span style={{color:V.muted,fontSize:"10px",letterSpacing:".08em",fontFamily:F}}>I'M NOT OKAY WITH</span></div><div style={{display:"flex",flexWrap:"wrap"}}>{BNO.map(function(b){return <Chip key={b.id} label={b.l} active={no.includes(b.id)} onClick={function(){togNo(b.id);}} color={V.danger}/>;})}</div></div>
      <div style={{padding:"12px 14px",borderRadius:"11px",background:V.from+"07",border:"1px solid "+V.border,marginBottom:"18px"}}><p style={{color:"#2e5a3e",fontSize:"12px",lineHeight:1.6,margin:0,fontFamily:F}}>🛡️ Others get a warning before crossing your limits.</p></div>
      <div style={{flex:1}}/><PBtn onClick={props.onNext}>Save my boundaries</PBtn>
    </div>
  );
}

function Profile(props){
  var _bi=useState("");var bio=_bi[0];var setBio=_bi[1];
  var _ag=useState("");var age=_ag[0];var setAge=_ag[1];
  var _ha=useState(false);var hideAge=_ha[0];var setHideAge=_ha[1];
  var _ge=useState(null);var gender=_ge[0];var setGender=_ge[1];
  var _co=useState("");var country=_co[0];var setCountry=_co[1];
  var _sc=useState(false);var showC=_sc[0];var setShowC=_sc[1];
  var _cq=useState("");var cQ=_cq[0];var setCQ=_cq[1];
  var _la=useState([]);var langs=_la[0];var setLangs=_la[1];
  var _lq=useState("");var langQ=_lq[0];var setLangQ=_lq[1];
  var fL=LANGUAGES.filter(function(l){return l.toLowerCase().includes(langQ.toLowerCase());});
  var fC=COUNTRIES.filter(function(c){return c.toLowerCase().includes(cQ.toLowerCase());});
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:"28px 22px 36px",position:"relative",overflow:"hidden"}}>
      <Orb style={{width:160,height:160,background:V.to,top:10,right:-30}}/>
      <Nav onBack={props.onBack} title="profile" onSkip={props.onNext}/><LR/>
      <SH>A little about you.</SH><ST>Keep it real, keep it light.</ST>
      <div style={{display:"flex",gap:"10px",marginBottom:"18px"}}>{[0,1,2].map(function(i){return <div key={i} style={{flex:1,aspectRatio:"1",borderRadius:"13px",border:"1.5px dashed "+V.border,background:"#070f09",display:"flex",alignItems:"center",justifyContent:"center",color:V.muted,fontSize:i===0?"17px":"14px",cursor:"pointer"}}>{i===0?"📷":"+"}</div>;})}</div>
      <FL>Bio</FL>
      <textarea value={bio} onChange={function(e){setBio(e.target.value);}} placeholder="What should people know? (optional)" maxLength={120} style={{width:"100%",padding:"12px 14px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+V.border,color:V.text,fontSize:"13px",fontFamily:F,resize:"none",height:"70px",outline:"none",boxSizing:"border-box",marginBottom:"14px"}}/>
      <div style={{display:"flex",gap:"12px",alignItems:"flex-end",marginBottom:"14px"}}>
        <div style={{flex:1}}><FL>Age (21+)</FL><input value={age} onChange={function(e){setAge(e.target.value);}} placeholder="25" type="number" min="21" style={{width:"100%",padding:"12px 13px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+V.border,color:V.text,fontSize:"14px",fontFamily:F,outline:"none",boxSizing:"border-box"}}/></div>
        <div style={{paddingBottom:"3px"}}><Tog value={hideAge} onChange={setHideAge} label="Hide age"/></div>
      </div>
      <FL>Gender</FL>
      <div style={{display:"flex",flexWrap:"wrap",marginBottom:"14px"}}>{GENDERS.map(function(g){return <Chip key={g.id} label={g.l} active={gender===g.id} onClick={function(){setGender(g.id);}}/>;})}</div>
      <FL>Country</FL>
      <button onClick={function(){setShowC(!showC);}} style={{width:"100%",padding:"12px 14px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+(showC?V.borderMid:V.border),color:country?V.text:V.muted,fontSize:"13px",fontFamily:F,textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
        <span>{country||"Where are you from?"}</span><span style={{color:V.muted}}>{showC?"▲":"▼"}</span>
      </button>
      {showC&&<div style={{borderRadius:"12px",border:"1px solid "+V.border,background:"#0a140c",marginBottom:"10px",overflow:"hidden"}}>
        <div style={{padding:"8px 12px",borderBottom:"1px solid "+V.border}}><input value={cQ} onChange={function(e){setCQ(e.target.value);}} placeholder="Search country…" style={{width:"100%",background:"none",border:"none",color:V.text,fontSize:"13px",fontFamily:F,outline:"none"}}/></div>
        <div style={{maxHeight:"140px",overflowY:"auto"}}>{fC.map(function(c){return <button key={c} onClick={function(){setCountry(c);setShowC(false);setCQ("");}} style={{width:"100%",padding:"9px 14px",background:c===country?V.from+"0d":"transparent",border:"none",borderBottom:"1px solid "+V.border,color:c===country?V.from:V.muted,fontSize:"13px",textAlign:"left",cursor:"pointer",fontFamily:F}}>{c}</button>;})}</div>
      </div>}
      <FL>Languages I speak</FL>
      <Sin value={langQ} onChange={setLangQ} placeholder="Search languages…"/>
      <div style={{display:"flex",flexWrap:"wrap",marginBottom:"6px"}}>{fL.map(function(l){var act=langs.includes(l);return <Chip key={l} label={l} active={act} onClick={function(){setLangs(function(p){return act?p.filter(function(x){return x!==l;}):[].concat(p,[l]);});}} color={V.to}/>;})}</div>
      {langs.length>0&&<div style={{padding:"8px 12px",borderRadius:"10px",background:V.to+"09",border:"1px solid "+V.to+"18",marginBottom:"6px"}}><span style={{color:V.to,fontSize:"12px",fontFamily:F}}>Speaking: {langs.join(", ")}</span></div>}
      <div style={{height:"20px"}}/><PBtn onClick={props.onNext}>Looks good</PBtn>
    </div>
  );
}

function AdFeed(props){
  var ads=props.ads;var setAds=props.setAds;var onChat=props.onChat;var isPremium=props.isPremium;var onUpgrade=props.onUpgrade;
  var _cy=useState("📍 Near me");var city=_cy[0];var setCity=_cy[1];
  var _sc=useState(false);var showCity=_sc[0];var setShowCity=_sc[1];
  var _sp=useState(false);var showPost=_sp[0];var setShowPost=_sp[1];
  var _at=useState("");var adText=_at[0];var setAdText=_at[1];
  var _ao=useState([]);var adTo=_ao[0];var setAdTo=_ao[1];
  var _ae=useState(3600000);var adExp=_ae[0];var setAdExp=_ae[1];
  var _po=useState(false);var posting=_po[0];var setPosting=_po[1];
  var visAds=ads.filter(function(a){return a.exp>Date.now()&&(city==="📍 Near me"||a.city===city||a.city==="📍 Near me");});
  function likeAd(id){setAds(function(p){return p.map(function(a){return a.id===id?Object.assign({},a,{liked:!a.liked}):a;});});}
  function postAd(){
    if(!adText.trim())return;
    setPosting(true);
    setTimeout(function(){
      setAds(function(p){return [{id:"my"+Date.now(),u:{id:99,name:"You",av:"✨",anon:false},text:adText,exp:Date.now()+adExp,city:city,to:adTo,liked:false,isOwn:true}].concat(p);});
      setAdText("");setAdTo([]);setShowPost(false);setPosting(false);
    },700);
  }
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"12px 16px 10px",borderBottom:"1px solid "+V.border,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"7px"}}><Mark s={.45}/><Wm sz={16}/></div>
          <div style={{display:"flex",gap:"7px",alignItems:"center"}}>
            <div style={{position:"relative"}}>
              <button onClick={function(){if(isPremium)setShowCity(!showCity);else onUpgrade();}} style={{padding:"5px 10px",borderRadius:"8px",border:"1px solid "+(isPremium?V.border:V.gold+"44"),background:isPremium?"transparent":V.goldBg,color:isPremium?V.mutedHi:V.gold,fontSize:"11px",cursor:"pointer",fontFamily:F}}>
                {isPremium?"":"\u2734 "}{city.split(" ").slice(0,2).join(" ")} ▾
              </button>
              {showCity&&isPremium&&<div style={{position:"absolute",top:"calc(100% + 4px)",right:0,zIndex:60,background:"#0a140c",border:"1px solid "+V.border,borderRadius:"12px",width:"190px",maxHeight:"230px",overflowY:"auto",boxShadow:"0 12px 40px #000"}}>
                {CITIES.map(function(c){return <button key={c} onClick={function(){setCity(c);setShowCity(false);}} style={{width:"100%",padding:"9px 13px",background:c===city?V.from+"10":"transparent",border:"none",borderBottom:"1px solid "+V.border,color:c===city?V.from:V.muted,fontSize:"12px",textAlign:"left",cursor:"pointer",fontFamily:F}}>{c}</button>;}) }
              </div>}
            </div>
            <button onClick={function(){setShowPost(true);}} style={{padding:"5px 12px",borderRadius:"8px",background:"linear-gradient(135deg,"+V.from+","+V.to+")",border:"none",color:"#fff",fontSize:"11px",fontWeight:"600",cursor:"pointer",fontFamily:F}}>+ Post ad</button>
          </div>
        </div>
        <p style={{color:V.muted,fontSize:"11px",fontFamily:F}}>Live personal ads · like to unlock chat</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"10px 14px 20px"}}>
        {visAds.length===0&&<div style={{textAlign:"center",padding:"40px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:"12px"}}><Mark s={.7}/><p style={{fontSize:"13px",color:V.muted,fontFamily:F}}>No active ads in this city.<br/>Be the first to post one!</p></div>}
        {visAds.map(function(ad){return(
          <div key={ad.id} style={{borderRadius:"18px",border:"1px solid "+(ad.isOwn?V.from+"44":V.border),background:V.card,padding:"14px",marginBottom:"10px",animation:"fadein .3s ease"}}>
            <div style={{display:"flex",gap:"10px",marginBottom:"10px",alignItems:"flex-start"}}>
              <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"#0a140c",border:"1px solid "+V.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>{ad.u.anon?"🎭":ad.u.av}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px"}}>
                  <span style={{color:V.text,fontWeight:"600",fontSize:"13px",fontFamily:F}}>{ad.u.anon?"Anonymous":ad.u.name}</span>
                  {ad.isOwn&&<span style={{color:V.from,fontSize:"10px",fontFamily:F}}>· you</span>}
                  <span style={{color:V.muted,fontSize:"10px",fontFamily:F,marginLeft:"auto"}}>{ad.city}</span>
                </div>
                <ExpBadge expiresAt={ad.exp}/>
              </div>
            </div>
            <p style={{color:"#b8d0c0",fontSize:"13px",lineHeight:1.7,fontFamily:F,marginBottom:"10px"}}>{ad.text}</p>
            {ad.to&&ad.to.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"10px"}}>{ad.to.slice(0,4).map(function(tid){var t=ALL_TO.filter(function(x){return x.id===tid;})[0];return t?<span key={tid} style={{padding:"2px 7px",borderRadius:"999px",fontSize:"10px",background:V.to+"0d",color:"#6a7ad8",border:"1px solid "+V.to+"18",fontFamily:F}}>{t.l}</span>:null;})}</div>}
            {!ad.isOwn&&<div style={{display:"flex",gap:"8px"}}>
              <button onClick={function(){likeAd(ad.id);}} style={{padding:"8px 14px",borderRadius:"10px",background:ad.liked?V.danger+"14":"transparent",border:"1px solid "+(ad.liked?V.danger+"44":V.border),color:ad.liked?V.danger:V.muted,cursor:"pointer",fontFamily:F,fontSize:"12px",transition:"all .2s"}}>{ad.liked?"❤️ Liked":"🤍 Like"}</button>
              {ad.liked&&<button onClick={function(){onChat(ad.u);}} style={{flex:1,padding:"8px",borderRadius:"10px",background:"linear-gradient(135deg,"+V.from+"14,"+V.to+"14)",border:"1px solid "+V.from+"28",color:V.from,cursor:"pointer",fontFamily:F,fontSize:"12px",fontWeight:"600"}}>💬 Chat now</button>}
            </div>}
          </div>
        );})}
      </div>
      {showPost&&<Modal onClose={function(){setShowPost(false);}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}><h3 style={{color:V.text,fontWeight:"700",fontFamily:F}}>Post a personal ad</h3><button onClick={function(){setShowPost(false);}} style={{background:"none",border:"none",color:V.muted,fontSize:"20px",cursor:"pointer"}}>✕</button></div>
        <FL>What are you looking for?</FL>
        <textarea value={adText} onChange={function(e){setAdText(e.target.value);}} placeholder="Tell people what kind of connection you're after tonight. Be specific — it works better." maxLength={280} style={{width:"100%",padding:"12px 14px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+V.border,color:V.text,fontSize:"13px",fontFamily:F,resize:"none",height:"90px",outline:"none",boxSizing:"border-box",marginBottom:"14px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}><FL>Expires in</FL><span style={{color:V.muted,fontSize:"11px",fontFamily:F}}>{adText.length}/280</span></div>
        <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
          {[{l:"1h",v:3600000},{l:"6h",v:21600000},{l:"24h",v:86400000}].map(function(e){return <button key={e.l} onClick={function(){setAdExp(e.v);}} style={{flex:1,padding:"9px",borderRadius:"10px",border:"1px solid "+(adExp===e.v?V.from:V.border),background:adExp===e.v?V.from+"14":"transparent",color:adExp===e.v?V.from:V.muted,fontSize:"13px",cursor:"pointer",fontFamily:F,fontWeight:adExp===e.v?"600":"400"}}>{e.l}</button>;})}
        </div>
        <FL>Add turn-ons (optional)</FL>
        <div style={{display:"flex",flexWrap:"wrap",maxHeight:"90px",overflowY:"auto",marginBottom:"18px"}}>{ALL_TO.map(function(t){return <Chip key={t.id} label={t.l} active={adTo.includes(t.id)} onClick={function(){setAdTo(function(p){return p.includes(t.id)?p.filter(function(x){return x!==t.id;}):[].concat(p,[t.id]);});}} color={V.to}/>;})}</div>
        <PBtn onClick={postAd} disabled={!adText.trim()||posting}>{posting?"Posting…":"Post ad"}</PBtn>
      </Modal>}
    </div>
  );
}

function ChatsList(props){
  var _q=useState("");var q=_q[0];var setQ=_q[1];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px 20px 12px",borderBottom:"1px solid "+V.border,flexShrink:0}}><h2 style={{fontSize:"18px",fontWeight:"700",color:V.text,fontFamily:F,marginBottom:"10px"}}>Chats</h2><Sin value={q} onChange={setQ} placeholder="Search conversations…"/></div>
      <div style={{flex:1,overflowY:"auto"}}>
        {CHATS0.filter(function(c){return (c.u.name||"Anonymous").toLowerCase().includes(q.toLowerCase());}).map(function(c){return(
          <button key={c.id} onClick={function(){props.onOpen(c.u);}} style={{width:"100%",padding:"14px 20px",display:"flex",alignItems:"center",gap:"12px",background:"none",border:"none",borderBottom:"1px solid "+V.border,cursor:"pointer",textAlign:"left"}}>
            <div style={{width:"44px",height:"44px",borderRadius:"50%",background:"#0a140c",border:"1px solid "+V.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0,position:"relative"}}>
              {c.u.anon?"🎭":c.u.av}
              {c.unread>0&&<div style={{position:"absolute",top:0,right:0,width:"14px",height:"14px",borderRadius:"50%",background:V.danger,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",color:"#fff",fontFamily:F}}>{c.unread}</div>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"2px"}}><span style={{color:V.text,fontWeight:"600",fontSize:"14px",fontFamily:F}}>{c.u.anon?"Anonymous":c.u.name}</span><span style={{color:V.muted,fontSize:"11px",fontFamily:F}}>{c.time}</span></div>
              <div style={{display:"flex",alignItems:"center",gap:"6px"}}><span style={{color:V.muted,fontSize:"12px",fontFamily:F,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{c.last}</span><ExpBadge expiresAt={c.exp} style={{flexShrink:0}}/></div>
            </div>
          </button>
        );})}
      </div>
    </div>
  );
}

function Chat(props){
  var user=props.user||USERS[0];var isPremium=props.isPremium;var onUpgrade=props.onUpgrade;var onBack=props.onBack;
  var _msgs=useState(MSGS0);var msgs=_msgs[0];var setMsgs=_msgs[1];
  var _inp=useState("");var input=_inp[0];var setInput=_inp[1];
  var _sb=useState(false);var showB=_sb[0];var setShowB=_sb[1];
  var _sc=useState(false);var showC=_sc[0];var setShowC=_sc[1];
  var _ss=useState(false);var showS=_ss[0];var setShowS=_ss[1];
  var _cd=useState(false);var cdone=_cd[0];var setCdone=_cd[1];
  var _tr=useState({});var transl=_tr[0];var setTransl=_tr[1];
  var _tl=useState({});var tling=_tl[0];var setTling=_tl[1];
  var _pl=useState("Spanish");var prefL=_pl[0];var setPrefL=_pl[1];
  var _bl=useState(false);var blur=_bl[0];var setBlur=_bl[1];
  var _lp=useState(false);var showLP=_lp[0];var setShowLP=_lp[1];
  var _ex=useState(3600000);var expiry=_ex[0];var setExpiry=_ex[1];
  var _se=useState(false);var showExp=_se[0];var setShowExp=_se[1];
  var _sa=useState(false);var ssAlert=_sa[0];var setSsAlert=_sa[1];
  var _sfA=useState(false);var safetyOn=_sfA[0];var setSafetyOn=_sfA[1];
  var _sfc=useState("");var safetyContact=_sfc[0];var setSafetyContact=_sfc[1];
  var _sfd=useState(120);var safetyDur=_sfd[0];var setSafetyDur=_sfd[1];
  var _sft=useState(null);var safetyLeft=_sft[0];var setSafetyLeft=_sft[1];
  var btm=useRef(null);
  useEffect(function(){if(btm.current)btm.current.scrollIntoView({behavior:"smooth"});}, [msgs]);
  useEffect(function(){
    if(!safetyOn)return;
    setSafetyLeft(safetyDur*60);
    var t=setInterval(function(){setSafetyLeft(function(p){if(p<=1){clearInterval(t);setSafetyOn(false);return 0;}return p-1;});},1000);
    return function(){clearInterval(t);};
  }, [safetyOn,safetyDur]);
  function doSend(){if(!input.trim())return;setMsgs(function(p){return p.concat([{id:Date.now(),from:"me",text:input,time:"now",exp:Date.now()+expiry}]);});setInput("");}
  function send(){
    if(!input.trim())return;
    if(RISKY.some(function(w){return input.toLowerCase().includes(w);})){setShowB(true);return;}
    if(msgs.length>=5&&!cdone){setShowC(true);return;}
    doSend();
  }
  function tr(id,text){
    if(transl[id]){setTransl(function(p){var n=Object.assign({},p);n[id]=null;return n;});return;}
    setTling(function(p){var n=Object.assign({},p);n[id]=true;return n;});
    setTimeout(function(){
      setTransl(function(p){var n=Object.assign({},p);n[id]="["+prefL+"] "+text.split(" ").slice(0,6).join(" ")+"…";return n;});
      setTling(function(p){var n=Object.assign({},p);n[id]=false;return n;});
    },700);
  }
  var visibleMsgs=msgs.filter(function(m){return m.exp>Date.now();});
  var expiredCount=msgs.length-visibleMsgs.length;
  function triggerSS(){setSsAlert(true);setTimeout(function(){setSsAlert(false);},3000);}
  var safetyMins=Math.floor((safetyLeft||0)/60);
  var safetySecs=String((safetyLeft||0)%60).length<2?"0"+String((safetyLeft||0)%60):String((safetyLeft||0)%60);
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
      {blur&&<div style={{position:"absolute",inset:0,background:V.bg+"ee",backdropFilter:"blur(20px)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px"}}>
        <Mark s={.9}/><p style={{color:V.mid,fontSize:"13px",fontFamily:F,fontWeight:"600"}}>Chat is private</p>
        <p style={{color:V.muted,fontSize:"11px",fontFamily:F,textAlign:"center",maxWidth:"180px",lineHeight:1.5}}>Screen blurred for nearby privacy</p>
        <button onClick={function(){setBlur(false);}} style={{padding:"9px 18px",borderRadius:"9px",background:"linear-gradient(135deg,"+V.from+","+V.to+")",border:"none",color:"#fff",fontSize:"13px",cursor:"pointer",fontFamily:F}}>Tap to reveal</button>
      </div>}
      {ssAlert&&<div style={{position:"absolute",top:"58px",left:"50%",transform:"translateX(-50%)",zIndex:20,background:V.danger+"f0",borderRadius:"10px",padding:"7px 16px",animation:"slideUp .3s ease",whiteSpace:"nowrap"}}><p style={{color:"#fff",fontSize:"12px",fontFamily:F,fontWeight:"600"}}>📸 Screenshot detected!</p></div>}
      {safetyOn&&<div style={{background:V.from+"12",borderBottom:"1px solid "+V.from+"33",padding:"6px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}><span style={{color:V.from,fontSize:"11px",fontFamily:F}}>🛰 Safety Signal active · {safetyMins}:{safetySecs} left</span><button onClick={function(){setSafetyOn(false);}} style={{background:"none",border:"none",color:V.muted,fontSize:"11px",cursor:"pointer",fontFamily:F}}>End</button></div>}
      <div style={{padding:"11px 15px 9px",borderBottom:"1px solid "+V.border,display:"flex",alignItems:"center",gap:"8px",flexShrink:0}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:V.muted,fontSize:"20px",cursor:"pointer"}}>←</button>
        <div style={{width:"32px",height:"32px",borderRadius:"50%",background:"#0a140c",border:"1px solid "+V.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px"}}>{user.anon?"🎭":user.av}</div>
        <div style={{flex:1}}><div style={{color:V.text,fontWeight:"600",fontSize:"13px",fontFamily:F}}>{user.anon?"Anonymous":user.name}</div><div style={{color:V.muted,fontSize:"10px",fontFamily:F}}>Active now</div></div>
        <div style={{position:"relative"}}>
          <button onClick={function(){if(isPremium)setShowExp(!showExp);else onUpgrade();}} style={{padding:"3px 8px",borderRadius:"6px",border:"1px solid "+(isPremium?V.border:V.gold+"44"),background:isPremium?"transparent":V.goldBg,color:isPremium?V.muted:V.gold,fontSize:"10px",cursor:"pointer",fontFamily:F}}>
            {isPremium?"":"✦ "}{"⏳"+(expiry===3600000?"1h":expiry===21600000?"6h":expiry===86400000?"24h":"∞")}
          </button>
          {showExp&&isPremium&&<div style={{position:"absolute",top:"calc(100% + 4px)",right:0,zIndex:60,background:"#0a140c",border:"1px solid "+V.border,borderRadius:"10px",overflow:"hidden",boxShadow:"0 8px 30px #000",width:"130px"}}>
            {[{l:"1 hour",v:3600000},{l:"6 hours",v:21600000},{l:"24 hours",v:86400000},{l:"Never",v:9999999999}].map(function(e){return <button key={e.l} onClick={function(){setExpiry(e.v);setShowExp(false);}} style={{width:"100%",padding:"9px 14px",background:expiry===e.v?V.from+"10":"transparent",border:"none",borderBottom:"1px solid "+V.border,color:expiry===e.v?V.from:V.muted,fontSize:"12px",textAlign:"left",cursor:"pointer",fontFamily:F}}>{e.l}</button>;}) }
          </div>}
        </div>
        <button onClick={function(){setBlur(!blur);}} style={{padding:"3px 7px",borderRadius:"6px",border:"1px solid "+(blur?V.from:V.border),background:blur?V.from+"14":"transparent",color:blur?V.from:V.muted,fontSize:"12px",cursor:"pointer"}}>{blur?"👁️":"🫣"}</button>
        <button onClick={function(){setShowS(true);}} style={{padding:"3px 8px",borderRadius:"6px",border:"1px solid "+V.border,background:"transparent",color:V.muted,fontSize:"11px",cursor:"pointer"}}>🛡</button>
      </div>
      <div style={{padding:"5px 15px",borderBottom:"1px solid "+V.border,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <p style={{color:"#1a2e1e",fontSize:"10px",letterSpacing:".05em",fontFamily:F}}>✦ Be kind. There's a real person here. ✦</p>
        <button onClick={function(){setShowLP(!showLP);}} style={{padding:"2px 7px",borderRadius:"5px",border:"1px solid "+V.border,background:"transparent",color:V.mutedHi,fontSize:"10px",cursor:"pointer",fontFamily:F}}>🌐 {prefL}</button>
      </div>
      {showLP&&<div style={{padding:"8px 15px",borderBottom:"1px solid "+V.border,background:"#070f09",flexShrink:0}}><div style={{display:"flex",flexWrap:"wrap",gap:"5px",maxHeight:"70px",overflowY:"auto"}}>{LANGUAGES.map(function(l){return <button key={l} onClick={function(){setPrefL(l);setShowLP(false);setTransl({});}} style={{padding:"3px 8px",borderRadius:"999px",fontSize:"10px",border:"1px solid "+(l===prefL?V.from:V.border),background:l===prefL?V.from+"14":"transparent",color:l===prefL?V.from:V.muted,cursor:"pointer",fontFamily:F}}>{l}</button>;})}</div></div>}
      <div style={{flex:1,overflowY:"auto",padding:"12px 15px",display:"flex",flexDirection:"column",gap:"7px"}}>
        {expiredCount>0&&<div style={{textAlign:"center",padding:"6px"}}><span style={{color:V.muted,fontSize:"11px",fontFamily:F}}>⏳ {expiredCount} message{expiredCount>1?"s":""} expired</span></div>}
        {visibleMsgs.map(function(m){return(
          <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:m.from==="me"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"76%",padding:"9px 12px",borderRadius:m.from==="me"?"16px 16px 3px 16px":"16px 16px 16px 3px",background:m.from==="me"?V.from+"12":"#0a140c",border:"1px solid "+(m.from==="me"?V.borderMid:V.border),color:"#b8d0c0",fontSize:"13px",lineHeight:1.6,fontFamily:F}}>
              {m.text}
              {transl[m.id]&&<div style={{marginTop:"6px",paddingTop:"6px",borderTop:"1px solid "+V.border,color:V.mid,fontSize:"11px",fontStyle:"italic",lineHeight:1.5}}>{transl[m.id]}</div>}
              <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"6px",marginTop:"3px"}}>
                <span style={{color:V.muted,fontSize:"10px"}}>{m.time}</span>
                {m.exp&&m.exp<9999999999&&<ExpBadge expiresAt={m.exp}/>}
              </div>
            </div>
            {m.from==="them"&&<div style={{display:"flex",gap:"5px",marginTop:"2px"}}>
              <button onClick={function(){tr(m.id,m.text);}} style={{padding:"2px 6px",borderRadius:"5px",background:"transparent",border:"1px solid "+V.border,color:V.muted,fontSize:"10px",cursor:"pointer",fontFamily:F}}>{tling[m.id]?"⏳":transl[m.id]?"✕ Original":"🌐 → "+prefL}</button>
              <button onClick={triggerSS} style={{padding:"2px 6px",borderRadius:"5px",background:"transparent",border:"1px solid "+V.border,color:V.muted,fontSize:"10px",cursor:"pointer",fontFamily:F}} title="Test screenshot alert">📸</button>
            </div>}
          </div>
        );})}
        <div ref={btm}/>
      </div>
      <div style={{padding:"7px 11px",borderTop:"1px solid "+V.border,display:"flex",gap:"7px",alignItems:"center",flexShrink:0}}>
        <button style={{background:"none",border:"none",color:V.muted,fontSize:"17px",cursor:"pointer",padding:"3px"}}>🎙</button>
        <input value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")send();}} placeholder="Say something real…" style={{flex:1,padding:"9px 12px",borderRadius:"20px",background:"#0a140c",border:"1px solid "+V.border,color:V.text,fontSize:"13px",fontFamily:F,outline:"none"}}/>
        <button onClick={send} style={{width:"32px",height:"32px",borderRadius:"50%",background:input?"linear-gradient(135deg,"+V.from+","+V.to+")":"#0a140c",border:"1px solid "+V.border,color:"#fff",fontSize:"14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
      </div>
      {showB&&<Modal onClose={function(){setShowB(false);}}><div style={{fontSize:"22px",marginBottom:"8px"}}>⚠️</div><h3 style={{color:V.danger,fontWeight:"700",marginBottom:"6px",fontFamily:F}}>Boundary alert</h3><p style={{color:V.muted,fontSize:"13px",lineHeight:1.6,marginBottom:"18px",fontFamily:F}}>This message may cross the other person's limits.</p><div style={{display:"flex",gap:"8px"}}><button onClick={function(){setShowB(false);}} style={{flex:1,padding:"11px",borderRadius:"11px",background:V.dangerBg,border:"1px solid "+V.danger,color:V.danger,cursor:"pointer",fontFamily:F,fontSize:"13px"}}>Edit</button><button onClick={function(){setShowB(false);setInput("");}} style={{flex:1,padding:"11px",borderRadius:"11px",background:"transparent",border:"1px solid "+V.border,color:V.muted,cursor:"pointer",fontFamily:F,fontSize:"13px"}}>Cancel</button></div></Modal>}
      {showC&&<Modal onClose={function(){setShowC(false);}}><div style={{display:"flex",justifyContent:"center",marginBottom:"12px"}}><Mark s={.75}/></div><h3 style={{color:V.mid,fontWeight:"700",marginBottom:"6px",fontFamily:F,textAlign:"center"}}>Consent check</h3><p style={{color:V.muted,fontSize:"13px",lineHeight:1.6,marginBottom:"12px",textAlign:"center",fontFamily:F}}>Both of you should agree to continue.</p><p style={{color:"#1e3a1e",fontSize:"12px",marginBottom:"16px",textAlign:"center",fontFamily:F}}>The other person has agreed ✓</p><PBtn onClick={function(){setCdone(true);setShowC(false);doSend();}}>I agree to continue</PBtn><GBtn onClick={function(){setShowC(false);}}>Not right now</GBtn></Modal>}
      {showS&&<Modal onClose={function(){setShowS(false);}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}><div style={{display:"flex",alignItems:"center",gap:"7px"}}><Mark s={.42}/><h3 style={{color:V.text,fontWeight:"700",fontFamily:F}}>Safety center</h3></div><button onClick={function(){setShowS(false);}} style={{background:"none",border:"none",color:V.muted,fontSize:"20px",cursor:"pointer"}}>✕</button></div>
        <div style={{padding:"14px",borderRadius:"14px",background:safetyOn?V.from+"10":V.from+"06",border:"1px solid "+(safetyOn?V.from+"44":V.border),marginBottom:"12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
            <span style={{fontSize:"20px"}}>🛰</span>
            <div style={{flex:1}}><p style={{color:V.mid,fontSize:"13px",fontFamily:F,fontWeight:"600"}}>Safety Signal</p><p style={{color:V.muted,fontSize:"11px",fontFamily:F}}>Share your location with a trusted contact</p></div>
            {safetyOn&&<span style={{color:V.from,fontSize:"11px",fontFamily:F,fontWeight:"600",flexShrink:0}}>● Active</span>}
          </div>
          {!safetyOn&&<div>
            <FL>Trusted contact</FL>
            <input value={safetyContact} onChange={function(e){setSafetyContact(e.target.value);}} placeholder="e.g. Mom, +1 555 0123" style={{width:"100%",padding:"9px 12px",borderRadius:"10px",background:"#0b150d",border:"1px solid "+V.border,color:V.text,fontSize:"13px",fontFamily:F,outline:"none",marginBottom:"10px",boxSizing:"border-box"}}/>
            <FL>Duration</FL>
            <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>{[{l:"1h",v:60},{l:"2h",v:120},{l:"4h",v:240}].map(function(d){return <button key={d.l} onClick={function(){setSafetyDur(d.v);}} style={{flex:1,padding:"8px",borderRadius:"9px",border:"1px solid "+(safetyDur===d.v?V.from:V.border),background:safetyDur===d.v?V.from+"14":"transparent",color:safetyDur===d.v?V.from:V.muted,fontSize:"12px",cursor:"pointer",fontFamily:F}}>{d.l}</button>;})} </div>
            <PBtn onClick={function(){if(safetyContact.trim()){setSafetyOn(true);setShowS(false);}}} disabled={!safetyContact.trim()} style={{padding:"10px"}}>Activate Safety Signal</PBtn>
          </div>}
          {safetyOn&&<div style={{textAlign:"center"}}><p style={{color:V.mid,fontSize:"12px",fontFamily:F,marginBottom:"8px"}}>Your contact can see your location and {user.anon?"their avatar":user.name+"'s"} profile.</p><button onClick={function(){setSafetyOn(false);}} style={{padding:"8px 20px",borderRadius:"10px",background:V.dangerBg,border:"1px solid "+V.danger,color:V.danger,cursor:"pointer",fontFamily:F,fontSize:"12px"}}>End session</button></div>}
        </div>
        {[{icon:"🔗",label:"Send safety link",desc:"Share a link to this chat",danger:false},{icon:"⏱",label:"Check-in timer",desc:"Get a reminder to check in",danger:false},{icon:"🚫",label:"Report & block",desc:"Remove this person",danger:true}].map(function(item){return <button key={item.label} style={{width:"100%",padding:"11px 13px",borderRadius:"11px",marginBottom:"7px",background:"#070f09",border:"1px solid "+(item.danger?V.danger+"22":V.border),textAlign:"left",cursor:"pointer",fontFamily:F,display:"flex",gap:"12px"}}><span style={{fontSize:"18px"}}>{item.icon}</span><div><div style={{color:item.danger?V.danger:V.text,fontSize:"13px",fontWeight:"600",fontFamily:F}}>{item.label}</div><div style={{color:V.muted,fontSize:"11px",fontFamily:F}}>{item.desc}</div></div></button>;})}
      </Modal>}
    </div>
  );
}

function Notifs(props){
  var notifs=props.notifs;var setNotifs=props.setNotifs;
  var unread=notifs.filter(function(n){return !n.read;}).length;
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px 20px 12px",borderBottom:"1px solid "+V.border,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}><h2 style={{fontSize:"18px",fontWeight:"700",color:V.text,fontFamily:F}}>Notifications</h2>{unread>0&&<button onClick={function(){setNotifs(function(p){return p.map(function(n){return Object.assign({},n,{read:true});});});}} style={{padding:"5px 11px",borderRadius:"8px",border:"1px solid "+V.border,background:"transparent",color:V.mutedHi,fontSize:"12px",cursor:"pointer",fontFamily:F}}>Mark all read</button>}</div>
      <div style={{flex:1,overflowY:"auto"}}>
        {notifs.map(function(n){return <div key={n.id} onClick={function(){setNotifs(function(p){return p.map(function(x){return x.id===n.id?Object.assign({},x,{read:true}):x;});});}} style={{padding:"14px 20px",display:"flex",alignItems:"flex-start",gap:"12px",borderBottom:"1px solid "+V.border,background:n.read?"transparent":V.from+"06",cursor:"pointer"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"#0a140c",border:"1px solid "+V.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>{n.icon}</div>
          <div style={{flex:1}}><p style={{color:n.read?V.mutedHi:V.text,fontSize:"13px",fontFamily:F,lineHeight:1.5,marginBottom:"2px"}}>{n.text}</p><p style={{color:V.muted,fontSize:"11px",fontFamily:F}}>{n.time}</p></div>
          {!n.read&&<div style={{width:"8px",height:"8px",borderRadius:"50%",background:V.from,marginTop:"4px",flexShrink:0}}/>}
        </div>;})}
      </div>
    </div>
  );
}

function BadgeScr(){
  var earned=BADGES.filter(function(b){return b.earned;});
  var locked=BADGES.filter(function(b){return !b.earned;});
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px 20px 12px",borderBottom:"1px solid "+V.border,flexShrink:0}}><h2 style={{fontSize:"18px",fontWeight:"700",color:V.text,fontFamily:F,marginBottom:"2px"}}>Badges</h2><p style={{color:V.muted,fontSize:"12px",fontFamily:F}}>{earned.length} earned · {locked.length} to unlock</p></div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        <p style={{color:V.muted,fontSize:"10px",letterSpacing:".1em",fontFamily:F,marginBottom:"12px"}}>EARNED</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"20px"}}>{earned.map(function(b){return <div key={b.id} style={{padding:"14px",borderRadius:"14px",background:V.from+"0a",border:"1px solid "+V.from+"2a",textAlign:"center",animation:"pop .5s ease"}}><div style={{fontSize:"28px",marginBottom:"6px"}}>{b.icon}</div><p style={{color:V.mid,fontSize:"11px",fontWeight:"600",fontFamily:F,marginBottom:"3px"}}>{b.label}</p><p style={{color:V.muted,fontSize:"10px",fontFamily:F,lineHeight:1.4}}>{b.desc}</p></div>;})}</div>
        <p style={{color:V.muted,fontSize:"10px",letterSpacing:".1em",fontFamily:F,marginBottom:"12px"}}>LOCKED</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>{locked.map(function(b){return <div key={b.id} style={{padding:"14px",borderRadius:"14px",background:V.card,border:"1px solid "+V.border,textAlign:"center",opacity:.5}}><div style={{fontSize:"28px",marginBottom:"6px",filter:"grayscale(1)"}}>{b.icon}</div><p style={{color:V.mutedHi,fontSize:"11px",fontWeight:"600",fontFamily:F,marginBottom:"3px"}}>{b.label}</p><p style={{color:V.muted,fontSize:"10px",fontFamily:F,lineHeight:1.4}}>{b.desc}</p></div>;})}</div>
      </div>
    </div>
  );
}

function PremiumScr(props){
  var isPremium=props.isPremium;var setPremium=props.setPremium;
  var _sel=useState("monthly");var sel=_sel[0];var setSel=_sel[1];
  var _suc=useState(false);var success=_suc[0];var setSuccess=_suc[1];
  function buy(){setSuccess(true);setTimeout(function(){setPremium(true);setSuccess(false);},1400);}
  if(isPremium)return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px 20px 12px",borderBottom:"1px solid "+V.border,flexShrink:0}}><div style={{display:"flex",alignItems:"center",gap:"8px"}}><h2 style={{fontSize:"18px",fontWeight:"700",color:V.text,fontFamily:F}}>Premium</h2><PBadge/></div><p style={{color:V.muted,fontSize:"12px",fontFamily:F,marginTop:"4px"}}>All features unlocked</p></div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        <div style={{padding:"16px",borderRadius:"16px",background:V.goldBg,border:"1px solid "+V.gold+"33",marginBottom:"18px",textAlign:"center"}}><div style={{fontSize:"32px",marginBottom:"8px"}}>✦</div><p style={{color:V.gold,fontSize:"15px",fontFamily:F,fontWeight:"700",marginBottom:"4px"}}>All premium features active</p><p style={{color:V.mutedHi,fontSize:"12px",fontFamily:F}}>Next billing: June 6, 2026</p></div>
        {PF.map(function(f){return <div key={f.label} style={{display:"flex",alignItems:"center",gap:"12px",padding:"11px 0",borderBottom:"1px solid "+V.border}}><span style={{fontSize:"20px"}}>{f.icon}</span><div style={{flex:1}}><p style={{color:V.text,fontSize:"13px",fontFamily:F,fontWeight:"500"}}>{f.label}</p><p style={{color:V.muted,fontSize:"11px",fontFamily:F}}>{f.desc}</p></div><span style={{color:V.from,fontSize:"12px"}}>✓</span></div>;})}
        <button onClick={function(){setPremium(false);}} style={{width:"100%",padding:"11px 13px",borderRadius:"11px",background:V.card,border:"1px solid "+V.danger+"22",textAlign:"left",cursor:"pointer",fontFamily:F,display:"flex",gap:"11px",marginTop:"20px"}}><span style={{fontSize:"15px"}}>🚫</span><div><div style={{color:V.danger,fontSize:"13px",fontFamily:F,fontWeight:"500"}}>Cancel subscription</div><div style={{color:V.muted,fontSize:"11px",fontFamily:F}}>Access continues until end of period</div></div></button>
      </div>
    </div>
  );
  var selPlan=PLANS.filter(function(p){return p.id===sel;})[0];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px 20px 12px",borderBottom:"1px solid "+V.border,flexShrink:0}}><h2 style={{fontSize:"18px",fontWeight:"700",color:V.text,fontFamily:F}}>Go Premium</h2><p style={{color:V.muted,fontSize:"12px",fontFamily:F,marginTop:"4px"}}>Unlock the full Truth experience</p></div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px 36px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"24px"}}>{PF.map(function(f){return <div key={f.label} style={{padding:"12px",borderRadius:"13px",background:V.card,border:"1px solid "+V.border}}><div style={{fontSize:"20px",marginBottom:"6px"}}>{f.icon}</div><p style={{color:V.mid,fontSize:"12px",fontFamily:F,fontWeight:"600",marginBottom:"2px"}}>{f.label}</p><p style={{color:V.muted,fontSize:"10px",fontFamily:F,lineHeight:1.4}}>{f.desc}</p></div>;})} </div>
        <p style={{color:V.muted,fontSize:"10px",letterSpacing:".1em",fontFamily:F,marginBottom:"12px"}}>CHOOSE A PLAN</p>
        {PLANS.map(function(p){return <button key={p.id} onClick={function(){setSel(p.id);}} style={{width:"100%",padding:"14px 16px",borderRadius:"14px",marginBottom:"8px",border:"1px solid "+(sel===p.id?V.gold:V.border),background:sel===p.id?V.goldBg:V.card,textAlign:"left",cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .2s"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}><div style={{width:"18px",height:"18px",borderRadius:"50%",border:"2px solid "+(sel===p.id?V.gold:V.muted),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel===p.id&&<div style={{width:"8px",height:"8px",borderRadius:"50%",background:V.gold}}/>}</div><div><div style={{color:sel===p.id?V.gold:V.mutedHi,fontSize:"14px",fontFamily:F,fontWeight:"600"}}>{p.label}</div>{p.badge&&<div style={{color:V.gold,fontSize:"10px",fontFamily:F}}>{p.badge}</div>}</div></div>
          <div style={{textAlign:"right"}}><div style={{color:sel===p.id?V.gold:V.text,fontSize:"16px",fontFamily:F,fontWeight:"700"}}>{p.price}</div><div style={{color:V.muted,fontSize:"10px",fontFamily:F}}>{p.per}</div></div>
        </button>;})}
        <div style={{height:"16px"}}/>
        {success?<div style={{textAlign:"center",padding:"16px",borderRadius:"14px",background:V.gold+"14",border:"1px solid "+V.gold+"33"}}><p style={{color:V.gold,fontSize:"15px",fontFamily:F,fontWeight:"700"}}>✦ Welcome to Premium!</p></div>:<GoldBtn onClick={buy}>{"Unlock Premium → "+(selPlan?selPlan.price:"")}</GoldBtn>}
        <p style={{color:V.muted,fontSize:"10px",fontFamily:F,textAlign:"center",marginTop:"12px",lineHeight:1.6}}>Cancel anytime · No hidden fees · Secure payment</p>
      </div>
    </div>
  );
}

function SettingsScr(props){
  var isPremium=props.isPremium;var onUpgrade=props.onUpgrade;
  var _am=useState(false);var anonMode=_am[0];var setAnonMode=_am[1];
  var _ha=useState(false);var hideAge=_ha[0];var setHideAge=_ha[1];
  var _hg=useState(false);var hideGender=_hg[0];var setHideGender=_hg[1];
  var _so=useState(true);var showOnline=_so[0];var setShowOnline=_so[1];
  var _rr=useState(true);var readR=_rr[0];var setReadR=_rr[1];
  var _cb=useState(false);var chatBlur=_cb[0];var setChatBlur=_cb[1];
  var _ig=useState(false);var incognito=_ig[0];var setIncognito=_ig[1];
  var _dm=useState("everyone");var discMode=_dm[0];var setDiscMode=_dm[1];
  var _mi=useState(["deep","vent"]);var myIntents=_mi[0];var setMyIntents=_mi[1];
  var _sv=useState(false);var saved=_sv[0];var setSaved=_sv[1];
  function togIntent(id){setMyIntents(function(p){return p.includes(id)?p.filter(function(x){return x!==id;}):[].concat(p,[id]);});}
  var discModes=[{id:"everyone",l:"Everyone"},{id:"intent_match",l:"Intent matches only"},{id:"boundaries_match",l:"Boundary-compatible only"},{id:"nobody",l:"Nobody (invisible)"}];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px 20px 12px",borderBottom:"1px solid "+V.border,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}><h2 style={{fontSize:"18px",fontWeight:"700",color:V.text,fontFamily:F}}>Privacy & Settings</h2><button onClick={function(){setSaved(true);setTimeout(function(){setSaved(false);},2000);}} style={{padding:"6px 13px",borderRadius:"9px",background:"linear-gradient(135deg,"+V.from+","+V.to+")",border:"none",color:"#fff",fontSize:"12px",fontWeight:"600",cursor:"pointer",fontFamily:F}}>{saved?"Saved ✓":"Save"}</button></div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px 36px"}}>
        <SettSec t="IDENTITY" c={<div>
          <SettRow l="Anonymous mode" d="Hide real name and photo"><Tog value={anonMode} onChange={setAnonMode}/></SettRow>
          <SettRow l="Incognito mode" d="Browse unseen, hide read receipts and online status" prem={true}>{isPremium?<Tog value={incognito} onChange={setIncognito}/>:<button onClick={onUpgrade} style={{padding:"4px 10px",borderRadius:"7px",background:V.goldBg,border:"1px solid "+V.gold+"33",color:V.gold,fontSize:"11px",cursor:"pointer",fontFamily:F}}>Unlock</button>}</SettRow>
        </div>}/>
        <SettSec t="PROFILE VISIBILITY" c={<div>
          <SettRow l="Hide age"><Tog value={hideAge} onChange={setHideAge}/></SettRow>
          <SettRow l="Hide gender"><Tog value={hideGender} onChange={setHideGender}/></SettRow>
        </div>}/>
        <SettSec t="CONNECTION INTENT" c={<div>
          <p style={{color:V.muted,fontSize:"11px",fontFamily:F,marginBottom:"10px"}}>Update what connections you're open to</p>
          <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>{INTENTS.map(function(opt){var a=myIntents.includes(opt.id);return <button key={opt.id} onClick={function(){togIntent(opt.id);}} style={{padding:"11px 14px",borderRadius:"11px",textAlign:"left",border:"1px solid "+(a?V.from:V.border),background:a?V.from+"0c":V.card,cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:"11px"}}><span style={{fontSize:"17px"}}>{opt.i}</span><span style={{color:a?V.mid:V.muted,fontSize:"13px",fontFamily:F,flex:1}}>{opt.l}</span>{a&&<span style={{color:V.from,fontSize:"11px"}}>✓</span>}</button>;})}</div>
        </div>}/>
        <SettSec t="CHAT PRIVACY" c={<div>
          <SettRow l="Privacy blur by default" d="Auto-blur chat for nearby privacy"><Tog value={chatBlur} onChange={setChatBlur}/></SettRow>
          <SettRow l="Read receipts"><Tog value={readR} onChange={setReadR}/></SettRow>
          <SettRow l="Show online status"><Tog value={showOnline} onChange={setShowOnline}/></SettRow>
        </div>}/>
        <SettSec t="DISCOVERY" c={<div>{discModes.map(function(mode){return <button key={mode.id} onClick={function(){setDiscMode(mode.id);}} style={{width:"100%",padding:"10px 13px",borderRadius:"11px",marginBottom:"7px",border:"1px solid "+(discMode===mode.id?V.from:V.border),background:discMode===mode.id?V.from+"0c":V.card,textAlign:"left",cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:"11px"}}><div style={{width:"14px",height:"14px",borderRadius:"50%",border:"1.5px solid "+(discMode===mode.id?V.from:V.muted),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{discMode===mode.id&&<div style={{width:"7px",height:"7px",borderRadius:"50%",background:V.from}}/>}</div><div style={{color:discMode===mode.id?V.mid:V.mutedHi,fontSize:"13px",fontFamily:F,fontWeight:"500"}}>{mode.l}</div></button>;})} </div>}/>
        <SettSec t="YOUR DATA" c={<div>
          <button style={{width:"100%",padding:"11px 13px",borderRadius:"11px",background:V.card,border:"1px solid "+V.border,textAlign:"left",cursor:"pointer",fontFamily:F,display:"flex",gap:"11px",marginBottom:"7px"}}><span style={{fontSize:"15px"}}>📋</span><div><div style={{color:V.mutedHi,fontSize:"13px",fontFamily:F,fontWeight:"500"}}>Download my data</div><div style={{color:V.muted,fontSize:"11px",fontFamily:F}}>Get a copy of your Truth data</div></div></button>
          <button style={{width:"100%",padding:"11px 13px",borderRadius:"11px",background:V.card,border:"1px solid "+V.danger+"22",textAlign:"left",cursor:"pointer",fontFamily:F,display:"flex",gap:"11px"}}><span style={{fontSize:"15px"}}>🗑</span><div><div style={{color:V.danger,fontSize:"13px",fontFamily:F,fontWeight:"500"}}>Delete my account</div><div style={{color:V.muted,fontSize:"11px",fontFamily:F}}>Permanently remove all data</div></div></button>
        </div>}/>
      </div>
    </div>
  );
}

function AdminScr(props){
  var PW="truth_admin_2024";
  var _au=useState(false);var authed=_au[0];var setAuthed=_au[1];
  var _pw=useState("");var pw=_pw[0];var setPw=_pw[1];
  var _er=useState(false);var err=_er[0];var setErr=_er[1];
  var _tb=useState("reports");var tab=_tb[0];var setTab=_tb[1];
  var _rp=useState(REPORTS);var reports=_rp[0];var setReports=_rp[1];
  var _bg=useState(BUGS0);var bugs=_bg[0];var setBugs=_bg[1];
  var sc={open:V.danger,reviewing:V.warn,resolved:V.from,investigating:V.warn};
  var sv={high:V.danger,medium:V.warn,low:V.mutedHi};
  function tryLogin(){if(pw===PW){setAuthed(true);setErr(false);}else setErr(true);}
  if(!authed)return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px 22px"}}>
      <Orb style={{width:220,height:220,background:V.from,top:-60,left:-60}}/><Mark s={1}/>
      <div style={{marginTop:"14px",marginBottom:"4px"}}><Wm sz={22}/></div>
      <p style={{color:V.muted,fontSize:"10px",letterSpacing:"4px",fontFamily:F,marginBottom:"28px"}}>ADMIN ACCESS</p>
      <div style={{background:V.card,borderRadius:"18px",padding:"22px",width:"100%",border:"1px solid "+V.border}}>
        <FL>Admin Password</FL>
        <input value={pw} onChange={function(e){setPw(e.target.value);}} type="password" placeholder="Enter password" onKeyDown={function(e){if(e.key==="Enter")tryLogin();}} style={{width:"100%",padding:"12px 14px",borderRadius:"12px",background:"#0b150d",border:"1px solid "+(err?V.danger:V.border),color:V.text,fontSize:"14px",fontFamily:F,outline:"none",boxSizing:"border-box",marginBottom:"14px"}}/>
        {err&&<p style={{color:V.danger,fontSize:"12px",fontFamily:F,marginBottom:"10px"}}>Incorrect password.</p>}
        <PBtn onClick={tryLogin}>Enter Admin Panel</PBtn>
        <GBtn onClick={props.onExit}>← Back to app</GBtn>
      </div>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"14px 18px 10px",borderBottom:"1px solid "+V.border,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}><div style={{display:"flex",alignItems:"center",gap:"7px"}}><Mark s={.42}/><span style={{color:V.text,fontWeight:"700",fontSize:"14px",fontFamily:F}}>Admin</span></div><div style={{display:"flex",gap:"5px"}}>{["reports","bugs","stats"].map(function(t){return <button key={t} onClick={function(){setTab(t);}} style={{padding:"4px 9px",borderRadius:"7px",border:"1px solid "+(tab===t?V.from:V.border),background:tab===t?V.from+"14":"transparent",color:tab===t?V.from:V.muted,fontSize:"11px",cursor:"pointer",fontFamily:F,textTransform:"capitalize"}}>{t}</button>;})}</div><button onClick={props.onExit} style={{background:"none",border:"none",color:V.muted,cursor:"pointer",fontSize:"12px",fontFamily:F}}>Exit</button></div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}}>
        {tab==="reports"&&<div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"16px"}}>{[{l:"Open",v:reports.filter(function(r){return r.status==="open";}).length,c:V.danger},{l:"Reviewing",v:reports.filter(function(r){return r.status==="reviewing";}).length,c:V.warn},{l:"Resolved",v:reports.filter(function(r){return r.status==="resolved";}).length,c:V.from},{l:"Total",v:reports.length,c:V.to}].map(function(s){return <div key={s.l} style={{padding:"12px",borderRadius:"12px",background:V.card,border:"1px solid "+V.border}}><p style={{color:s.c,fontSize:"22px",fontWeight:"700",fontFamily:F}}>{s.v}</p><p style={{color:V.muted,fontSize:"11px",fontFamily:F}}>{s.l}</p></div>;})}</div>
          {reports.map(function(r){return <div key={r.id} style={{padding:"12px",borderRadius:"12px",background:V.card,border:"1px solid "+V.border,marginBottom:"8px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"7px"}}><div><p style={{color:V.text,fontSize:"13px",fontWeight:"600",fontFamily:F,marginBottom:"1px"}}>Report #{r.id}</p><p style={{color:V.muted,fontSize:"11px",fontFamily:F}}>{r.time} · by {r.reporter}</p></div><span style={{padding:"2px 7px",borderRadius:"999px",fontSize:"10px",background:(sc[r.status]||V.muted)+"18",color:sc[r.status]||V.muted,fontFamily:F,border:"1px solid "+(sc[r.status]||V.muted)+"33"}}>{r.status}</span></div>
            <p style={{color:V.mutedHi,fontSize:"12px",fontFamily:F,marginBottom:"4px"}}>Against: <strong style={{color:V.text}}>{r.reported}</strong></p>
            <p style={{color:V.muted,fontSize:"12px",fontFamily:F,marginBottom:"10px"}}>{r.reason}</p>
            <div style={{display:"flex",gap:"7px"}}>
              {r.status==="open"&&<button onClick={function(){setReports(function(p){return p.map(function(x){return x.id===r.id?Object.assign({},x,{status:"reviewing"}):x;});});}} style={{flex:1,padding:"7px",borderRadius:"9px",background:V.warn+"14",border:"1px solid "+V.warn+"44",color:V.warn,cursor:"pointer",fontFamily:F,fontSize:"12px"}}>Review</button>}
              {r.status!=="resolved"&&<button onClick={function(){setReports(function(p){return p.map(function(x){return x.id===r.id?Object.assign({},x,{status:"resolved"}):x;});});}} style={{flex:1,padding:"7px",borderRadius:"9px",background:V.from+"14",border:"1px solid "+V.from+"44",color:V.from,cursor:"pointer",fontFamily:F,fontSize:"12px"}}>Resolve</button>}
              <button style={{flex:1,padding:"7px",borderRadius:"9px",background:V.dangerBg,border:"1px solid "+V.danger+"44",color:V.danger,cursor:"pointer",fontFamily:F,fontSize:"12px"}}>Ban</button>
            </div>
          </div>;})}
        </div>}
        {tab==="bugs"&&<div>{bugs.map(function(b){return <div key={b.id} style={{padding:"12px",borderRadius:"12px",background:V.card,border:"1px solid "+V.border,marginBottom:"8px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"5px"}}><p style={{color:V.text,fontSize:"13px",fontWeight:"600",fontFamily:F,flex:1,marginRight:"8px"}}>{b.title}</p><span style={{padding:"2px 7px",borderRadius:"999px",fontSize:"10px",background:(sc[b.status]||V.muted)+"18",color:sc[b.status]||V.muted,fontFamily:F,border:"1px solid "+(sc[b.status]||V.muted)+"33",flexShrink:0}}>{b.status}</span></div>
          <div style={{display:"flex",gap:"7px",alignItems:"center",marginBottom:"8px"}}><span style={{padding:"2px 7px",borderRadius:"999px",fontSize:"10px",background:(sv[b.sev]||V.muted)+"18",color:sv[b.sev]||V.muted,fontFamily:F}}>{b.sev}</span><span style={{color:V.muted,fontSize:"11px",fontFamily:F}}>{b.time}</span></div>
          <div style={{display:"flex",gap:"7px"}}>
            {b.status!=="resolved"&&<button onClick={function(){setBugs(function(p){return p.map(function(x){return x.id===b.id?Object.assign({},x,{status:"resolved"}):x;});});}} style={{flex:1,padding:"7px",borderRadius:"9px",background:V.from+"14",border:"1px solid "+V.from+"44",color:V.from,cursor:"pointer",fontFamily:F,fontSize:"12px"}}>Resolve</button>}
            {b.status==="open"&&<button onClick={function(){setBugs(function(p){return p.map(function(x){return x.id===b.id?Object.assign({},x,{status:"investigating"}):x;});});}} style={{flex:1,padding:"7px",borderRadius:"9px",background:V.warn+"14",border:"1px solid "+V.warn+"44",color:V.warn,cursor:"pointer",fontFamily:F,fontSize:"12px"}}>Investigate</button>}
          </div>
        </div>;})} </div>}
        {tab==="stats"&&<div>{[{l:"Total Users",v:"1,284",d:"+23 today",c:V.from},{l:"Active Today",v:"347",d:"27% DAU",c:V.mid},{l:"Chats Today",v:"2,103",d:"+12%",c:V.to},{l:"Active Ads",v:"89",d:"avg 2.3h expiry",c:V.to},{l:"Premium Subs",v:"214",d:"+18 this week",c:V.gold},{l:"Reports This Week",v:"12",d:"3 vs last week",c:V.warn}].map(function(s){return <div key={s.l} style={{padding:"14px",borderRadius:"12px",background:V.card,border:"1px solid "+V.border,marginBottom:"8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{color:V.mutedHi,fontSize:"12px",fontFamily:F,marginBottom:"3px"}}>{s.l}</p><p style={{color:s.c,fontSize:"24px",fontWeight:"700",fontFamily:F}}>{s.v}</p></div><span style={{padding:"3px 9px",borderRadius:"999px",fontSize:"11px",background:s.c+"14",color:s.c,fontFamily:F}}>{s.d}</span></div>;})} </div>}
      </div>
    </div>
  );
}

function BottomNav(props){
  var tab=props.tab;var setTab=props.setTab;var unreadM=props.unreadM;var unreadN=props.unreadN;var isPremium=props.isPremium;
  var items=[{id:"feed",icon:"📋",l:"Feed"},{id:"chats",icon:"💬",l:"Chats",b:unreadM},{id:"notifs",icon:"🔔",l:"Alerts",b:unreadN},{id:"badges",icon:"🏅",l:"Badges"},{id:"premium",icon:isPremium?"✦":"🔓",l:isPremium?"Premium":"Upgrade"}];
  return(
    <div style={{borderTop:"1px solid "+V.border,background:V.card,display:"flex",flexShrink:0}}>
      {items.map(function(it){return <button key={it.id} onClick={function(){setTab(it.id);}} style={{flex:1,padding:"9px 3px 11px",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",position:"relative"}}>
        {it.b>0&&<div style={{position:"absolute",top:"5px",right:"calc(50% - 14px)",width:"15px",height:"15px",borderRadius:"50%",background:V.danger,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",color:"#fff",fontFamily:F,fontWeight:"700"}}>{it.b>9?"9+":it.b}</div>}
        <span style={{fontSize:"17px",filter:tab===it.id?"none":"grayscale(.5)",opacity:tab===it.id?1:.5}}>{it.icon}</span>
        <span style={{fontSize:"9px",fontFamily:F,color:tab===it.id?(it.id==="premium"&&!isPremium?V.gold:V.from):V.muted,letterSpacing:".03em"}}>{it.l}</span>
        {tab===it.id&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"18px",height:"2px",borderRadius:"1px",background:it.id==="premium"&&!isPremium?"linear-gradient(90deg,"+V.gold+",#f97316)":"linear-gradient(90deg,"+V.from+","+V.to+")"}}/>}
      </button>;})}
    </div>
  );
}

function Sidebar(props){
  var screen=props.screen;var go=props.go;var tab=props.tab;var setTab=props.setTab;var isPremium=props.isPremium;
  var items=[{id:"feed",icon:"📋",l:"Feed",isTab:true},{id:"chats",icon:"💬",l:"Chats",isTab:true},{id:"notifs",icon:"🔔",l:"Notifications",isTab:true},{id:"badges",icon:"🏅",l:"Badges",isTab:true},{id:"premium",icon:isPremium?"✦":"🔓",l:isPremium?"Premium":"Upgrade",isTab:true},{id:"settings",icon:"🔒",l:"Settings",isTab:true},{id:"admin",icon:"⚙️",l:"Admin",isAdmin:true}];
  var activeColor=function(item){return item.isAdmin?screen==="admin":tab===item.id;};
  return(
    <div className="sidebar">
      <div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"28px",paddingLeft:"6px"}}><Mark s={.65}/><Wm sz={22}/></div>
      {items.map(function(item){return <button key={item.id} onClick={function(){if(item.isAdmin)go("admin");else setTab(item.id);}} style={{display:"flex",alignItems:"center",gap:"11px",padding:"11px 12px",borderRadius:"11px",border:"none",background:activeColor(item)?V.from+"14":"transparent",cursor:"pointer",width:"100%",textAlign:"left",marginBottom:"3px"}}>
        <span style={{fontSize:"18px"}}>{item.icon}</span>
        <span style={{color:activeColor(item)?V.from:V.mutedHi,fontSize:"13px",fontFamily:F,fontWeight:activeColor(item)?"600":"400"}}>{item.l}</span>
      </button>;})}
      <div style={{marginTop:"auto",padding:"14px 12px",borderRadius:"11px",background:V.card,border:"1px solid "+V.border}}><p style={{color:V.muted,fontSize:"10px",fontFamily:F,lineHeight:1.6}}>🔧 Add Supabase keys at the top to enable real OTP.</p></div>
    </div>
  );
}

var OB=["verify","identity","intent","turnons","boundaries","profile"];

export default function App(){
  var _sc=useState("welcome");var screen=_sc[0];var setScreen=_sc[1];
  var _sb=useState(null);var sub=_sb[0];var setSub=_sb[1];
  var _tb=useState("feed");var tab=_tb[0];var setTab=_tb[1];
  var _us=useState(null);var user=_us[0];var setUser=_us[1];
  var _no=useState(NOTIFS0);var notifs=_no[0];var setNotifs=_no[1];
  var _ad=useState(ADS0);var ads=_ad[0];var setAds=_ad[1];
  var _pm=useState(false);var isPremium=_pm[0];var setIsPremium=_pm[1];
  var unreadM=CHATS0.reduce(function(a,c){return a+c.unread;},0);
  var unreadN=notifs.filter(function(n){return !n.read;}).length;
  function go(s){setScreen(s);}
  var inOB=OB.indexOf(screen)!==-1;
  var inApp=screen==="app";
  var inAdmin=screen==="admin";
  function changeTab(t){setTab(t);setSub(null);}
  function goUpgrade(){changeTab("premium");}
  return(
    <div style={{background:V.bg,minHeight:"100vh"}}>
      <style>{CSS}</style>
      <div className="shell">
        {(inApp||inAdmin)&&<Sidebar screen={screen} go={go} tab={tab} setTab={changeTab} isPremium={isPremium}/>}
        <div className="main">
          {inOB&&<Prog step={OB.indexOf(screen)+1} total={OB.length}/>}
          <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
            {screen==="welcome"    &&<Welcome    onNext={function(){go("verify");}}/>}
            {screen==="verify"     &&<Verify     onNext={function(){go("identity");}}   onBack={function(){go("welcome");}}/>}
            {screen==="identity"   &&<Identity   onNext={function(){go("intent");}}     onBack={function(){go("verify");}}/>}
            {screen==="intent"     &&<Intent     onNext={function(){go("turnons");}}    onBack={function(){go("identity");}}/>}
            {screen==="turnons"    &&<TurnOns    onNext={function(){go("boundaries");}} onBack={function(){go("intent");}}/>}
            {screen==="boundaries" &&<Boundaries onNext={function(){go("profile");}}    onBack={function(){go("turnons");}}/>}
            {screen==="profile"    &&<Profile    onNext={function(){go("app");setTab("feed");}} onBack={function(){go("boundaries");}}/>}
            {inAdmin               &&<AdminScr   onExit={function(){go("app");setTab("feed");}}/>}
            {inApp&&<div style={{flex:1,display:"flex",flexDirection:"column"}}>
              {sub==="chat"
                ?<Chat user={user} isPremium={isPremium} onUpgrade={goUpgrade} onBack={function(){setSub(null);}}/>
                :<div style={{flex:1,display:"flex",flexDirection:"column"}}>
                  {tab==="feed"    &&<AdFeed ads={ads} setAds={setAds} onChat={function(u){setUser(u);setSub("chat");}} isPremium={isPremium} onUpgrade={goUpgrade}/>}
                  {tab==="chats"   &&<ChatsList onOpen={function(u){setUser(u);setSub("chat");}}/>}
                  {tab==="notifs"  &&<Notifs notifs={notifs} setNotifs={setNotifs}/>}
                  {tab==="badges"  &&<BadgeScr/>}
                  {tab==="premium" &&<PremiumScr isPremium={isPremium} setPremium={setIsPremium}/>}
                  {tab==="settings"&&<SettingsScr isPremium={isPremium} onUpgrade={goUpgrade}/>}
                </div>
              }
            </div>}
          </div>
          {inApp&&!sub&&<BottomNav tab={tab} setTab={changeTab} unreadM={unreadM} unreadN={unreadN} isPremium={isPremium}/>}
          {inApp&&!sub&&<div style={{textAlign:"center",padding:"5px",borderTop:"1px solid "+V.border}}><button onClick={function(){go("admin");}} style={{background:"none",border:"none",color:V.muted,fontSize:"10px",cursor:"pointer",fontFamily:F,letterSpacing:".06em"}}>⚙ ADMIN</button></div>}
        </div>
      </div>
    </div>
  );
}

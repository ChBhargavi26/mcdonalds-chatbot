const log=document.getElementById('log'),input=document.getElementById('in'),chips=document.getElementById('chips');

// Menu items: edit names, prices and delivery times here
const ITEMS=[
 {name:'Big Mac',emoji:'🍔',price:189,time:'25–30 minutes',keys:['big mac']},
 {name:'McChicken',emoji:'🐔',price:149,time:'25–30 minutes',keys:['mcchicken']},
 {name:'McAloo Tikki',emoji:'🥔',price:69,time:'20–25 minutes',keys:['mcaloo tikki','aloo tikki','mcaloo']},
 {name:'French Fries',emoji:'🍟',price:99,time:'20–25 minutes',keys:['french fries','fries']},
 {name:'Chicken McNuggets',emoji:'🍗',price:159,time:'25–30 minutes',keys:['chicken mcnuggets','nuggets']},
 {name:'McFlurry',emoji:'🍦',price:129,time:'15–20 minutes',keys:['mcflurry']}
];
const MAIN=['Hai','Menu','Deals','Hours'];
let last=null;

const has=(t,words)=>words.some(w=>new RegExp('\\b'+w+'\\b','i').test(t));
const findItem=t=>ITEMS.find(i=>i.keys.some(k=>t.toLowerCase().includes(k)));

const rules=[
 [['hai','hi','hello','hey','hii','hlo'],"Hai! 👋 Welcome to McDonald’s. I’m your virtual assistant. How can I help you today?\n\nYou can ask about the menu, deals, opening hours or place an order.",MAIN],
 [['menu','burger','burgers','food','nuggets'],"Here is our menu 🍔 Tap an item to see its price and delivery time.",ITEMS.map(i=>i.name)],
 [['deal','deals','offer','offers','combo','discount'],"Today’s deals 🎉\n• Burger + Fries + Drink combo\n• 2 McAloo Tikki for a special price\n• Free McFlurry on orders above ₹500",['Menu','Hours']],
 [['hours','open','close','timing','timings'],"Most of our restaurants are open from 7:00 AM to 11:00 PM, and many drive-thrus run 24 hours. Tell me your area and I’ll help you find one.",MAIN],
 [['veg','vegetarian','vegan'],"We have plenty of veg options 🥗: McAloo Tikki, French Fries and McFlurry.",['McAloo Tikki','French Fries','McFlurry']],
 [['location','near','nearby','outlet','store'],"Share your city or area and I’ll help you find the nearest McDonald’s 📍",MAIN],
 [['thanks','thank','thx'],"You’re welcome! 😊 Enjoy your meal.",MAIN],
 [['bye','goodbye'],"Goodbye! Hope to see you again soon 🍟",MAIN]
];

function reply(t){
 const item=findItem(t);
 if(item){
  last=item;
  return {text:`Your item: ${item.name} ${item.emoji}\nPrice: ₹${item.price}\nDelivery time: ${item.time}\n\nType “confirm” to place the order, or pick another item.`,chips:['Confirm','Menu']};
 }
 if(has(t,['confirm','order','buy','yes','ok'])){
  if(last){
   const i=last;last=null;
   return {text:`✅ Order confirmed!\n${i.emoji} ${i.name} – ₹${i.price}\nDelivery in ${i.time}.\n\nThank you for ordering with McDonald’s!`,chips:['Menu','Deals']};
  }
  return {text:"What would you like to order? Pick an item below 👇",chips:ITEMS.map(i=>i.name)};
 }
 for(const[k,r,c]of rules){if(has(t,k))return {text:r,chips:c}}
 return {text:"Sorry, I didn’t get that. Try “hai”, “menu”, “deals” or “hours”.",chips:MAIN};
}

function add(text,cls){const d=document.createElement('div');d.className='msg '+cls;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
function setChips(list){
 chips.innerHTML='';
 list.forEach(l=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.onclick=()=>send(l);chips.appendChild(b)});
}
function send(text){
 text=text.trim();if(!text)return;
 add(text,'me');
 const t=add('typing…','bot typing');
 setTimeout(()=>{t.remove();const r=reply(text);add(r.text,'bot');setChips(r.chips)},600);
}
document.getElementById('f').addEventListener('submit',e=>{e.preventDefault();send(input.value);input.value=''});
setChips(MAIN);
add("Welcome to McDonald’s! Say “hai” to get started 🍟",'bot');
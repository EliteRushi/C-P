const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT.firebaseapp.com",

databaseURL:
"https://YOUR_PROJECT-default-rtdb.firebaseio.com",

projectId: "YOUR_PROJECT",

storageBucket:
"YOUR_PROJECT.appspot.com",

messagingSenderId: "XXXX",

appId: "XXXX"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const clipsRef = db.ref("clips");

function saveClip(){

const title =
document.getElementById("title").value.trim();

const content =
document.getElementById("content").value.trim();

if(!title || !content){

alert("Please enter title and content");

return;

}

clipsRef.push({

title,

content,

pinned:false,

createdAt:Date.now()

});

document.getElementById("title").value="";

document.getElementById("content").value="";

}

function copyClip(text){

navigator.clipboard.writeText(text);

alert("Copied");

}

function togglePin(id,current){

clipsRef.child(id).update({

pinned:!current

});

}

function deleteClip(id){

if(confirm("Delete this clip?")){

clipsRef.child(id).remove();

}

}

function clearUnpinned(){

if(!confirm("Clear all unpinned clips?")) return;

clipsRef.once("value",snap=>{

snap.forEach(child=>{

const clip=child.val();

if(!clip.pinned){

clipsRef.child(child.key).remove();

}

});

});

}

function clearAll(){

if(!confirm("Delete EVERYTHING?")) return;

clipsRef.remove();

}

const clipsDiv =
document.getElementById("clips");

const searchInput =
document.getElementById("search");

let allClips = {};

clipsRef.on("value",snapshot=>{

allClips = snapshot.val() || {};

renderClips();

});

searchInput.addEventListener(
"input",
renderClips
);

function renderClips(){

clipsDiv.innerHTML="";

const search =
searchInput.value.toLowerCase();

let entries =
Object.entries(allClips);

entries.sort((a,b)=>{

return (b[1].pinned - a[1].pinned);

});

entries.forEach(([id,clip])=>{

if(
!clip.title.toLowerCase().includes(search)
&&
!clip.content.toLowerCase().includes(search)
){

return;

}

const div =
document.createElement("div");

div.className =
clip.pinned
?
"clip pinned"
:
"clip";

div.innerHTML=`

<div class="clip-title">

${clip.pinned ? "📌" : "📄"}

${clip.title}

</div>

<div class="clip-content">

${clip.content}

</div>

<br>

<button
onclick="copyClip(
\`${clip.content.replace(/`/g,"\\`")}\`
)">
Copy
</button>

<button
onclick="togglePin(
'${id}',
${clip.pinned}
)">
${clip.pinned ? "Unpin":"Pin"}
</button>

<button
onclick="deleteClip(
'${id}'
)">
Delete
</button>

`;

clipsDiv.appendChild(div);

});

}

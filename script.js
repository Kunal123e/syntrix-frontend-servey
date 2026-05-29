const API_URL =
"https://syntrix-airdrop.onrender.com/api/claim-airdrop";

const surveyContainer =
document.getElementById("surveyContainer");

const nextBtn =
document.getElementById("nextBtn");

const prevBtn =
document.getElementById("prevBtn");

const submitSection =
document.getElementById("submitSection");

const form =
document.getElementById("claimForm");

const statusDiv =
document.getElementById("status");

const progressFill =
document.querySelector(".progressFill");

const progressText =
document.querySelector(".progressText");

const steps =
document.querySelectorAll(".step");

let currentSection = 0;

const answers = {};

function renderSection() {

const section =
surveySections[currentSection];

surveyContainer.innerHTML = ` <div class="section"> <h2 class="sectionTitle">
${section.title} </h2>

```
  ${section.questions.map(q => {

    if(q.type === "textarea"){

      return `
        <div class="question">

          <h3>${q.text}</h3>

          <textarea
            data-id="${q.id}"
            placeholder="Write your answer..."
          >${answers[q.id] || ""}</textarea>

        </div>
      `;
    }

    return `
      <div class="question">

        <h3>${q.text}</h3>

        <div class="options">

          ${q.options.map(opt => `

            <div
              class="option
              ${answers[q.id] === opt ? "selected" : ""}"
              data-question="${q.id}"
              data-value="${opt}"
            >

              ${opt}

            </div>

          `).join("")}

        </div>

      </div>
    `;

  }).join("")}

</div>
```

`;

updateProgress();

attachOptionEvents();

attachTextareaEvents();

if(currentSection === 0){
prevBtn.style.display = "none";
}else{
prevBtn.style.display = "inline-block";
}

if(currentSection === surveySections.length - 1){

```
nextBtn.style.display = "none";

submitSection.classList.remove("hidden");
```

}else{

```
nextBtn.style.display = "inline-block";

submitSection.classList.add("hidden");
```

}

}

function attachOptionEvents(){

const options =
document.querySelectorAll(".option");

options.forEach(option => {

```
option.addEventListener("click", () => {

  const question =
  option.dataset.question;

  const value =
  option.dataset.value;

  answers[question] = value;

  renderSection();

});
```

});

}

function attachTextareaEvents(){

const textareas =
document.querySelectorAll("textarea");

textareas.forEach(textarea => {

```
textarea.addEventListener("input", () => {

  answers[textarea.dataset.id] =
  textarea.value;

});
```

});

}

function updateProgress(){

const percent =
((currentSection + 1)
/ surveySections.length) * 100;

progressFill.style.width =
percent + "%";

progressText.innerText =
`Progress ${currentSection + 1}/${surveySections.length}`;

steps.forEach((step,index)=>{

```
if(index <= currentSection){

  step.classList.add("active");

}else{

  step.classList.remove("active");

}
```

});

}

nextBtn.addEventListener("click", () => {

currentSection++;

renderSection();

});

prevBtn.addEventListener("click", () => {

currentSection--;

renderSection();

});

form.addEventListener("submit", async (e) => {

e.preventDefault();

const email =
document.getElementById("email").value;

const walletAddress =
document.getElementById("walletAddress").value;

statusDiv.innerHTML =
"Submitting survey...";

try{

```
const response =
await fetch(API_URL, {

  method:"POST",

  headers:{
    "Content-Type":"application/json"
  },

  body:JSON.stringify({

    email,
    walletAddress,

    ...answers

  })

});

const data =
await response.json();

if(data.success){

  statusDiv.innerHTML = `
    ✅ SUCCESS <br><br>

    Tokens Sent Successfully.
    <br><br>

    TX HASH:
    <br>
    ${data.transactionHash}
  `;

  form.reset();

}else{

  statusDiv.innerHTML =
  "❌ " + data.error;

}
```

}catch(err){

```
statusDiv.innerHTML =
"Server Error";
```

}

});

renderSection();

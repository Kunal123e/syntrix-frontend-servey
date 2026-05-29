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

surveyContainer.innerHTML = `

```
<div class="section">

  <h2 class="sectionTitle">
    ${section.title}
  </h2>

  ${section.questions.map(q => {

    // ================= TEXTAREA =================

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

    // ================= MULTI SELECT =================

    if(q.multiple){

      const selectedValues =
      answers[q.id] || [];

      return `
        <div class="question">

          <h3>${q.text}</h3>

          <div class="options">

            ${q.options.map(opt => `

              <div
                class="option
                ${selectedValues.includes(opt) ? "selected" : ""}"
                data-question="${q.id}"
                data-value="${opt}"
                data-multiple="true"
              >

                ${opt}

              </div>

            `).join("")}

          </div>

        </div>
      `;
    }

    // ================= SINGLE SELECT =================

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

// ================= BUTTON DISPLAY =================

if(currentSection === 0){

```
prevBtn.style.display = "none";
```

}else{

```
prevBtn.style.display = "inline-block";
```

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

  const multiple =
  option.dataset.multiple;

  // ================= MULTIPLE =================

  if(multiple){

    if(!answers[question]){

      answers[question] = [];

    }

    if(answers[question].includes(value)){

      answers[question] =
      answers[question].filter(
        item => item !== value
      );

    }else{

      answers[question].push(value);

    }

  }else{

    // ================= SINGLE =================

    answers[question] = value;

  }

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

// ================= VALIDATION =================

function validateCurrentSection(){

const currentQuestions =
surveySections[currentSection].questions;

let valid = true;

currentQuestions.forEach(q => {

```
// textarea validation

if(q.type === "textarea"){

  if(
    !answers[q.id] ||
    answers[q.id].trim() === ""
  ){
    valid = false;
  }

}else{

  // multi select validation

  if(q.multiple){

    if(
      !answers[q.id] ||
      answers[q.id].length === 0
    ){
      valid = false;
    }

  }else{

    // single select validation

    if(!answers[q.id]){

      valid = false;

    }

  }

}
```

});

return valid;

}

// ================= NEXT =================

nextBtn.addEventListener("click", () => {

const valid =
validateCurrentSection();

if(!valid){

```
statusDiv.innerHTML =
"❌ Please answer all questions before continuing.";

statusDiv.style.color =
"#ff3b3b";

return;
```

}

statusDiv.innerHTML = "";

currentSection++;

renderSection();

});

// ================= PREVIOUS =================

prevBtn.addEventListener("click", () => {

currentSection--;

renderSection();

});

// ================= SUBMIT =================

form.addEventListener("submit", async (e) => {

e.preventDefault();

const email =
document.getElementById("email").value;

const walletAddress =
document.getElementById("walletAddress").value;

// ================= EMAIL VALIDATION =================

if(!email || !walletAddress){

```
statusDiv.innerHTML =
"❌ Please fill all required fields.";

return;
```

}

// ================= WALLET VALIDATION =================

if(
!walletAddress.startsWith("0x") ||
walletAddress.length !== 42
){

```
statusDiv.innerHTML =
"❌ Invalid wallet address.";

return;
```

}

statusDiv.innerHTML =
"⏳ Transmitting encrypted consumer metrics array...";

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

// ================= SUCCESS =================

if(data.success){

  statusDiv.innerHTML = `

    <div class="successBox">

      <h2>
        ✅ Claim Successful
      </h2>

      <p>
        Your 10 SYNX reward has been sent successfully.
      </p>

      <div class="txBox">

        <strong>
          Transaction Hash:
        </strong>

        <br><br>

        <span>
          ${data.transactionHash}
        </span>

      </div>

    </div>

  `;

  form.reset();

  Object.keys(answers).forEach(key => {
    delete answers[key];
  });

}else{

  statusDiv.innerHTML =
  "❌ " + data.error;

}
```

}catch(err){

```
console.error(err);

statusDiv.innerHTML =
"❌ Server Error";
```

}

});

// ================= START =================

renderSection();

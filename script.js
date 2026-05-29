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

        // ================= CHECKBOX =================

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

        // ================= SINGLE OPTION =================

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

  `;

  updateProgress();

  attachOptionEvents();

  attachTextareaEvents();

  // ================= BUTTON LOGIC =================

  if(currentSection === 0){

    prevBtn.style.display = "none";

  }else{

    prevBtn.style.display = "inline-block";

  }

  if(currentSection === surveySections.length - 1){

    nextBtn.style.display = "none";

    submitSection.classList.remove("hidden");

  }else{

    nextBtn.style.display = "inline-block";

    submitSection.classList.add("hidden");

  }

}

function attachOptionEvents(){

  const options =
  document.querySelectorAll(".option");

  options.forEach(option => {

    option.addEventListener("click", () => {

      const question =
      option.dataset.question;

      const value =
      option.dataset.value;

      const multiple =
      option.dataset.multiple;

      // ================= MULTI SELECT =================

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

        // ================= SINGLE SELECT =================

        answers[question] = value;

      }

      renderSection();

    });

  });

}

function attachTextareaEvents(){

  const textareas =
  document.querySelectorAll("textarea");

  textareas.forEach(textarea => {

    textarea.addEventListener("input", () => {

      answers[textarea.dataset.id] =
      textarea.value;

    });

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

    if(index <= currentSection){

      step.classList.add("active");

    }else{

      step.classList.remove("active");

    }

  });

}

// ================= NEXT =================

nextBtn.addEventListener("click", () => {

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

  // ================= VALIDATION =================

  if(!email || !walletAddress){

    statusDiv.innerHTML =
    "❌ Please fill all fields";

    return;
  }

  if(!walletAddress.startsWith("0x")
  || walletAddress.length < 42){

    statusDiv.innerHTML =
    "❌ Invalid wallet address";

    return;
  }

  statusDiv.innerHTML =
  "⏳ Transmitting encrypted consumer metrics array...";

  statusDiv.style.color =
  "#333";

  try{

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
            Your 10 SYNX reward has been sent.
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

  }catch(err){

    console.error(err);

    statusDiv.innerHTML =
    "❌ Server Error";

  }

});

// ================= START =================

renderSection();

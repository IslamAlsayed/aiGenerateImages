const formGenerator = document.querySelector(".form-generator");
const boardImages = document.getElementById("board-images");
const btnGenerate = document.getElementById("btn-generate");
const OPINAI_API_KEY = "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";
let isRetry = false;

const updateImages = (imagesArray) => {
  imagesArray.forEach((imbObject, index) => {
    const img = boardImages.querySelectorAll(".img")[index];

    // Set the image source to the AI-generated image data
    img.innerHTML = `<img src="data:image/jpeg;base64,${imbObject.b64_json}" alt="image">
        <a href="data:image/jpeg;base64,${imbObject.b64_json}" data-hover="download" class="dounload-btn">
          <i class="fa-solid fa-download"></i>
          <img src="data:image/jpeg;base64,${imbObject.b64_json}" alt="download icon">
        </a>`;

    img
      .querySelector(".dounload-btn")
      .setAttribute("download", `${new Date().getTime()}.jpg`);
  });
};

btnGenerate.addEventListener("click", () => {
  if (formGenerator.querySelector("input").value != "") {
    btnGenerate.style.opacity = ".5";
    btnGenerate.style.pointerEvents = "none";
  }
});

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPINAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImgQuantity),
          size: "256x256",
          response_format: "b64_json",
        }),
      }
    );
    const { data } = await response.json();

    updateImages(data);

    if (data) {
      btnGenerate.style.opacity = "1";
      btnGenerate.style.pointerEvents = "all";
      formGenerator.querySelector("input").value = "";
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    isRetry = false;
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();
  if (isRetry) return;
  isRetry = true;

  // Get user [ input and image quantity ] values from the form
  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = e.srcElement[1].value;
  setStyleInCss(userImgQuantity);

  const imageMarkupLoading = Array.from(
    { length: userImgQuantity },
    () =>
      `<div class="img">
        <div class="loading">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
        `
  ).join("");

  boardImages.innerHTML = imageMarkupLoading;

  generateAiImages(userPrompt, userImgQuantity);
};

function setStyleInCss(value) {
  return document.documentElement.style.setProperty("--countImage", value);
}

formGenerator.addEventListener("submit", handleFormSubmission);

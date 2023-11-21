const formGenerator = document.querySelector(".form-generator");
const boardImages = document.querySelector(".board-images");
const OPINAI_API_KEY = "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";
let isImageGenerated = true;

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
          size: "512x512",
          response_format: "b64_json",
        }),
      }
    );
    const { data } = await response.json();
    updateImages(data);
  } catch (error) {
    console.log(error.message);
  } finally {
    isImageGenerated = false;
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();
  if (isImageGenerated) return;
  isImageGenerated = true;

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

  const responseImages = Array.from(
    { length: userImgQuantity },
    () =>
      `<div class="img loader">
        <img src="./image.jpg" alt="image">
        <a href="#" download data-hover="download" class="dounload-btn">
          <i class="fa-solid fa-download"></i>
          <img src="./image.jpg" alt="download icon">
        </a>
      </div>
        `
  ).join("");

  generateAiImages(userPrompt, userImgQuantity);
};

function setStyleInCss(value) {
  return document.documentElement.style.setProperty("--countImage", value);
}

formGenerator.addEventListener("submit", handleFormSubmission);
// formGenerator.addEventListener("submit", generateAiImages);

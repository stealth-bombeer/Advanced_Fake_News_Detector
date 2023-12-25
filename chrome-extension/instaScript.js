// content_script.js

// Function to interact with the DOM elements
function manipulateDOM() {
  console.log("hoisfaj");
  // Example: Changing the background color of all paragraphs to red

  var divChild = document.createElement("div");
  divChild.style.border = "16px solid #f3f3f3";
  divChild.style.borderTop = "16px solid #3498db";
  divChild.style.borderRadius = "50%";
  divChild.style.width = "40px";
  divChild.style.height = "40px";
  divChild.style.animation = "spin 2s linear infinite";

  // Create the @keyframes spin animation
  var styleSheet = document.styleSheets[0];
  var keyframes = `@keyframes spin {
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
}`;

  if (styleSheet.insertRule) {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  } else if (styleSheet.addRule) {
    styleSheet.addRule("@keyframes spin", keyframes);
  }

  // Append divChild to spanParent
  var spanParent = document.createElement("span");
  spanParent.appendChild(divChild);
  imageElement.parentElement.appendChild(spanParent);

  setInterval(() => {
    const postContainer = document
      .querySelector("main")
      .querySelector("article")
      .querySelector("div")
      .children.item(2)
      .querySelector("div")
      .querySelector("div")
      .children.item(2)
      .querySelector("div")
      .children.item(1)
      .querySelector("span");
    console.log("About to display the element");

    console.log(postContainer.innerText);
  }, 4000);
  // tweet.style.backgroundColor = "red";
}

const extractImages = async () => {
  console.log("Inside the extractImages function");

  setTimeout(async () => {
    const imagesContainer = document
      .querySelector("main")
      .querySelector("div")
      .children.item(3)
      .querySelectorAll("img");

    for (const imageElement of imagesContainer) {
      console.log(imageElement.src);

      // Creating spinner
      var divChild = document.createElement("div");
      divChild.style.border = "16px solid #f3f3f3";
      divChild.style.borderTop = "16px solid #3498db";
      divChild.style.borderRadius = "50%";
      divChild.style.width = "40px";
      divChild.style.height = "40px";
      divChild.style.animation = "spin 2s linear infinite";

      // Create the @keyframes spin animation
      var styleSheet = document.styleSheets[0];
      var keyframes = `@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

      if (styleSheet.insertRule) {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      } else if (styleSheet.addRule) {
        styleSheet.addRule("@keyframes spin", keyframes);
      }

      // Append divChild to spanParent
      var spanParent = document.createElement("span");
      spanParent.appendChild(divChild);
      imageElement.parentElement.appendChild(spanParent);

      try {
        const res = await fetch("http://localhost:5000/imagegenerator", {
          method: "POST",
          body: imageElement.src,
        });

        const data = await res.json();
        console.log(data);

        const newData = {
          category: data[0],
          lbyr: data[1],
          viewsType: data[2],
          newsType: data[3],
          propogandaType: data[4],
          speechType: data[5],
          clickbaitType: data[6],
          sentiment: data[7],
          impKeyWords: data[8],
        };

        console.log(newData);

        if (newData.newsType != "factual news") {
          // article.style.backgroundColor = "red";
          spanParent.style.display = "none";
          const paragraph = document.createElement("p");
          paragraph.innerHTML = "&#10006;";
          paragraph.style.fontSize = "40px";

          console.log(imageElement.parentElement);
          imageElement.parentElement.parentElement.appendChild(paragraph);
        } else {
          spanParent.style.display = "none";
          const paragraph = document.createElement("p");
          paragraph.innerHTML = "&#9989;";
          paragraph.style.fontSize = "40px";

          imageElement.parentElement.parentElement.appendChild(paragraph);
        }

        try {
          const res = await fetch("http://localhost:4000/api/news/storeNews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newData),
          });

          const dataResponse = await res.json();
          console.log(dataResponse);
        } catch (err) {
          console.error(err.message);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  }, 8000);
};

// Execute the function when the content script is injected into the page
// manipulateDOM();
extractImages();

// async function apicall() {
//   const res = await fetch("https://dummyjson.com/products");
//   const data = await res.json();
//   console.log(data);
// }

// apicall();

// Define page area for response output
let output = document.getElementById("output");

// Add event listener to form
document.querySelector("#search").addEventListener("click", searchAdvice);
// Event listener for Random advice button
document.querySelector("#random").addEventListener("click", randomAdvice);

// Clear Advice
document.querySelector("#refresh").addEventListener("click", () => {
  location.reload();
});

// Function for generating advice
function searchAdvice(e) {
  e.preventDefault();
  let query = document.querySelector(".input");

  fetch(`https://api.adviceslip.com/advice/search/${query.value}`)
    .then((response) => {
      if (!response.ok) {
        // Manually throws an error
        throw new Error("Something went wrong...");
      }
      return response.json();
    })
    .then((data) => {
      if (data.message) {
        // Message displays if keyword doesn't match any queries
        output.textContent = "Sorry, no advice about this topic...";
      } else {
        // Randomly chooses an array index to display if more than 1 exists for 1 keyword
        const topNum = +data.total_results;
        const resultNum = Math.floor(Math.random() * topNum);
        output.textContent = `${data.slips[resultNum].id}: "${data.slips[resultNum].advice}"`;
      }
    })
    .catch((err) => {
      // Error is displayed
      output.textContent = err;
    })
    .finally(() => {
      // Clear input field & buttons
      query.value = "";
      refreshAdvice();
    });
}

// Generate random advice
function randomAdvice(e) {
  e.preventDefault();

  fetch("https://api.adviceslip.com/advice")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong...");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.slip);
      output.textContent = `${data.slip.id}: "${data.slip.advice}"`;
    })
    .catch((err) => {
      output.textContent = `There was an error: ${err.status}`;
    })
    .finally(() => {
      refreshAdvice();
    });
}

// Clear page function
function refreshAdvice() {
  document.querySelector("#search").setAttribute("hidden", true);
  document.querySelector("#random").setAttribute("disabled", true);
  document.querySelector(".input").setAttribute("disabled", true);
  document.querySelector("#refresh").removeAttribute("hidden");
}

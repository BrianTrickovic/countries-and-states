const countriesUrl = 'https://xc-countries-api.fly.dev/api/countries/';
let statesUrl;
let currentId;
let currentCode;


// Countries API and Handlebars
fetch(countriesUrl)
  .then(response => response.json())
  .then(data => {
    let apiData = data;
    
    // Handlebars
    const source = document.getElementById('countriesTemp').innerHTML;
    const template = Handlebars.compile(source);

    // Sorts Countries API data alphabetically by name
    apiData.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    const context = {
      country: apiData
    }
    const compiledHtml = template(context);

    const displayCountries = document.getElementById('countries');
    displayCountries.innerHTML = compiledHtml;

    // Gets currently selected value from user on Countries dropdown menu
    displayCountries.addEventListener("change", function() {
      // Get the selected value
      let selectedValue = this.value;
    
      if (selectedValue === 'Australia') {
        currentId = apiData[0]["id"];
        currentCode = apiData[0]["code"];
      } else if (selectedValue === 'Canada') {
        currentId = apiData[1]["id"];
        currentCode = apiData[1]["code"];
      } else if (selectedValue === 'United States'){
        currentId = apiData[2]["id"];
        currentCode = apiData[2]["code"];
      } else if (selectedValue === 'Newington') {
        currentId = apiData[3]["id"];
        currentCode = apiData[3]["code"];
      }

      if (currentCode === apiData[0]["code"] || currentCode === apiData[1]["code"] || currentCode === apiData[2]["code"] || currentCode === apiData[3]["code"]) {
        statesUrl = `https://xc-countries-api.fly.dev/api/countries/${currentCode}/states/`;
      } else {
        statesUrl = 'https://xc-countries-api.fly.dev/api/states/';
      }
      
      
      // States API and Handlebars
      fetch(statesUrl)
        .then(response => response.json())
        .then(data => {
          let apiData = data;

          // Handlebars
          const source = document.getElementById('statesTemp').innerHTML;
          const template = Handlebars.compile(source);

          const context = {
            state: apiData
          }
          const compiledHtml = template(context);

          const displayStates = document.getElementById('states');
          displayStates.innerHTML = compiledHtml;
        })
        .catch(error => console.error(error));
    });
  })
  .catch(error => console.error(error));


  const form = document.getElementById("form2");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value1 = document.getElementById("id").value;
    const value2 = document.getElementById("code").value;
    const value3 = document.getElementById("name").value;
    console.log(value1);
    const response = await fetch("https://xc-countries-api.fly.dev/api/countries/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: value1, code: value2, name: value3 }),
    });
    if (response.ok) {
      const selectElement = document.getElementById("countries");
      const optionElement = document.createElement("option");
      optionElement.value = value3;
      optionElement.textContent = value3;
      selectElement.appendChild(optionElement);
    }
  });

  const form3 = document.getElementById("form3");
  form3.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value1 = document.getElementById("code2").value;
    const value2 = document.getElementById("name2").value;
    console.log(value1);
    const response = await fetch("https://xc-countries-api.fly.dev/api/states/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: value1, name: value2 }),
    });
    if (response.ok) {
      const selectElement = document.getElementById("states");
      const optionElement = document.createElement("option");
      optionElement.value = value2;
      optionElement.textContent = value2;
      selectElement.appendChild(optionElement);
    }
  });



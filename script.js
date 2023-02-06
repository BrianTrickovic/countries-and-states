function sortData (apiData) {
  return apiData.sort(function (a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

function compareIdNumbers (a, b) {
  return a.id - b.id;
}

function findIndex (apiData, selectedValue) {
  for (let i = 0; i < apiData.length; i++) {
    if (selectedValue === apiData[i].name) {
      return i;
    }
  }
}

function getNextId (apiData) {
  for (let i = 0; i < apiData.length; i++) {
    if (apiData[i].id != (apiData[i + 1].id - 1)) {
      return apiData[i].id + 1;
    }
  }
}


const countriesUrl = 'https://xc-countries-api.fly.dev/api/countries/';

// Countries API and Handlebars
fetch(countriesUrl)
  .then(response => response.json())
  .then(data => {
    let apiData = data;
    
    // Handlebars
    const source = document.getElementById('countriesTemp').innerHTML;
    const template = Handlebars.compile(source);

    // Sorts Countries API data alphabetically by name
    sortData(apiData);

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

      // Find selected value's index in Countries apiData
      let index = findIndex(apiData, selectedValue);

      let currentId = apiData[index].id;
      let currentCode = apiData[index].code;

      let statesUrl = `https://xc-countries-api.fly.dev/api/countries/${currentCode}/states/`;
      // statesUrl = 'https://xc-countries-api.fly.dev/api/states/';
      
      
      // States API and Handlebars
      fetch(statesUrl)
        .then(response => response.json())
        .then(data => {
          let apiData = data;

          // Handlebars
          const source = document.getElementById('statesTemp').innerHTML;
          const template = Handlebars.compile(source);

          // Sorts States API data alphabetically by name
          sortData(apiData);

          const context = {
            state: apiData
          }
          const compiledHtml = template(context);

          const displayStates = document.getElementById('states');
          displayStates.innerHTML = compiledHtml;
        })
        .catch(error => console.error(error));
    });

    // POST form section

    apiData.sort(compareIdNumbers);
    // calculates the lowest available id value
    let nextId;
    try {
      nextId = getNextId(apiData);
    } catch (error) {
      nextId = apiData.length + 1;
    }

    // New Country form
    const form2 = document.getElementById("form2");
    form2.addEventListener("submit", async (event) => {
      event.preventDefault();
      const value1 = nextId;
      const value2 = document.getElementById("code").value;
      const value3 = document.getElementById("name").value;
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

    // New State form
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
  })
  .catch(error => console.error(error));


  



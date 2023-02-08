function sortData(apiData) {
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

function handlebars(idSource, idDisplay, apiData, variable) {
  const source = document.getElementById(idSource).innerHTML;
  const template = Handlebars.compile(source);

  // sorts API data alphabetically by name
  sortData(apiData);

  const context = {};
  context[variable] = apiData;
  const compiledHtml = template(context);
  const displayOptions = document.getElementById(idDisplay);
  displayOptions.innerHTML = compiledHtml;
}

function createNewCountryForm() {
  const form = document.getElementById("form2");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = document.getElementById("code").value;
    const name = document.getElementById("name").value;
    const response = await fetch('https://xc-countries-api.fly.dev/api/countries/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name }),
    });
    if (response.ok) {
      const selectElement = document.getElementById("countries");
      const optionElement = document.createElement("option");
      optionElement.value = name;
      optionElement.textContent = name;
      selectElement.appendChild(optionElement);
    }
  });
}

function createNewStateForm() {
  const form = document.getElementById("form3");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = document.getElementById("code2").value;
    const name = document.getElementById("name2").value;
    let currentId = document.getElementById("selectCountry").value;
    console.log(currentId);
    const response = await fetch("https://xc-countries-api.fly.dev/api/states/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name, countryId: currentId }),
    });
    if (response.ok) {
      const selectElement = document.getElementById("states");
      const optionElement = document.createElement("option");
      optionElement.value = name;
      optionElement.textContent = name;
      selectElement.appendChild(optionElement);
    }
  });
}

// GET SECTION

// Countries API and Handlebars
fetch("https://xc-countries-api.fly.dev/api/countries/")
  .then(response => response.json())
  .then(data => {
    handlebars('countriesTemp', 'countries', data, 'countries');
    handlebars('countriesTemp2', 'selectCountry', data, 'countries');
  })
  .catch(error => console.error(error));

// gets selected value from user on Countries dropdown menu then fills States dropdown menu with a country's states / provinces.
const countries = document.getElementById('countries');
countries.addEventListener("change", function() {
  let selectedValue = this.value;
  let statesUrl = `https://xc-countries-api.fly.dev/api/countries/${selectedValue}/states/`;

  // States API and Handlebars
  fetch(statesUrl)
  .then(response => response.json())
  .then(data => {
    handlebars('statesTemp', 'states', data, 'states');
  })
  .catch(error => console.error(error));
});


// POST SECTION

createNewCountryForm();
createNewStateForm();
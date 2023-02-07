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


// GET SECTION

const countriesUrl = 'https://xc-countries-api.fly.dev/api/countries/';

// Countries API and Handlebars
fetch(countriesUrl)
  .then(response => response.json())
  .then(data => {
    let apiData = data;

    // START: First Countries Handlebars
    const source = document.getElementById('countriesTemp').innerHTML;
    const template = Handlebars.compile(source);

    // sorts Countries API data alphabetically by name
    sortData(apiData);

    const context = {
      country: apiData
    }
    const compiledHtml = template(context);

    const displayCountries = document.getElementById('countries');
    displayCountries.innerHTML = compiledHtml;
    // END: First Countries Handlebars

    // START: Second Countries Handlebars
    const source2 = document.getElementById('countriesTemp2').innerHTML;
    const template2 = Handlebars.compile(source2);

    const context2 = {
      country: apiData
    }
    const compiledHtml2 = template2(context2);

    const displayCountries2 = document.getElementById('selectCountry');
    displayCountries2.innerHTML = compiledHtml2;
    // END: Second Countries Handlebars

    // gets currently selected value from user on Countries dropdown menu
    displayCountries.addEventListener("change", function() {
      // get the selected value
      let selectedValue = this.value;
      let statesUrl = `https://xc-countries-api.fly.dev/api/countries/${selectedValue}/states/`;
      // statesUrl = 'https://xc-countries-api.fly.dev/api/states/';
      
      
      // States API and Handlebars
      fetch(statesUrl)
        .then(response => response.json())
        .then(data => {
          let apiData = data;

          // START: States Handlebars
          const source = document.getElementById('statesTemp').innerHTML;
          const template = Handlebars.compile(source);

          // sorts States API data alphabetically by name
          sortData(apiData);

          const context = {
            state: apiData
          }
          const compiledHtml = template(context);

          const displayStates = document.getElementById('states');
          displayStates.innerHTML = compiledHtml;
          // END: States Handlebars
        })
        .catch(error => console.error(error));
    });


    // POST FORM SECTION

    // New Country form
    const form2 = document.getElementById("form2");
    form2.addEventListener("submit", async (event) => {
      event.preventDefault();
      const code = document.getElementById("code").value;
      const name = document.getElementById("name").value;
      const response = await fetch(countriesUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, name: name }),
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

      let statesUrl = "https://xc-countries-api.fly.dev/api/states/";      

      const code2 = document.getElementById("code2").value;
      const name2 = document.getElementById("name2").value;
      let currentId = displayCountries2.value;

      const response = await fetch(statesUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code2, name: name2, countryId: currentId }),
      });
      if (response.ok) {
        const selectElement = document.getElementById("states");
        const optionElement = document.createElement("option");
        optionElement.value = name2;
        optionElement.textContent = name2;
        selectElement.appendChild(optionElement);
      }
    });
  })
  .catch(error => console.error(error));


  



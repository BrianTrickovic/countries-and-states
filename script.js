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
      } else {
        currentId = apiData[2]["id"];
        currentCode = apiData[2]["code"];
      }

      statesUrl = `https://xc-countries-api.fly.dev/api/countries/${currentCode}/states/`;
      
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



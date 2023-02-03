const countriesUrl = 'https://xc-countries-api.fly.dev/api/countries/';

// Countries API and Handlebars
fetch(countriesUrl)
  .then(response => response.json())
  .then(data => {
    let apiData = data;
    
    const source = document.getElementById('countriesTemp').innerHTML;
    const template = Handlebars.compile(source);

    const context = {
      country: apiData
    }
    const compiledHtml = template(context);

    const displayCountries = document.getElementById('countries');
    displayCountries.innerHTML = compiledHtml;
  })
  .catch(error => console.error(error));



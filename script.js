class DropdownMenu extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const labelTitle = this.getAttribute("label-title");
    const menuFor = this.getAttribute("for");

    const label = document.createElement("label");
    label.setAttribute("for", menuFor);
    label.innerHTML = labelTitle;
    const select = label.appendChild(document.createElement("select"));
    select.setAttribute("id", menuFor);
    select.setAttribute("name", menuFor);
    const option = select.appendChild(document.createElement("option"));
    option.setAttribute("selected", "");
    option.setAttribute("disabled", "");
    option.setAttribute("hidden", "");
    option.innerHTML = "Choose here";
    const lineBreak = document.createElement("br");

    this.shadowRoot.append(label, lineBreak);
  }
}
customElements.define("dropdown-menu", DropdownMenu);

class CreateNewForm extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const formFor = this.getAttribute("for");
    const labelTitle = this.getAttribute("label-title");
    const showDropdown = this.hasAttribute("show-dropdown");

    const form = document.createElement("form");
    if (showDropdown) {
      const lineBreak1 = form.appendChild(document.createElement("br"));
      const categoryLabel = form.appendChild(document.createElement("label"));
      categoryLabel.setAttribute("for", `new${formFor}`);
      categoryLabel.innerHTML = this.getAttribute("dropdown-label-title");
      const categoryDropdown = form.appendChild(document.createElement("select"));
      categoryDropdown.setAttribute("id", `${this.getAttribute("dropdown-select-id")}`)
      const option = categoryDropdown.appendChild(document.createElement("option"));
      option.setAttribute("selected", "");
      option.setAttribute("disabled", "");
      option.setAttribute("hidden", "");
      option.innerHTML = "Choose here";
    }
    const lineBreak2 = form.appendChild(document.createElement("br"));
    const enterLabel = form.appendChild(document.createElement("label"));
    enterLabel.setAttribute("for", `new${formFor}`);
    enterLabel.innerHTML = labelTitle;
    const lineBreak3 = form.appendChild(document.createElement("br"));
    const nameLabel = form.appendChild(document.createElement("label"));
    nameLabel.setAttribute("for", `new${formFor}`);
    nameLabel.innerHTML = "Name: ";
    const nameInput = form.appendChild(document.createElement("input"));
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "name");
    const codeLabel = form.appendChild(document.createElement("label"));
    codeLabel.setAttribute("for", `new${formFor}`);
    codeLabel.innerHTML = "Code: ";
    const codeInput = form.appendChild(document.createElement("input"));
    codeInput.setAttribute("type", "text");
    codeInput.setAttribute("id", "code");
    const button = form.appendChild(document.createElement("button"));
    button.setAttribute("type", "submit");
    button.innerHTML = "Submit";

    
    this.shadowRoot.append(form);
  }
}
customElements.define("create-new-form", CreateNewForm);


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

function countriesAPIGetCall(url, selectElement) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    sortData(data);
    // Create the options for the select element from the API data
    const options = data.map(item => {
      const option = document.createElement('option');
      option.value = item.code;
      option.textContent = item.name;
      return option;
    });

    // Append the options to the shadow DOM
    options.forEach(option => selectElement.appendChild(option));
  })
  .catch(error => {
    console.error('There was a problem with the API call:', error);
  });
}

function statesAPIGetCall(url, selectElement) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    sortData(data);
    selectElement.innerHTML = null;

    const options = data.map(item => {
      const option = document.createElement('option');
      option.value = item.code;
      option.textContent = item.name;
      return option;
    });

    const defaultOption = selectElement.appendChild(document.createElement("option"));
    defaultOption.setAttribute("selected", "");
    defaultOption.setAttribute("disabled", "");
    defaultOption.setAttribute("hidden", "");
    defaultOption.innerHTML = "Choose here";
    options.forEach(option => selectElement.appendChild(option));
  })
  .catch(error => console.error(error));
}

function createNewCountryForm() {
  const form = document.getElementsByTagName('create-new-form')[0].shadowRoot.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = document.getElementsByTagName('create-new-form')[0].shadowRoot.getElementById("code").value;
    const name = document.getElementsByTagName('create-new-form')[0].shadowRoot.getElementById("name").value;
    const response = await fetch('https://xc-countries-api.fly.dev/api/countries/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name }),
    });
    if (response.ok) {
      const selectElement = document.getElementsByTagName('dropdown-menu')[0].shadowRoot.getElementById("countries");
      const optionElement = document.createElement("option");
      optionElement.value = name;
      optionElement.textContent = name;
      selectElement.appendChild(optionElement);
    }
  });
}

function createNewStateForm() {
  const form = document.getElementsByTagName('create-new-form')[1].shadowRoot.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = document.getElementsByTagName('create-new-form')[1].shadowRoot.getElementById("code").value;
    const name = document.getElementsByTagName('create-new-form')[1].shadowRoot.getElementById("name").value;
    let currentId = document.getElementsByTagName('create-new-form')[1].shadowRoot.getElementById('selectCountry').value;
    const response = await fetch("https://xc-countries-api.fly.dev/api/states/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name, countryId: currentId }),
    });
    if (response.ok) {
      const selectElement = document.getElementsByTagName('dropdown-menu')[1].shadowRoot.getElementById("states");
      const optionElement = document.createElement("option");
      optionElement.value = name;
      optionElement.textContent = name;
      selectElement.appendChild(optionElement);
    }
  });
}


// GET SECTION

// Countries API
countriesAPIGetCall('https://xc-countries-api.fly.dev/api/countries/', document.querySelector('dropdown-menu').shadowRoot.getElementById('countries'));
countriesAPIGetCall('https://xc-countries-api.fly.dev/api/countries/', document.getElementsByTagName('create-new-form')[1].shadowRoot.getElementById('selectCountry'));

// gets selected value from user on Countries dropdown menu then fills States dropdown menu with a country's states / provinces.
document.querySelector('dropdown-menu').shadowRoot.getElementById('countries').addEventListener("change", function() {
  let selectedValue = this.value;
  let statesUrl = `https://xc-countries-api.fly.dev/api/countries/${selectedValue}/states/`;

  // States API
  statesAPIGetCall(statesUrl, document.getElementsByTagName('dropdown-menu')[1].shadowRoot.getElementById('states'));
});

// POST SECTION

createNewCountryForm();
createNewStateForm();
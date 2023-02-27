class DropdownMenu extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    // FUNCTION: Sorts API's data alphabetically
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

    // FUNCTION: Fills API's data into a dropdown menu
    function fillAPIDataIntoDropdownMenu(url, selectElement, reset, selectedValue) {
      // Replaces any instance of ${selectedValue} in the dependent dropdown menu's
      // API href link to the currently selected value from the primary dropdown
      // menu, otherwise it uses the link as is.
      const apiUrl = selectedValue ? url.replace('${selectedValue}', selectedValue) : url;

      fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        sortData(data);

        // Clears the existing options in the dependent dropdown menu
        if (reset) {
          selectElement.innerHTML = null;
          const option = select.appendChild(document.createElement("option"));
          option.setAttribute("selected", "");
          option.setAttribute("disabled", "");
          option.setAttribute("hidden", "");
          option.innerHTML = "Choose here";
        }

        // Creates the options for the select element from the API data
        const options = data.map(item => {
          const option = document.createElement('option');
          option.value = item.code;
          option.textContent = item.name;
          return option;
        });
    
        // Appends the options to the shadow DOM
        options.forEach(option => selectElement.appendChild(option));
      })
      .catch(error => {
        console.error('There was a problem with the API call:', error);
      });
    }

    const labelTitle = this.getAttribute("label-title");
    const menuFor = this.getAttribute("for");
    const showAPIHref = this.hasAttribute("api-href");
    const activateGetValueFromAttribute = this.hasAttribute("get-value-from");

    // Creates HTML elements
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

    // Executes if it is a standalone or primary dropdown menu
    if (showAPIHref) {
      const apiHref = this.getAttribute("api-href");
      fillAPIDataIntoDropdownMenu(apiHref, select);
    }
    // Executes if it is a dependent dropdown menu
    if (activateGetValueFromAttribute) {
      const getValueFromAttributeValue = this.getAttribute("get-value-from");
      const applyValueToSecondAPIHref = this.getAttribute("apply-value-to-second-api-href");
      const dropdownMenuElements = document.getElementsByTagName("dropdown-menu");

      for (let i = 0; i < dropdownMenuElements.length; i++) {
        if (dropdownMenuElements[i].attributes.for.value === getValueFromAttributeValue) {
          dropdownMenuElements[i].shadowRoot.getElementById(getValueFromAttributeValue).addEventListener("change", function() {
            // Gets selected value from primary dropdown menu
            let selectedValue = this.value;
          
            // Fills API's data into dependent dropdown menu
            fillAPIDataIntoDropdownMenu(applyValueToSecondAPIHref, select, activateGetValueFromAttribute, selectedValue);
          });
          break;
        }
      }
    }

    this.shadowRoot.append(label, lineBreak);
  }
}
customElements.define("dropdown-menu", DropdownMenu);

class CreateNewForm extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    // FUNCTION: Sorts API's data alphabetically
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

    // FUNCTION: Fills API's data into a dropdown menu
    function fillAPIDataIntoDropdownMenu(url, selectElement) {
      fetch(url)
      .then(response => response.json())
      .then(data => {
        sortData(data);
        // Creates the options for the select element from the API data
        const options = data.map(item => {
          const option = document.createElement('option');
          option.value = item.id;
          option.textContent = item.name;
          return option;
        });
    
        // Appends the options to the shadow DOM
        options.forEach(option => selectElement.appendChild(option));
      })
      .catch(error => {
        console.error('There was a problem with the API call:', error);
      });
    }


    const showDropdown = this.hasAttribute("show-dropdown");
    const formFor = this.getAttribute("for");
    const labelTitle = this.getAttribute("label-title");

    // Creates HTML elements
    const form = document.createElement("form");
    // Creates a dropdown menu if the show-dropdown attribute exists in the element
    if (showDropdown) {
      const showDropdownAPIHref = this.hasAttribute("dropdown-api-href");
      const lineBreak1 = form.appendChild(document.createElement("br"));
      const categoryLabel = form.appendChild(document.createElement("label"));
      categoryLabel.setAttribute("for", `new${formFor}`);
      categoryLabel.innerHTML = this.getAttribute("dropdown-label-title");
      const categoryDropdown = form.appendChild(document.createElement("select"));
      const option = categoryDropdown.appendChild(document.createElement("option"));
      option.setAttribute("selected", "");
      option.setAttribute("disabled", "");
      option.setAttribute("hidden", "");
      option.innerHTML = "Choose here";
      // Fills dropdown menu with API's data if an "api-href" attribute exists in the element
      // otherwise, the dropdown menu remains empty.
      if (showDropdownAPIHref) {
        const dropdownAPIHref = this.getAttribute("dropdown-api-href");
        fillAPIDataIntoDropdownMenu(dropdownAPIHref, categoryDropdown);
      }
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

  createNewOption(url, code, name) {
    const response = fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name }),
    });
    if (response.ok) {
      console.log("POST: SUCCESS");
    }
  }

  createNewOptionDropdown(url, code, name, id) {
    const response = fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name, countryId: id }),
    });
    if (response.ok) {
      console.log("POST: SUCCESS");
    }
  }

  static get observedAttributes() {
    return ['submitted'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'submitted') {
      const apiUrl = this.getAttribute("post-api-href");
      const codeValue = this.shadowRoot.getElementById('code').value;
      const nameValue = this.shadowRoot.getElementById('name').value;
      const showDropdown = this.hasAttribute("show-dropdown");
      if (showDropdown) {
        const idValue = this.shadowRoot.querySelector('select').value;
        this.createNewOptionDropdown(apiUrl, codeValue, nameValue, idValue);
      } else {
        this.createNewOption(apiUrl, codeValue, nameValue);
      }
      console.log('Button submitted:', newValue);
    }
  }

  connectedCallback() {
    const button = this.shadowRoot.querySelector('button');
    button.addEventListener('submit', (event) => {
      event.preventDefault();
      this.setAttribute('submitted', 'true');
    });
  }
}
customElements.define("create-new-form", CreateNewForm);





















// const selectElement = document.getElementsByTagName('dropdown-menu')[0].shadowRoot.getElementById("countries");
// const optionElement = document.createElement("option");
// optionElement.value = name;
// optionElement.textContent = name;
// selectElement.appendChild(optionElement);
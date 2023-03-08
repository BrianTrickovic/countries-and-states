import { LitElement, css, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { independentDropdownData, dependentDropdownData } from './options-api.js';

export class DropdownMenu extends LitElement {
  static properties = {
    post: { type: Boolean },
    labelTitle: { type: String, reflect: true },
    optionsArray: { type: Array },
    value: { type: String, reflect: true },
  }

  static styles = css`
    :host {
      display: block;
      margin: 0;
    }
  `;

  constructor() {
    super();
    this.optionsArray = [];
  }

  render() {
    return html`
      <label>${this.labelTitle}:</label>
      <select @change=${this._optionChange}>
        <option selected disabled hidden>Choose here</option>
        ${this.optionsArray.length > 0
          ? this.optionsArray.map(
              (item) => html`
                <option selected disabled hidden>Choose here</option>
                <option value=${item.value}>${item.name}</option>
              `
            )
          : html`<option selected disabled hidden>(none)</option>`}
      </select>
    `;
  }
  
  _optionChange(e) {
    this.value = e.target.value;
  }
}
customElements.define('dropdown-menu', DropdownMenu);

export class CreateNewOption extends LitElement {
  static properties = {
    labelTitle: { type: String, reflect: true },
    icon: {},
    apiHref: { type: String, reflect: true },
    name: { type: String },
    code: { type: String },
  }

  static styles = css`
    :host {
      display: block;
      margin: 0;
    }
    ::slotted(.checkmark) {
      color: green;
    }
    ::slotted(.x) {
      color: red;
    }
  `;
  
  constructor() {
    super();
  }

  render() {
    return html`
      <label>${this.labelTitle}:</label>
      <br>
      <label>Name:</label>
      <input type="text"></input>
      <label>Code:</label>
      <input type="text"></input>
      <button type="submit" @click=${this._buttonSubmit}>Submit</button>
      ${this.icon}
    `
  }

  postRequest(url, code, name) {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name })
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      this.icon = html`
        <slot name="error">
        </slot>
      `
      throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message);
    }).then(jsonResponse => {
      console.log(jsonResponse);
      this.icon = html`
        <slot name="success">
        </slot>
      `
    })
  }

  _buttonSubmit(e) {
    const inputElements = this.shadowRoot.querySelectorAll('input');
    this.name = inputElements[0].value;
    this.code = inputElements[1].value;

    this.postRequest(this.apiHref, this.code, this.name);
  }
}
customElements.define("create-new-option", CreateNewOption);

export class CreateNewOptionWithDropdown extends LitElement {
  static properties = {
    labelTitle: { type: String, reflect: true },
    apiHref: { type: String, reflect: true },
    icon: { type: String },
    name: { type: String },
    code: { type: String },
    id: { type: Number },
  }

  static styles = css`
    :host {
      display: block;
      margin: 0;
    }
    ::slotted(.checkmark) {
      color: green;
    }
    ::slotted(.x) {
      color: red;
    }
  `;
  
  constructor() {
    super();
  }

  render() {
    return html`
      <slot>
      </slot>
      <label>${this.labelTitle}:<label>
      <br>
      <label>Name:</label>
      <input type="text"></input>
      <label>Code:</label>
      <input type="text"></input>
      <button type="submit" @click=${this._buttonSubmit}>Submit</button>
      ${this.icon}
    `
  }

  postRequest(url, code, name, id) {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name, countryId: id })
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      this.icon = html`
        <slot name="error">
        </slot>
      `
      throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message);
    }).then(jsonResponse => {
      console.log(jsonResponse);
      this.icon = html`
        <slot name="success">
        </slot>
      `
    })
  }

  _buttonSubmit(e) {
    const inputElements = this.shadowRoot.querySelectorAll('input')
    this.name = inputElements[0].value;
    this.code = inputElements[1].value;
    this.id = this.querySelector('dropdown-menu').getAttribute('value');

    this.postRequest(this.apiHref, this.code, this.name, this.id);
  }
}
customElements.define("create-new-option-with-dropdown", CreateNewOptionWithDropdown);


const dropdownMenuElements = document.querySelectorAll('dropdown-menu');

independentDropdownData(dropdownMenuElements[0], 'code')
independentDropdownData(dropdownMenuElements[2], 'id')

// Create a new MutationObserver instance
const observer = new MutationObserver((mutationsList, observer) => {
  // Loop through each mutation that was observed
  for (const mutation of mutationsList) {
    // Check if the mutation is for the "value" attribute
    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
      // Get the new value of the "value" attribute
      const newValue = mutation.target.getAttribute('value');
      // Use the new value as input for the 1st parameter of dependentDropdownData function to
      // retrieve a country's state list on the user's demand.
      console.log('New value:', newValue);
      dependentDropdownData(newValue, dropdownMenuElements[1])
    }
  }
});

// Start observing the element for changes to the "value" attribute
observer.observe(dropdownMenuElements[0], { attributes: true, attributeFilter: ['value'] });
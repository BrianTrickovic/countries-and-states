import {LitElement, css, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { objectData, countryNames, countryIds } from './options-api.js';

export class DropdownMenu extends LitElement {
  static properties = {
    name: {},
    labelTitle: { reflect: true },
    optionsArray: { type: Array },
    optionValueInput: { type: Array },
    value: {reflect: true, type: String, default: '' },
  }

  static styles = css`
    :host {
      display: block;
      margin: 0;
    }
  `;

  constructor() {
    super();
  }

  render() {
    return html`
      <label>${this.labelTitle}:</label>
      <select @change=${this._optionChange}>
        <option selected disabled hidden>Choose here</option>
        ${this.optionsArray ? this.optionsArray.map((item, index) => html`
          <option value=${this.optionValueInput[index]}>${item}</option>
        `) : ''}
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
    labelTitle: { reflect: true },
    apiHref: { reflect: true },
    name: { type: String },
    code: { type: String },
  }

  static styles = css`
    :host {
      display: block;
      margin: 0;
    }
  `;
  
  constructor() {
    super();
  }

  render() {
    return html`
      <label>${this.labelTitle}:<label>
      <br>
      <label>Name:</label>
      <input type="text"></input>
      <label>Code:</label>
      <input type="text"></input>
      <button type="submit" @click=${this._buttonSubmit}>Submit</button>
    `
  }

  postRequest(url, code, name) {
    const response = fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name }),
    });
    if (response.ok) {
      console.log("POST: SUCCESS");
    }
  }

  _buttonSubmit(e) {
    this.name = this.shadowRoot.querySelector('input').value;
    this.code = this.shadowRoot.querySelectorAll('input')[1].value;

    this.postRequest(this.apiHref, this.code, this.name);
  }
}
customElements.define("create-new-option", CreateNewOption);

export class CreateNewOptionWithDropdown extends LitElement {
  static properties = {
    labelTitle: { reflect: true },
    apiHref: { reflect: true },
    name: { type: String },
    code: { type: String },
    id: { type: Number }
  }

  static styles = css`
    :host {
      display: block;
      margin: 0;
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
    `
  }

  postRequest(url, code, name, id) {
    const response = fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, name: name, countryId: id }),
    });
    if (response.ok) {
      console.log("POST: SUCCESS");
    }
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

// dropdownMenuElements[0].optionsArray = [];
// dropdownMenuElements[0].optionValueInput = [];
// dropdownMenuElements[2].optionsArray = [];
// dropdownMenuElements[2].optionValueInput = [];

dropdownMenuElements[0].optionsArray = countryNames;
dropdownMenuElements[0].optionValueInput = countryNames;

dropdownMenuElements[1].optionValueInput = '';

dropdownMenuElements[2].optionsArray = countryNames;
dropdownMenuElements[2].optionValueInput = countryIds;

// Create a new MutationObserver instance
const observer = new MutationObserver((mutationsList, observer) => {
  // Loop through each mutation that was observed
  for (const mutation of mutationsList) {
    // Check if the mutation is for the "value" attribute
    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
      // Get the new value of the "value" attribute
      const newValue = mutation.target.getAttribute('value');
      // Use the new value to retrieve ObjectData's value (an array) of the selected key
      // then assign that array to the 2nd dropdown-menu element's optionsArray reactive property
      console.log('New value:', newValue);
      const dataForSelectedValue = objectData[newValue];
      dropdownMenuElements[1].optionsArray = dataForSelectedValue;
    }
  }
});

// Start observing the element for changes to the "value" attribute
observer.observe(dropdownMenuElements[0], { attributes: true, attributeFilter: ['value'] });
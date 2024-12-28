import React from "react";

class ProxyFormInputClass extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ["value"];
  _internals: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  __getProxyEl() {
    var el = this.querySelector(
      'button, a[href], input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    return (el != null && el instanceof HTMLElement) ? el : null;
  }

  __validate() {
    var proxyEl = this.__getProxyEl();

    if (proxyEl == null) {
      return;
    }

    var message = "";
    var valueMissing = false;
    var value = this.value;

    if (this.hasAttribute("required") && value === "") {
      message = "Required";
      valueMissing = true;
    }

    this._internals.setValidity(
      {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valueMissing,
      },
      message,
      proxyEl,
    );
  }

  connectedCallback() {
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    this.addEventListener("focus", () => {
      this.__getProxyEl()?.focus();
    });

    this.__validate();
  }

  get value() {
    var value = this.getAttribute("value");
    return value == null ? "" : value;
  }

  set value(value) {
    this.setAttribute("value", value);
    this._internals.setFormValue(value);
  }

  get form() {
    return this._internals.form;
  }

  get name() {
    var name = this.getAttribute("name");
    return name == null ? "" : name;
  }

  set name(value) {
    this.setAttribute("name", value);
  }

  get type() {
    return this.localName;
  }

  attributeChangedCallback(name: string, prev: string, next: string) {
    switch (name) {
      case "value":
        this.__validate();
        break;
    }
  }

  formDisabledCallback(disabled: boolean) {
    var el = this.__getProxyEl();

    if (el != null) {
      // @ts-expect-error
      el.disabled = disabled;
    }
  }

  formResetCallback() {
    // @TBD
  }

  public checkValidity(): boolean {
    this.__validate();
    return this._internals.checkValidity();
  }

  public reportValidity(): void {
    this._internals.reportValidity();
  }

  public get validity(): ValidityState {
    return this._internals.validity;
  }

  public get validationMessage(): string {
    return this._internals.validationMessage;
  }

  get willValidate() {
    return this._internals.willValidate;
  }
}

customElements.define("proxy-form-input", ProxyFormInputClass);

interface ProxyFormInputProps extends React.PropsWithChildren {
  name?: string;
  value?: string | number;
  required?: boolean;
}

function ProxyFormInput(props: ProxyFormInputProps) {
  const { name, value, required, children } = props;
  return React.createElement(
    "proxy-form-input",
    { name, value, required },
    children,
  );
}

export { ProxyFormInput };

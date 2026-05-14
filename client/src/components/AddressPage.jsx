import { useMemo, useState } from "react";
import { getStatesForCountry, supportedCountries } from "../data/regions";
import { useAddressBook } from "../context/AddressContext";
import { useLanguage } from "../context/LanguageContext";

const emptyForm = {
  id: "",
  label: "Home",
  firstName: "",
  lastName: "",
  contact: "",
  country: "United States",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
  isDefault: true
};

export function AddressPage() {
  const { addresses, saveAddress, removeAddress, setDefaultAddress } = useAddressBook();
  const { t } = useLanguage();
  const [formState, setFormState] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const isEditing = Boolean(formState.id);
  const hasAddresses = addresses.length > 0;
  const sortedAddresses = useMemo(
    () => [...addresses].sort((left, right) => Number(right.isDefault) - Number(left.isDefault)),
    [addresses]
  );
  const stateOptions = useMemo(() => getStatesForCountry(formState.country), [formState.country]);

  function updateField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  function updateCountry(country) {
    const nextStates = getStatesForCountry(country);
    setFormState((current) => ({
      ...current,
      country,
      state: nextStates.includes(current.state) ? current.state : nextStates[0] ?? ""
    }));
  }

  function resetForm() {
    setFormState({
      ...emptyForm,
      isDefault: !hasAddresses
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formState.firstName || !formState.lastName || !formState.contact || !formState.address || !formState.city || !formState.state || !formState.zipCode) {
      setMessage(t("address.requiredFields"));
      return;
    }

    saveAddress(formState);
    setMessage(isEditing ? t("address.addressUpdated") : t("address.addressSaved"));
    resetForm();
  }

  return (
    <main className="account-page address-page">
      <section className="container account-page__hero">
        <p className="account-page__eyebrow">{t("address.eyebrow")}</p>
        <h1>{t("address.title")}</h1>
        <p>{t("address.description")}</p>
      </section>

      <section className="container address-page__layout">
        <div className="address-page__panel">
          <div className="address-page__panel-head">
            <h2>{isEditing ? t("address.editAddress") : t("address.addNewAddress")}</h2>
            {isEditing ? (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setMessage("");
                }}
              >
                {t("common.cancel")}
              </button>
            ) : null}
          </div>

          <form className="address-form" onSubmit={handleSubmit}>
            <div className="address-form__row address-form__row--split">
              <label>
                <span>{t("address.label")}</span>
                <select value={formState.label} onChange={(event) => updateField("label", event.target.value)}>
                  <option>{t("address.home")}</option>
                  <option>{t("address.office")}</option>
                  <option>{t("address.studio")}</option>
                </select>
              </label>
              <label>
                <span>{t("address.country")}</span>
                <select value={formState.country} onChange={(event) => updateCountry(event.target.value)}>
                  {supportedCountries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="address-form__row address-form__row--split">
              <label>
                <span>{t("auth.firstName")}</span>
                <input type="text" value={formState.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
              </label>
              <label>
                <span>{t("auth.lastName")}</span>
                <input type="text" value={formState.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
              </label>
            </div>

            <label>
              <span>{t("address.emailOrMobile")}</span>
              <input type="text" value={formState.contact} onChange={(event) => updateField("contact", event.target.value)} />
            </label>

            <label>
              <span>{t("address.address")}</span>
              <input type="text" value={formState.address} onChange={(event) => updateField("address", event.target.value)} />
            </label>

            <label>
              <span>{t("address.apartment")}</span>
              <input type="text" value={formState.apartment} onChange={(event) => updateField("apartment", event.target.value)} />
            </label>

            <div className="address-form__row address-form__row--triple">
              <label>
                <span>{t("address.city")}</span>
                <input type="text" value={formState.city} onChange={(event) => updateField("city", event.target.value)} />
              </label>
              <label>
                <span>{t("address.state")}</span>
                <select value={formState.state} onChange={(event) => updateField("state", event.target.value)}>
                  <option value="">{t("common.selectState")}</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t("address.zipCode")}</span>
                <input type="text" value={formState.zipCode} onChange={(event) => updateField("zipCode", event.target.value)} />
              </label>
            </div>

            <label className="address-form__checkbox">
              <input
                type="checkbox"
                checked={formState.isDefault}
                onChange={(event) => updateField("isDefault", event.target.checked)}
              />
              <span>{t("address.setDefault")}</span>
            </label>

            {message ? <p className="address-form__message">{message}</p> : null}

            <button type="submit" className="address-form__submit">
              {isEditing ? t("address.updateAddress") : t("address.saveAddress")}
            </button>
          </form>
        </div>

        <div className="address-page__panel">
          <div className="address-page__panel-head">
            <h2>{t("address.savedAddresses")}</h2>
          </div>

          {sortedAddresses.length ? (
            <div className="address-book">
              {sortedAddresses.map((item) => (
                <article className="address-card" key={item.id}>
                  <div className="address-card__head">
                    <div>
                      <h3>{item.label}</h3>
                      {item.isDefault ? <span>{t("common.defaultLabel")}</span> : null}
                    </div>
                    <div className="address-card__actions">
                      <button type="button" onClick={() => { setFormState(item); setMessage(""); }}>
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removeAddress(item.id);
                          setMessage("");
                          if (formState.id === item.id) {
                            resetForm();
                          }
                        }}
                      >
                        {t("common.delete")}
                      </button>
                    </div>
                  </div>

                  <p>{item.firstName} {item.lastName}</p>
                  <p>{item.contact}</p>
                  <p>{item.address}{item.apartment ? `, ${item.apartment}` : ""}</p>
                  <p>{item.city}, {item.state} {item.zipCode}</p>
                  <p>{item.country}</p>

                  {!item.isDefault ? (
                    <button type="button" className="address-card__default" onClick={() => setDefaultAddress(item.id)}>
                      {t("address.makeDefault")}
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="account-empty-state">
              <h2>{t("address.noSavedAddresses")}</h2>
              <p>{t("address.noSavedAddressesDescription")}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

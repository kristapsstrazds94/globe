import {
  formatAreaKm2,
  formatAreaPercent,
  formatClimate,
  formatGdpUsdMillions,
  formatLanguageList,
  formatList,
  formatPopulation,
  formatPopulationDensity,
} from "@/lib/ui/formatCountryStats";
import type { Country } from "@/types";

type CountryPanelMetaProps = {
  country: Country;
};

export function CountryPanelMeta({ country }: CountryPanelMetaProps) {
  return (
    <dl className="country-panel__meta">
      {country.population !== undefined ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Population</dt>
          <dd className="country-panel__meta-value">{formatPopulation(country.population)}</dd>
        </div>
      ) : null}
      {country.totalAreaKm2 !== undefined ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Total area</dt>
          <dd className="country-panel__meta-value">{formatAreaKm2(country.totalAreaKm2)}</dd>
        </div>
      ) : null}
      {country.landAreaPercent !== undefined ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Land</dt>
          <dd className="country-panel__meta-value">
            {formatAreaPercent(country.landAreaPercent)}
          </dd>
        </div>
      ) : null}
      {country.waterAreaPercent !== undefined ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Water</dt>
          <dd className="country-panel__meta-value">
            {formatAreaPercent(country.waterAreaPercent)}
          </dd>
        </div>
      ) : null}
      {country.populationDensity !== undefined ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Density</dt>
          <dd className="country-panel__meta-value">
            {formatPopulationDensity(country.populationDensity)}
          </dd>
        </div>
      ) : null}
      {country.gdpUsdMillions !== undefined ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">GDP</dt>
          <dd className="country-panel__meta-value">
            {formatGdpUsdMillions(country.gdpUsdMillions)}
          </dd>
        </div>
      ) : null}
      {country.climate ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Climate</dt>
          <dd className="country-panel__meta-value">
            {formatClimate(country.climate, country.avgAnnualTemperatureC)}
          </dd>
        </div>
      ) : null}
      {country.languages !== undefined && country.languages.length > 0 ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Languages</dt>
          <dd className="country-panel__meta-value">{formatLanguageList(country.languages)}</dd>
        </div>
      ) : null}
      {country.capital ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Capital</dt>
          <dd className="country-panel__meta-value">{country.capital}</dd>
        </div>
      ) : null}
      {country.currencies !== undefined && country.currencies.length > 0 ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Currency</dt>
          <dd className="country-panel__meta-value">{formatList(country.currencies)}</dd>
        </div>
      ) : null}
      {country.timezones !== undefined && country.timezones.length > 0 ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Timezone</dt>
          <dd className="country-panel__meta-value">{formatList(country.timezones)}</dd>
        </div>
      ) : null}
      {country.region ? (
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Region</dt>
          <dd className="country-panel__meta-value">{country.region}</dd>
        </div>
      ) : null}
      <div className="country-panel__meta-row">
        <dt className="country-panel__meta-label">Country code</dt>
        <dd className="country-panel__meta-value">{country.id}</dd>
      </div>
    </dl>
  );
}

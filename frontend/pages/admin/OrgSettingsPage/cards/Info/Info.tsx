import React, { useState } from "react";
import classnames from "classnames";

import Button from "components/buttons/Button";
// @ts-ignore
import InputField from "components/forms/fields/InputField";
// @ts-ignore
import OrgLogoIcon from "components/icons/OrgLogoIcon";
import validUrl from "components/forms/validators/valid_url";

import {
  IAppConfigFormProps,
  IFormField,
  IAppConfigFormErrors,
} from "../constants";

interface IOrgInfoFormData {
  orgName: string;
  orgLogoURL: string;
  orgLogoURLLightBackground: string;
  orgSupportURL: string;
}

// TODO: change base classes to these cards to follow the same pattern as the
// other components in the app.
const baseClass = "app-config-form";
const cardClass = "org-info";

const Info = ({
  appConfig,
  handleSubmit,
  isUpdatingSettings,
}: IAppConfigFormProps): JSX.Element => {
  const [formData, setFormData] = useState<IOrgInfoFormData>({
    orgName: appConfig.org_info.org_name || "",
    orgLogoURL: appConfig.org_info.org_logo_url || "",
    orgLogoURLLightBackground:
      appConfig.org_info.org_logo_url_light_background || "",
    orgSupportURL:
      appConfig.org_info.contact_url || "https://fleetdm.com/company/contact",
  });

  const {
    orgName,
    orgLogoURL,
    orgLogoURLLightBackground,
    orgSupportURL,
  } = formData;

  const [formErrors, setFormErrors] = useState<IAppConfigFormErrors>({});

  const handleInputChange = ({ name, value }: IFormField) => {
    setFormData({ ...formData, [name]: value });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: IAppConfigFormErrors = {};

    if (!orgName) {
      errors.org_name = "Organization name must be present";
    }

    if (orgLogoURL && !validUrl({ url: orgLogoURL, protocol: "http" })) {
      errors.org_logo_url = `${orgLogoURL} is not a valid URL`;
    }

    if (!orgSupportURL) {
      errors.org_support_url = `Organization support URL must be present`;
    } else if (!validUrl({ url: orgSupportURL, protocol: "http" })) {
      errors.org_support_url = `${orgSupportURL} is not a valid URL`;
    }

    setFormErrors(errors);
  };

  const onFormSubmit = (evt: React.MouseEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formDataToSubmit = {
      org_info: {
        org_logo_url: orgLogoURL,
        org_logo_url_light_background: orgLogoURLLightBackground,
        org_name: orgName,
        contact_url: orgSupportURL,
      },
    };

    handleSubmit(formDataToSubmit);
  };

  const classNames = classnames(baseClass, cardClass);

  return (
    <form className={classNames} onSubmit={onFormSubmit} autoComplete="off">
      <div className={`${baseClass}__section org-info`}>
        <h2>Organization info</h2>
        <div className={`${baseClass}__inputs`}>
          <InputField
            label="Organization name"
            onChange={handleInputChange}
            name="orgName"
            value={orgName}
            parseTarget
            onBlur={validateForm}
            error={formErrors.org_name}
          />
          <InputField
            label="Organization support URL"
            onChange={handleInputChange}
            name="orgSupportURL"
            value={orgSupportURL}
            parseTarget
            onBlur={validateForm}
            error={formErrors.org_support_url}
          />
          <div className={`${cardClass}__logo-field-set`}>
            <InputField
              label="Organization avatar URL (for dark backgrounds)"
              onChange={handleInputChange}
              name="orgLogoURL"
              value={orgLogoURL}
              parseTarget
              onBlur={validateForm}
              error={formErrors.org_logo_url}
              inputWrapperClass={`${cardClass}__logo-field`}
              tooltip="Logo is displayed in the top bar and other areas of Fleet that
                have dark backgrounds."
            />
            <div
              className={`${cardClass}__icon-preview ${cardClass}__dark-background`}
            >
              <OrgLogoIcon
                className={`${cardClass}__icon-img`}
                src={orgLogoURL}
              />
            </div>
          </div>
          <div className={`${cardClass}__logo-field-set`}>
            <InputField
              label="Organization avatar URL (for light backgrounds)"
              onChange={handleInputChange}
              name="orgLogoURLLightBackground"
              value={orgLogoURLLightBackground}
              parseTarget
              onBlur={validateForm}
              error={formErrors.org_logo_url_light_background}
              inputWrapperClass={`${cardClass}__logo-field`}
              tooltip="Logo is displayed in Fleet on top of light backgrounds.
"
            />
            <div
              className={`${cardClass}__icon-preview ${cardClass}__light-background`}
            >
              <OrgLogoIcon
                className={`${cardClass}__icon-img`}
                src={orgLogoURLLightBackground}
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        variant="brand"
        disabled={Object.keys(formErrors).length > 0}
        className="save-loading"
        isLoading={isUpdatingSettings}
      >
        Save
      </Button>
    </form>
  );
};

export default Info;

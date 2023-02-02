import { Trans } from "react-i18next";
import { Image } from "remix-image";
import { ReactElement } from "react";
import { Alert } from "@trussworks/react-uswds";
import TransLinks from "./TransLinks";

type Props = {
  children: ReactElement;
  demoMode?: string;
  missingData?: string;
};

const Layout = ({ children, demoMode, missingData }: Props): ReactElement => {
  return (
    <div className="container">
      {demoMode === "true" ? (
        <Alert type="warning" headingLevel="h6" slim={true} role="status">
          <TransLinks
            i18nTextKey={"demoAlertBanner.text"}
            i18nLinkKey={"demoAlertBanner.links"}
          />
        </Alert>
      ) : (
        ""
      )}
      <header className="header usa-header usa-header--basic" role="banner">
        <div className="usa-navbar">
          <div className="grid-row">
            <div className="desktop:grid-col-8">
              <div className="usa-logo margin-left-2">
                <em className="usa-logo__text">
                  <Trans i18nKey="Layout.header" />
                </em>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="main">
        <div className="grid-row">
          <div className="desktop:grid-col-8 padding-2 padding-bottom-8">
            {missingData === "true" ? (
              <Alert
                type="error"
                headingLevel="h4"
                className="margin-bottom-3"
                role="alert"
              >
                <Trans i18nKey={"routingError"} />
              </Alert>
            ) : (
              ""
            )}
            {children}
          </div>
        </div>
      </main>
      <footer className="footer usa-footer usa-footer--slim">
        <div className="usa-footer__primary-section">
          <div className="grid-row">
            <div className="desktop:grid-col-8 padding-2">
              <div className="logos">
                <Image
                  src="/img/wic-logo.svg"
                  alt="WIC logo"
                  width={64.52}
                  height={32}
                />
                <Image
                  src="/img/montana-logo.svg"
                  alt="Montana DPHHS logo"
                  width={46.22}
                  height={32}
                />
              </div>
              <div className="font-body-3xs">
                <p>
                  <TransLinks
                    i18nTextKey="Layout.footer1.text"
                    i18nLinkKey="Layout.footer1.links"
                  />
                </p>
                <p>
                  <TransLinks
                    i18nTextKey="Layout.footer2.text"
                    i18nLinkKey="Layout.footer2.links"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

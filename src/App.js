import React from "react";
import SermonEditor from "Pages/SermonsView/SermonEditor";
import GlobalStyles from "Containers/GlobalStyles";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect
} from "react-router-dom";
import HomePage from "Pages/HomePage";
import {
  BreakpointProvider,
  setDefaultBreakpoints,
  useCurrentBreakpointName
} from "react-socks";
import QuickSearch from "Pages/QuickSearch";
import classNames from "Helpers/classNames";

setDefaultBreakpoints([
  { xsmall: 0 }, // all mobile devices
  { small: 350 }, // mobile devices
  { medium: 720 }, // ipad, ipad pro, ipad mini, etc
  { large: 1200 }, // laptops
  { xlarge: 1600 } // large monitors
]);

const appName = "verse-finder";

const RedirectPage = () => <Redirect to={{ pathname: `/${appName}` }} />;

const Routes = () => {
  const screenSize = useCurrentBreakpointName();
  const isMobileView = screenSize === "small" || screenSize === "xsmall";
  const className = classNames("app", `app-${screenSize}`, {
    "app-mobile": isMobileView
  });

  return (
    <GlobalStyles className={className}>
      <Switch>
        <Route path="/" exact component={RedirectPage} />
        <Route path={`/${appName}`} exact component={HomePage} />
        <Route
          path={`/${appName}/sermon-editor`}
          exact
          component={SermonEditor}
        />
        <Route
          path={`/${appName}/quick-search`}
          exact
          component={QuickSearch}
        />
      </Switch>
    </GlobalStyles>
  );
};
function App() {
  return (
    <Router>
      <BreakpointProvider>
        <Routes />
      </BreakpointProvider>
    </Router>
  );
}

export default App;

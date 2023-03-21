import * as React from "react";

const RefreshContext = React.createContext({ refresh: false || true, setRefresh: (refresh: false | true) => { } });

export { RefreshContext }; 

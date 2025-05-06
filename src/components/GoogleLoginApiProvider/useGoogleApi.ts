import { useContext } from "react";
import { GoogleLoginApiContext } from "./GoogleLoginApiProvider";

function useGoogleApi() {
  const context = useContext(GoogleLoginApiContext);
  return context;
}

export default useGoogleApi;

import { gapi, loadAuth2, loadGapiInsideDOM } from "gapi-script";
import { createContext, useEffect, useRef, useState } from "react";

interface UserData {
  name: string;
  email: string;
  image: string;
}

type GoogleLoginApiContextType = {
  auth2: gapi.auth2.GoogleAuthBase | null;
  authLoaded: boolean;
  isSignedIn: boolean;
  currentUser: UserData | null;
  signIn?: () => Promise<void>;
  signOut?: () => void;
};
type GoogleLoginApiProviderProps = { children: React.ReactNode };

export const GoogleLoginApiContext = createContext<GoogleLoginApiContextType>({
  auth2: null,
  currentUser: null,
  isSignedIn: false,
  authLoaded: false,
});

function GoogleLoginApiProvider({ children }: GoogleLoginApiProviderProps) {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [auth, setAuth] = useState<gapi.auth2.GoogleAuthBase | null>(null);
  const [profile, setProfile] = useState<UserData | null>(null);
  //
  const initClient = async () => {
    // gapi.client
    //   .init({
    //     apiKey: process.env.REACT_APP_API_KEY,
    //     clientId: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
    //     discoveryDocs: [
    //       "https://sheets.googleapis.com/$discovery/rest?version=v4",
    //     ],
    //     scope: "https://www.googleapis.com/auth/spreadsheets",
    //   })
    //   .then(() => {
    //     const authInstance = gapi.auth2.getAuthInstance();
    //     setIsSignedIn(authInstance.isSignedIn.get());

    //     authInstance.isSignedIn.listen(setIsSignedIn);
    //     setAuthLoaded(true);
    //   })
    //   .catch((error: any) => {
    //     console.error("Error initializing Google API client:", error);
    //   });

    const gapi = await loadGapiInsideDOM();
    const auth2 = await loadAuth2(
      gapi,
      process.env.REACT_APP_GOOGLE_PRIVATE_KEY as string,
      "https://www.googleapis.com/auth/spreadsheets"
    );
    console.log("auth2:", auth2);

    setAuth(auth2);

    // const authInstance = auth2.getAuthInstance();
    setIsSignedIn(auth2.isSignedIn.get());

    if (auth2.isSignedIn.get()) {
      const user = auth2.currentUser.get();
      const currentUser = user.getBasicProfile();
      setProfile({
        name: currentUser.getName(),
        email: currentUser.getEmail(),
        image: currentUser.getImageUrl(),
      });
    }

    setAuthLoaded(true);
  };

  const handleSignIn = async () => {
    if (auth) {
      await auth.signIn();
    }
  };

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
      setIsSignedIn(auth.isSignedIn.get());
    }
  };

  useEffect(() => {
    // gapi.load("client:auth2", initClient);
    initClient();
  }, []);

  return (
    <GoogleLoginApiContext.Provider
      value={{
        auth2: auth,
        authLoaded: authLoaded,
        isSignedIn: isSignedIn,
        signIn: handleSignIn,
        signOut: handleSignOut,
        currentUser: profile,
      }}
    >
      {children}
    </GoogleLoginApiContext.Provider>
  );
}

export default GoogleLoginApiProvider;

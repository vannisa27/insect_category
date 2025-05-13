import { gapi, loadAuth2, loadGapiInsideDOM } from 'gapi-script';
import { createContext, useEffect, useRef, useState } from 'react';

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
    const getProfile = (auth2: gapi.auth2.GoogleAuthBase) => {
        if (auth2.isSignedIn.get()) {
            const user = auth2.currentUser.get();
            const currentUser = user.getBasicProfile();
            setProfile((prev) => ({
                ...prev,
                name: currentUser.getName(),
                email: currentUser.getEmail(),
                image: currentUser.getImageUrl(),
            }));
        }
    };
    const initClient = async () => {
        const gapi = await loadGapiInsideDOM();
        const auth2 = await loadAuth2(
            gapi,
            process.env.REACT_APP_GOOGLE_PRIVATE_KEY as string,
            'https://www.googleapis.com/auth/spreadsheets'
        );

        setAuth(auth2);

        // const authInstance = auth2.getAuthInstance();
        setIsSignedIn(auth2.isSignedIn.get());

        getProfile(auth2);

        setAuthLoaded(true);
    };

    const handleSignIn = async () => {
        if (auth) {
            await auth.signIn();
            getProfile(auth);
        }
    };

    const handleSignOut = () => {
        if (auth) {
            auth.signOut();
            setIsSignedIn(auth.isSignedIn.get());
            setProfile(null);
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

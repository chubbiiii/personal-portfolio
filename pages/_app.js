import '../styles/globals.css'

import { HeroUIProvider } from "@heroui/react";
import Router, { useRouter } from "next/router";
import AppContext from "../libs/contexts/AppContext";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const router = useRouter();

    return (
        <AppContext.Provider>
            <SessionProvider session={session}>
                <HeroUIProvider >
                    <Component {...pageProps} />
                </HeroUIProvider>
            </SessionProvider>
        </AppContext.Provider>
    )
}

export default MyApp;
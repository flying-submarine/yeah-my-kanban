import { Landing, LandingSample } from "../components/Landing";
import { sampleConfig,sampleConfigGov} from "../config/sample";
import { getRandomArr } from "../helpers/getRandomArr";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { globalConfig } from "../config/global";
import { RouterComponentProps } from "../config/router";
import { setTextAreaHeight } from "../helpers/setTextAreaHeight";
import { getCurrentLocale } from "../helpers/getCurrentLocale";
import i18n, { i18nConfig } from "../config/i18n";
import { useTranslation } from "react-i18next";

const Home = (props: RouterComponentProps) => {
    const { t } = useTranslation();
    const { site: siteTitle } = globalConfig.title;
    const location = useLocation();
    const landingTitle = t("views.Home.landing_title");

    const textAreaRef =
        (props.refs?.textAreaRef.current as HTMLTextAreaElement) ?? null;
    const [randomSamples, setRandomSamples] = useState<LandingSample[]>([]);

    const setRandomSamplesToState = async (isGov:Boolean) => {
        const { resources, fallback } = i18nConfig;
        const currentLocale = (await getCurrentLocale(
            i18n
        )) as keyof typeof resources;
        if(isGov){
            let data = sampleConfigGov[fallback as keyof typeof resources];
            if (currentLocale in sampleConfigGov) {
                !!sampleConfigGov[currentLocale].length &&
                    (data = sampleConfigGov[currentLocale]);
            } 
            setRandomSamples(getRandomArr(data, 6));
        }else{
            let data = sampleConfig[fallback as keyof typeof resources];
            if (currentLocale in sampleConfig) {
                !!sampleConfig[currentLocale].length &&
                    (data = sampleConfig[currentLocale]);
            } 
            setRandomSamples(getRandomArr(data, 6));
        }
    };

    const handleSelectSample = async (message: string) => {
        textAreaRef.focus();
        textAreaRef.value = message;
        setTextAreaHeight(textAreaRef);
    };

    useEffect(() => {
        document.title = siteTitle;
        if (location.pathname.endsWith("/govFineQuery")) {
            setRandomSamplesToState(true);
        } else {
            setRandomSamplesToState(false);
        }
    }, [t, siteTitle,location]);

    return (
        <Landing
            title={landingTitle}
            samples={randomSamples}
            onSelectSample={handleSelectSample}
        />
    );
};

export default Home;

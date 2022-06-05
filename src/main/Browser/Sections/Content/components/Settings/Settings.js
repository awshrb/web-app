import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Navigate, Route, Routes} from "react-router-dom";
import * as RoutesName from "../../../../../../routes/routes";
import Profile from "./components/Profile/Profile";
import Security from "./components/Security/Security";
import Personalization from "./components/Personalization/Personalization";
import Authentication from "./components/Authentication/Authentication";
import {setKYCStatusInitiate} from "../../../../../../store/actions/auth";

const Settings = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setKYCStatusInitiate())
    }, [])
    return (
        <div className="px-1 py-1">
            <Routes>
                <Route path={RoutesName.Settings} element={<Navigate to={{pathname: `${RoutesName.Profile}`}} replace />}/>
                <Route path={RoutesName.ProfileRelative} element={<Profile/>}/>
                <Route path={RoutesName.SecurityRelative} element={<Security/>}/>
                <Route path={RoutesName.PersonalizationRelative} element={<Personalization/>}/>
                <Route path={RoutesName.AuthenticationRelative} element={<Authentication/>}/>
            </Routes>
        </div>
    );
}

export default Settings;

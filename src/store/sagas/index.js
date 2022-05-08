import {takeEvery} from "redux-saga/effects";
import * as actionTypes from "../actions/actionTypes";

import {setThemeSaga, loadConfig, setActivePair, setIPGLock} from "./global";

import {getUserAccount, getUserKYCStatus, logout, setUserTokens} from "./auth";

export function* watchGlobal() {
  yield takeEvery(actionTypes.LOGOUT_INITIATE, logout);
  yield takeEvery(actionTypes.LOAD_CONFIG, loadConfig);
  yield takeEvery(actionTypes.SET_THEME_INITIATE, setThemeSaga);
  yield takeEvery(actionTypes.SET_ACTIVE_PAIR_INITIATE, setActivePair);
  yield takeEvery(actionTypes.SET_USER_TOKENS_INITIATE, setUserTokens);
  yield takeEvery(actionTypes.SET_IPG_INITIATE, setIPGLock);
  yield takeEvery(actionTypes.SET_KYC_STATUS_INITIATE, getUserKYCStatus);
  yield takeEvery(actionTypes.SET_USER_ACCOUNT_INFO_INITIATE, getUserAccount);

}

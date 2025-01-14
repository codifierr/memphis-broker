// Copyright 2021-2022 The Memphis Authors
// Licensed under the MIT License (the "License");
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// This license limiting reselling the software itself "AS IS".

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import './style.scss';

import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../../components/button';
import Switcher from '../../../../components/switcher';
import docsLogo from '../../../../assets/images/docsLogo.svg';
import GithubLogo from '../../../../assets/images/githubLogo.svg';
import discordLogo from '../../../../assets/images/discordLogo.svg';
import { Link, useHistory } from 'react-router-dom';
import { GetStartedStoreContext } from '..';
import pathDomains from '../../../../router';
import { ApiEndpoints } from '../../../../const/apiEndpoints';
import { httpRequest } from '../../../../services/http';
import { LOCAL_STORAGE_ALLOW_ANALYTICS, LOCAL_STORAGE_SKIP_GET_STARTED } from '../../../../const/localStorageConsts';

const Finish = ({ createStationFormRef }) => {
    const history = useHistory();
    const [getStartedState, getStartedDispatch] = useContext(GetStartedStoreContext);
    const [allowAnalytics, setAllowAnalytics] = useState(false);

    useEffect(() => {
        createStationFormRef.current = onNext;
    }, []);

    const onNext = () => {
        doneNextSteps();
        window.location.reload(false);
    };

    const onFinish = (e) => {
        e.preventDefault();
        getStartedDispatch({ type: 'INITIAL_STATE', payload: {} });
        doneNextSteps();
        history.push(`${pathDomains.stations}/${getStartedState.stationName}`);
        localStorage.setItem(LOCAL_STORAGE_SKIP_GET_STARTED, true);
    };

    const doneNextSteps = async () => {
        try {
            await httpRequest('POST', ApiEndpoints.DONE_NEXT_STEPS);
        } catch (error) {}
    };

    const sendAnalytics = async (analyticsFlag) => {
        try {
            await httpRequest('PUT', `${ApiEndpoints.EDIT_ANALYTICS}`, { send_analytics: analyticsFlag });
            setAllowAnalytics(analyticsFlag);
            localStorage.setItem(LOCAL_STORAGE_ALLOW_ANALYTICS, analyticsFlag);
        } catch (err) {
            return;
        }
    };

    return (
        <div className="finish-container" id="e2e-getstarted-step5">
            <div className="btn-container">
                <div className="allow-analytics">
                    <Switcher onChange={() => sendAnalytics(!allowAnalytics)} checked={allowAnalytics} checkedChildren="on" unCheckedChildren="off" />
                    <p>I allow Memphis team to reach out and ask for feedback.</p>
                </div>
                <div id="e2e-getstarted-finish-btn">
                    <Button
                        width="192px"
                        height="42px"
                        placeholder="Go to dashboard"
                        radiusType="circle"
                        backgroundColorType="purple"
                        fontSize="16px"
                        fontWeight="bold"
                        colorType="white"
                        borderRadius="31px"
                        boxShadowStyle="none"
                        onClick={(e) => {
                            onFinish(e);
                        }}
                    />
                </div>
            </div>
            <div className="container-icons-finish">
                <p className="link-finish-header">Link to our channels</p>
                <Link
                    className="icon-image"
                    to={{ pathname: 'https://app.gitbook.com/o/-MSyW3CRw3knM-KGk6G6/s/t7NJvDh5VSGZnmEsyR9h/getting-started/1-installation' }}
                    target="_blank"
                >
                    <img src={docsLogo} width="25px" height="25px" alt="slack-icon"></img>
                </Link>
                <Link className="icon-image" to={{ pathname: 'https://github.com/memphisdev' }} target="_blank">
                    <img src={GithubLogo} width="25px" height="25px" alt="github-icon"></img>
                </Link>
                <Link className="icon-image" to={{ pathname: 'https://discord.com/invite/WZpysvAeTf' }} target="_blank">
                    <img src={discordLogo} width="25px" height="25px" alt="discord_icon"></img>
                </Link>
            </div>
        </div>
    );
};

export default Finish;

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

import React, { useEffect, useState } from 'react';

import SelectComponent from '../../../../components/select';
import { CODE_EXAMPLE } from '../../../../const/SDKExample';
import { LOCAL_STORAGE_ENV, LOCAL_STORAGE_NAMESPACE } from '../../../../const/localStorageConsts';
import CustomTabs from '../../../../components/Tabs';
import Copy from '../../../../components/copy';
import Editor from '@monaco-editor/react';

const SdkExample = ({ consumer, showTabs = true }) => {
    const [langSelected, setLangSelected] = useState('Go');
    const selectLngOption = ['Go', 'Node.js', 'Typescript', 'Python'];
    const [codeExample, setCodeExample] = useState({
        import: '',
        connect: '',
        producer: '',
        consumer: ''
    });
    const tabs = ['Producer', 'Consumer'];
    const [tabValue, setTabValue] = useState(consumer ? 'Consumer' : 'Producer');

    const url = window.location.href;
    const stationName = url.split('stations/')[1];

    const changeDynamicCode = (lang) => {
        let codeEx = {};
        codeEx.producer = CODE_EXAMPLE[lang].producer;
        codeEx.consumer = CODE_EXAMPLE[lang].consumer;
        let host = process.env.REACT_APP_SANDBOX_ENV
            ? 'broker.sandbox.memphis.dev'
            : localStorage.getItem(LOCAL_STORAGE_ENV) === 'docker'
            ? 'localhost'
            : 'memphis-cluster.' + localStorage.getItem(LOCAL_STORAGE_NAMESPACE) + '.svc.cluster.local';
        codeEx.producer = codeEx.producer.replaceAll('<memphis-host>', host);
        codeEx.consumer = codeEx.consumer.replaceAll('<memphis-host>', host);
        codeEx.producer = codeEx.producer.replaceAll('<station_name>', stationName);
        codeEx.consumer = codeEx.consumer.replaceAll('<station_name>', stationName);
        setCodeExample(codeEx);
    };

    useEffect(() => {
        changeDynamicCode(langSelected);
    }, []);

    const handleSelectLang = (e) => {
        setLangSelected(e);
        changeDynamicCode(e);
    };

    return (
        <div className="sdk-details-container">
            <div className="select-lan">
                <p>Language</p>
                <SelectComponent
                    value={langSelected}
                    colorType="navy"
                    backgroundColorType="none"
                    borderColorType="gray"
                    radiusType="semi-round"
                    width="220px"
                    height="50px"
                    options={selectLngOption}
                    onChange={(e) => handleSelectLang(e)}
                    popupClassName="select-options"
                />
            </div>
            <div className="installation">
                <p>Installation</p>
                <div className="install-copy">
                    <p>{CODE_EXAMPLE[langSelected].installation}</p>
                    <Copy data={CODE_EXAMPLE[langSelected].installation} />
                </div>
            </div>
            <div className="tabs">
                {showTabs && <CustomTabs value={tabValue} onChange={(tabValue) => setTabValue(tabValue)} tabs={tabs}></CustomTabs>}
                {tabValue === 'Producer' && (
                    <div className="code-example">
                        <div className="code-content">
                            <Editor
                                options={{
                                    minimap: { enabled: false },
                                    scrollbar: { verticalScrollbarSize: 0 },
                                    scrollBeyondLastLine: false,
                                    roundedSelection: false,
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    readOnly: true,
                                    fontSize: '14px'
                                }}
                                language={CODE_EXAMPLE[langSelected].langCode}
                                height="calc(100% - 10px)"
                                width="calc(100% - 25px)"
                                value={codeExample.producer}
                            />
                            <Copy data={codeExample.producer} />
                        </div>
                    </div>
                )}

                {tabValue === 'Consumer' && (
                    <div className="code-example">
                        <div className="code-content">
                            <Editor
                                options={{
                                    minimap: { enabled: false },
                                    scrollbar: { verticalScrollbarSize: 0 },
                                    scrollBeyondLastLine: false,
                                    roundedSelection: false,
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    readOnly: true,
                                    fontSize: '14px'
                                }}
                                language={CODE_EXAMPLE[langSelected].langCode}
                                height="calc(100% - 10px)"
                                width="calc(100% - 25px)"
                                value={codeExample.consumer}
                            />
                            <Copy data={codeExample.consumer} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SdkExample;

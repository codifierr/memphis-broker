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

import React, { createContext, useEffect, useReducer, useRef } from 'react';

import SideStep from './sideStep';
import CreateAppUser from './createAppUser';
import ConsumeData from './consumeData';
import Reducer from './hooks/reducer';
import ProduceData from './produceData';
import CreateStation from './createStation';

import GetStartedItem from '../../../components/getStartedItem';
import GetStartedIcon from '../../../assets/images/getStartedIcon.svg';
import AppUserIcon from '../../../assets/images/usersIconActive.svg';
import ProduceDataImg from '../../../assets/images/emptyStation.svg';
import ConsumeDataImg from '../../../assets/images/fullStation.svg';
import finishStep from '../../../assets/images/readyToRoll.svg';
import Finish from './finish';
import { httpRequest } from '../../../services/http';
import { ApiEndpoints } from '../../../const/apiEndpoints';
import Button from '../../../components/button';
import { LOCAL_STORAGE_SKIP_GET_STARTED } from '../../../const/localStorageConsts';
import pathDomains from '../../../router';
import { useHistory } from 'react-router-dom';
import CreateStationForm from '../../../components/createStationForm';

const steps = [{ stepName: 'Create Station' }, { stepName: 'Create App user' }, { stepName: 'Produce data' }, { stepName: 'Consume data' }, { stepName: 'Finish' }];

const finishStyle = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    header: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '24px',
        lineHeight: '29px',
        color: '#1D1D1D'
    },
    description: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '120%',
        textAlign: 'center',
        color: '#B4B4B4'
    },
    image: {
        width: '150px',
        height: '150px'
    }
};

const initialState = {
    currentStep: 1,
    completedSteps: 0,
    formFieldsCreateStation: {
        name: '',
        retention_type: 'message_age_sec',
        retention_value: 604800,
        storage_type: 'file',
        replicas: 1,
        days: 7,
        hours: 0,
        minutes: 0,
        seconds: 0,
        retentionSizeValue: '1000',
        retentionMessagesValue: '10'
    },
    nextDisable: false,
    isLoading: false,
    isHiddenButton: false,
    actualPods: null
};

const GetStarted = ({ username, dataSentence }) => {
    const [getStartedState, getStartedDispatch] = useReducer(Reducer, initialState);
    const history = useHistory();
    const createStationFormRef = useRef(null);

    const getStepsDescription = (stepNumber) => {
        switch (stepNumber) {
            case 1:
                return 'A station is a distributed unit that stores the produced data';
            case 2:
                return 'Each producer/consumer has to have a username and a connection-token';
            case 3:
                return 'A producer is the source application/service that pushes data or messages to the broker or station';
            case 4:
                return 'A consumer is the application/service that consume data or messages from the broker or station';
            case 5:
                return 'Congratulations - You’ve created your first broker app';
        }
    };

    const SideStepList = () => {
        return (
            <div className="sidebar-component">
                {steps.map((value, index) => {
                    return (
                        <SideStep
                            key={index}
                            currentStep={getStartedState?.currentStep}
                            stepNumber={index + 1}
                            stepName={value.stepName}
                            stepsDescription={getStepsDescription(index + 1)}
                            completedSteps={getStartedState?.completedSteps}
                            onSideBarClick={(e) => getStartedDispatch({ type: 'SET_CURRENT_STEP', payload: e })}
                        />
                    );
                })}
            </div>
        );
    };

    const onNext = () => {
        createStationFormRef.current();
    };

    const onBack = () => {
        getStartedDispatch({ type: 'SET_CURRENT_STEP', payload: getStartedState?.currentStep - 1 });
    };

    const getOverviewData = async () => {
        try {
            const data = await httpRequest('GET', ApiEndpoints.GET_MAIN_OVERVIEW_DATA);
            let indexOfBrokerComponent = data?.system_components.findIndex((item) => item.component.includes('broker'));
            indexOfBrokerComponent = indexOfBrokerComponent !== -1 ? indexOfBrokerComponent : 1;
            getStartedDispatch({ type: 'SET_ACTUAL_PODS', payload: data?.system_components[indexOfBrokerComponent]?.actual_pods });
        } catch (error) {}
    };

    useEffect(() => {
        getOverviewData();
    }, []);

    useEffect(() => {
        if (getStartedState?.currentStep !== 1) {
            getStartedDispatch({ type: 'SET_BACK_DISABLE', payload: false });
        } else {
            getStartedDispatch({ type: 'SET_BACK_DISABLE', payload: true });
        }
        return;
    }, [getStartedState?.currentStep]);

    return (
        <GetStartedStoreContext.Provider value={[getStartedState, getStartedDispatch]}>
            <div className="getstarted-container">
                <div className="sidebar-section">
                    <div className="welcome-section">
                        <p className="getstarted-welcome">Welcome, {username}</p>
                        <p className="getstarted-description">{dataSentence}</p>
                    </div>
                    <div className="getstarted-message-container">
                        <p className="getstarted-message">Let’s get you started</p>
                        <p className="getstarted-message-description">Your streaming journey with Memphis starts here</p>
                    </div>
                    <SideStepList />
                    <div className="skip-btn">
                        <Button
                            width="120px"
                            height="36px"
                            fontFamily="InterSemiBold"
                            placeholder="Skip for now"
                            radiusType="circle"
                            backgroundColorType="none"
                            border="gray"
                            fontSize="14px"
                            boxShadow="gray"
                            onClick={() => {
                                localStorage.setItem(LOCAL_STORAGE_SKIP_GET_STARTED, true);
                                history.push(pathDomains.overview);
                            }}
                        />
                    </div>
                </div>
                <div className="steps-section">
                    {getStartedState?.currentStep === 1 && (
                        <GetStartedItem
                            headerImage={GetStartedIcon}
                            headerTitle="Create Station"
                            headerDescription={getStepsDescription(getStartedState?.currentStep)}
                            onNext={onNext}
                            onBack={onBack}
                        >
                            <CreateStation createStationFormRef={createStationFormRef} />
                        </GetStartedItem>
                    )}
                    {getStartedState?.currentStep === 2 && (
                        <GetStartedItem
                            headerImage={AppUserIcon}
                            headerTitle="Create user"
                            headerDescription={getStepsDescription(getStartedState?.currentStep)}
                            onNext={onNext}
                            onBack={onBack}
                        >
                            <CreateAppUser createStationFormRef={createStationFormRef} />
                        </GetStartedItem>
                    )}
                    {getStartedState?.currentStep === 3 && (
                        <GetStartedItem
                            headerImage={ProduceDataImg}
                            headerTitle="Produce data"
                            headerDescription={getStepsDescription(getStartedState?.currentStep)}
                            onNext={onNext}
                            onBack={onBack}
                        >
                            <ProduceData createStationFormRef={createStationFormRef} />
                        </GetStartedItem>
                    )}
                    {getStartedState?.currentStep === 4 && (
                        <GetStartedItem
                            headerImage={ConsumeDataImg}
                            headerTitle="Consume data"
                            headerDescription={getStepsDescription(getStartedState?.currentStep)}
                            onNext={onNext}
                            onBack={onBack}
                        >
                            <ConsumeData createStationFormRef={createStationFormRef} />
                        </GetStartedItem>
                    )}
                    {getStartedState?.currentStep === 5 && (
                        <GetStartedItem
                            headerImage={finishStep}
                            headerTitle="You are ready to roll"
                            headerDescription={getStepsDescription(getStartedState?.currentStep)}
                            onNext={onNext}
                            onBack={onBack}
                            style={finishStyle}
                            finish
                        >
                            <Finish createStationFormRef={createStationFormRef} />
                        </GetStartedItem>
                    )}
                </div>
            </div>
        </GetStartedStoreContext.Provider>
    );
};
export const GetStartedStoreContext = createContext({});
export default GetStarted;

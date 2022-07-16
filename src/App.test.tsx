import React from 'react';
import { mount, shallow } from 'enzyme';
import App from './App';
import { Providers } from './components/Providers/Providers';
import firebase from './config';

let wrapper: JSX.Element;

describe('app renders without crashing', function () {
    beforeEach(() => {
        wrapper = (
            <Providers>
                <App />
            </Providers>
        );
    });
    it('renders without crashing', () => {
        shallow(wrapper);
    });
});

describe('test app before login', function () {
    let app: any;
    beforeAll(async () => {
        wrapper = (
            <Providers>
                <App />
            </Providers>
        );
        app = mount(wrapper);
    });

    it('Get started button navigates to log in page', async () => {
        app = mount(wrapper);

        const button = app.find('button[aria-label="get started"]');
        button.simulate('click');
        const text = 'Sign in and get started';
        expect(app.contains(text)).toEqual(true);
    });

    it('Sign up button navigates to register page', async () => {
        app = mount(wrapper);

        const button = app.find('button[aria-label="sign up"]');
        button.simulate('click');
        const text = 'Create a new account';
        expect(app.contains(text)).toEqual(true);
    });

    afterAll(() => {
        app.unmount();
    });
});

describe('test app after login', function () {
    let user: any;

    const firebaseAppAuth = firebase.auth();
    let app: any;
    beforeAll(async () => {
        user = await firebaseAppAuth.signInWithEmailAndPassword(
            'testing@test.com',
            '123456'
        );
        wrapper = (
            <Providers>
                <App user={user} />
            </Providers>
        );
        app = mount(wrapper);
    });

    it('Get started button navigates to log in page', async () => {
        app = mount(wrapper);
        // expect(app.find(App).prop('user')).toEqual(user);
        // console.log(app.find(App).prop('user'));
        // expect(.exists()).toBeTruthy();
    });

    afterAll(() => {
        app.unmount();
    });
});

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { AppComponent } from './app';


const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>
        ,
        document.getElementById('root')
    );
}

render(AppComponent);

if (module.hot) {
    module.hot.accept('./app', () => { // ./app 必須與 app.jsx 同名
        render(AppComponent);
    })
};
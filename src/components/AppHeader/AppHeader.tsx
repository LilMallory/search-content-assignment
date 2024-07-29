import './AppHeader.css';
import SingaporeLionSvg from '../../assets/singapore-lion.svg';
import { ReactSVG } from 'react-svg';

const AppHeader = (() => {
    return(
        <header className="app-header">
            <div className="header-wrapper">
                <ReactSVG src={SingaporeLionSvg}></ReactSVG>
                <div className="header-text">An Official Website of the <b>Singapore Government</b></div>
            </div>
        </header>
    )
});

export default AppHeader;
import {Application} from 'backbone.marionette'
import {history} from 'backbone'

// CSS
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.standalone.css'
import '../assets/css/application.scss'

// Modules & overrides
import 'bootstrap-datepicker'
import './overrides/marionette.stickit'

// Controller
import playlistsController from './modules/playlists/controller'
import breadcrumbController from './modules/breadcrumb/controller'
import overviewController from './modules/overview/controller'
import videosController from './modules/videos/controller'

// Router
import './modules/playlists/router'
import './modules/breadcrumb/router'
import './modules/videos/router'
import './modules/overview/router'
import './modules/navigation/router'

// Views
import NavigationView from './modules/navigation/views/Navigation'

class App extends Application {

    get regions() {
        return {
            main: '#region-main',
            breadcrumb: '#region-breadcrumb',
            navigation: '#region-navigation'
        }
    }

    initialize() {
        this.listenTo(this, 'start', this._onStart);
    }

    navigate(route, options = { trigger: true }) {
        route = route || history.getFragment() || 'overview';

        history.navigate(route, options);
    }

    _onStart() {
        breadcrumbController.init(this.getRegion('breadcrumb'));
        playlistsController.init(this.getRegion('main'));
        overviewController.init(this.getRegion('main'));
        videosController.init(this.getRegion('main'));

        this._initNavigation();

        history.start();

        this.navigate();
    }
    
    _initNavigation() {
        this.getRegion('navigation').show(new NavigationView());
    }
}

const app = new App();

export default app;
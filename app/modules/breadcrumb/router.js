import _ from 'underscore'
import * as Marionette from 'backbone.marionette';
import {history} from 'backbone'
import controller from './controller';
import playlistsRouter from '../playlists/router'
import overviewRouter from '../overview/router'
import vidoesRouter from '../videos/router'

class BreadcrumbRouter extends Marionette.Object {
    initialize() {
        _.bindAll(this, '_onRoute');

        playlistsRouter.on('route', this._onRoute);
        overviewRouter.on('route', this._onRoute);
        vidoesRouter.on('route', this._onRoute);
    }

    /** @type {BreadcrumbController} */
    get controller() {
        return controller
    }

    _onRoute() {
        const fragment = history.getFragment();

        if (fragment.indexOf('playlists/playlist/') === 0) {
            this.controller.initPlaylist(fragment.split('/')[2]);
        } else if (fragment === 'playlists') {
            this.controller.initPlaylists();
        } else if (fragment === 'overview') {
            this.controller.initOverview();
        } else if (fragment === 'videos') {
            this.controller.initVideos();
        }
    }
}

const breadcrumbRouter = new BreadcrumbRouter();

export default breadcrumbRouter;

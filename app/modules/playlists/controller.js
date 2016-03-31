import $ from 'jquery'
import * as Marionette from 'backbone.marionette';
import PlaylistsCollection from './models/Playlists';
import PlaylistItemsCollection from './models/PlaylistItems';
import PlaylistsView from './views/Playlists';
import PlaylistItemsView from './views/PlistlistItems';
import Config from '../../Config';
import app from '../../application';

class PlaylistsController extends Marionette.Object {

    init(region) {
        this._region = region;
    }

    initPlaylists() {
        this._currentPlaylistId = null;

        const collection = new PlaylistsCollection();
        const view       = new PlaylistsView();

        this._region.show(view);

        view.loading = true;

        this._fetchPlaylists(collection, Config.channelRBTV, Config.channelLP)
            .done(() => {
                view.renderCollection(true, collection);
            });
    }

    initPlaylist(playlistId, videoId = null) {
        if (playlistId === this._currentPlaylistId) {
            return this._initVideo(videoId);
        }

        this._playlistItemsCollection = new PlaylistItemsCollection();

        this._playlistItemsCollection.playlistId = playlistId;

        this._currentPlaylistId = playlistId;

        this._playlistItemsCollection
            .fetch()
            .then(this._onPlaylistItemsLoaded.bind(this))
            .then(this._initVideo.bind(this, videoId));
    }

    _initVideo(videoId) {
        if (!videoId) {
            const playlistItem = this._playlistItemsCollection.first();

            if (playlistItem) {
                videoId = playlistItem.get('videoId');

                app.navigate(`playlists/playlist/${this._currentPlaylistId}/video/${videoId}`);
            }
        }

        if (_.isNull(videoId) || !this._playlistItemsView) return;

        this._playlistItemsView.videoId = videoId;
    }

    /**
     *
     * @param {PlaylistsCollection} collection
     * @param {Array} channels
     * @returns {Promise}
     * @private
     */
    _fetchPlaylists(collection, ...channels) {
        let i          = 0;
        const Deferred = $.Deferred();

        const _fetchPlaylist = (channelId) => {
            if (!channelId) {
                // resolve promise
                Deferred.resolve(collection);

                return;
            }

            collection
                .setChannelId(channelId)
                .fetch()
                .done(() => {
                    i++;

                    _fetchPlaylist(channels[i]);
                });
        };

        _fetchPlaylist(channels[i]);

        return Deferred.promise();
    }

    /** @private */
    _onPlaylistItemsLoaded() {
        this._playlistItemsView = new PlaylistItemsView({ collection: this._playlistItemsCollection });

        this._region.show(this._playlistItemsView);
    }
}

export default new PlaylistsController();
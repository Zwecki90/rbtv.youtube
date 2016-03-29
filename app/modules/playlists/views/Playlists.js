import _ from 'underscore';
import $ from 'jquery';
import {CompositeView, ItemView} from 'backbone.marionette';
import {Model} from 'backbone';
import {localStorage} from '../../../utils';
import app from '../../../application';

class Playlist extends ItemView {
    get className() {
        return 'playlist col-xs-12 col-sm-3';
    }

    get template() {
        return require('../templates/playlist.ejs');
    }
}

export default class Playlists extends CompositeView {

    constructor(options) {
        _.defaults(options, {
            model: new Model({
                _search: '',
                _filterByRBTV: true,
                _filterByLP: true
            })
        });

        super(options);
    }

    events() {
        return {
            'click @ui.btnFilterRBTV': '_onToggleRBTV',
            'click @ui.btnFilterLP': '_onToggleLP',
            'click @ui.link': '_onClickLink'
        };
    }

    modelEvents() {
        return {
            'change:_search change:_filterByRBTV change:_filterByLP': _.debounce(() => {
                this._searchCollection();
            }, 700)
        }
    }

    ui() {
        return {
            link: '.js-link',
            search: '.js-search',
            btnFilterRBTV: '.js-filter-rbtv',
            btnFilterLP: '.js-filter-lp'
        }
    }

    bindings() {
        return {
            '@ui.btnFilterRBTV': {
                classes: {
                    active: '_filterByRBTV'
                }
            },

            '@ui.btnFilterLP': {
                classes: {
                    active: '_filterByLP'
                }
            },

            '@ui.search': '_search'
        };
    }

    get childView() {
        return Playlist;
    }

    get childViewContainer() {
        return '.js-playlists'
    }

    get template() {
        return require('../templates/playlists.ejs');
    }

    /**
     * @returns {{search: String, rbtv: String|null, lp: String|null}}
     */
    get channelFilter() {
        return {
            search: this.model.get('_search'),
            rbtv: this.model.get('_filterByRBTV'),
            lp: this.model.get('_filterByLP')
        }
    }

    initialize() {
        this._searchCollection(true);
    }

    onRender() {
        this.stickit();
    }

    _searchCollection(fromCache = false) {
        let filter;

        if (fromCache) {
            filter = localStorage.get('playlists.filter');

            if (filter) {
                this.model.set({
                    _search: filter.search,
                    _filterByRBTV: filter.rbtv,
                    _filterByLP: filter.lp
                });
            }
        }

        if (!filter) filter = this.channelFilter;

        this.collection.search(filter);

        // Cache
        localStorage.set('playlists.filter', filter);
    }

    _onClickLink(e) {
        const $link = $(e.currentTarget);
        let route   = $link.attr('href');

        app.navigate(route);

        e.preventDefault();
    }

    _onToggleRBTV() {
        this.model.set('_filterByRBTV', !this.model.get('_filterByRBTV'));

        this.ui.btnFilterRBTV.blur();
    }

    _onToggleLP() {
        this.model.set('_filterByLP', !this.model.get('_filterByLP'));

        this.ui.btnFilterLP.blur();
    }
}
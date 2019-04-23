/**
 * Main JS file for project.
 */

/**
 * Define globals that are added through the js.globals in
 * the config.json file, here, mostly so linting won't get triggered
 * and its a good queue of what is available:
 */
// /* global $, _ */

// Dependencies
import utils from './shared/utils.js';

// Mark page with note about development or staging
utils.environmentNoting();


// Auto enable Pym for embedding.  This will enable a Pym Child if
// the url contains ?pym=true
utils.autoEnablePym();


/**
 * Adding dependencies
 * ---------------------------------
 * Import local ES6 or CommonJS modules like this:
 * import utilsFn from './shared/utils.js';
 *
 * Or import libraries installed with npm like this:
 * import module from 'module';
 */


/**
 * Adding Svelte templates in the client
 * ---------------------------------
 * We can bring in the same Svelte templates that we use
 * to render the HTML into the client for interactivity.  The key
 * part is that we need to have similar data.
 *
 * First, import the template.  This is the main one, and will
 * include any other templates used in the project.
 *
 *   `import Content from '../templates/_index-content.svelte.html';`
 *
 * Get the data parts that are needed.  There are two ways to do this.
 * If you are using the buildData function to get data, then add make
 * sure the config for your data has a `local: "content.json"` property
 *
 *  1. For smaller datasets, just import them like other files.
 *     `import content from '../assets/data/content.json';`
 *  2. For larger data points, utilize window.fetch.
 *     `let content = await (await window.fetch('../assets/data/content.json')).json();`
 *
 * Once you have your data, use it like a Svelte component:
 *
 * const app = new Content({
 *  target: document.querySelector('.article-lcd-body-content'),
 *  hydrate: true,
 *  data: {
 *    content
 *  }
 * });
 */



// Common code to get svelte template loaded on the client.  Probably need data.
//
// import Content from '../templates/_index-content.svelte.html
//
// const app = new Content({
//   target: document.querySelector('.article-lcd-body-content'),
//   hydrate: true,
//   data: {
//   }
// });

import condemn from '../sources/condemned.json';
import stp from '../sources/stpaul.json';
import nb from '../sources/stpaul_neighborhoods.json';

$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results != null) {
        return results[1] || 0;
    } else {
        return null;
    }
}

var selected = $.urlParam('chart');

if (selected != null) {
    $(".slide").hide();
    $("#" + selected).show();
}
if (selected == "all") {
    $(".slide").show();
}

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhZG93ZmxhcmUiLCJhIjoiS3pwY1JTMCJ9.pTSXx_LFgR3XBpCNNxWPKA';

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/shadowflare/ciqzo0bu20004bknkbrhrm6wf',
center: [-93.094276, 44.943722],
zoom: 10.4,
minZoom: 10.4
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {


 map.addSource('condemned', {
   type: 'geojson',
   data: condemn
 });

     map.addLayer({
      "id": "condemned-layer",
      "type": "circle",
      "source": "condemned",
      "paint": {
        "circle-radius": 3,
        "circle-color": '#E07242',
        "circle-opacity": 0.6
      },
    }, 'place-neighbourhood');

    map.addSource('nb', {
        type: 'geojson',
        data: nb
      });
      
      map.addLayer({
        'id': 'nb-layer-2',
        'interactive': true,
        'source': 'nb',
        'layout': {},
        'type': 'fill',
          'paint': {
            'fill-color': 'rgba(88,88,88,0)'
          }
      }, 'place-town');

    map.addLayer({
        'id': 'nb-layer',
        'interactive': true,
        'source': 'nb',
        'layout': {},
        'type': 'line',
          'paint': {
            'line-color': 'rgba(88,88,88,1)',
            'line-width': 1
          }
      }, 'place-town');

    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mousemove', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['nb-layer-2']
        });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        if (!features.length) {
            popup.remove();
            return;
        }

        var feature = features[0];

        popup.setLngLat(e.lngLat)
            .setHTML(feature.properties.NAME)
            .addTo(map);
    });

});
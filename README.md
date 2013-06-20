D3Fire
======

Plugin to easily hook up a Firebase to your D3 visualizations. D3's data binding can be quite powerful, but tends to assume that you have a working copy of the data in your script somewhere. This plugin comes in handy when you want to defer your data storage to Firebase, which provides a "realtime" database and does not require you to keep your own local copy.


Install
-----

Pretty simple, just include the script tag for this plugin after you have included the Firebase and D3 script tags. Still need an example? Try this:


```html 
<script type='text/javascript' src='http://d3js.org/d3.v3.min.js'></script>
<script type='text/javascript' src='https://cdn.firebase.com/v0/firebase.js'></script>
<script type='text/javascript' src='d3fire.min.js'></script>
```

Use It
-----
The plugin creates a new D3 function that operates on a selection called `firebase()`.  Take a selection and bind a Firebase to it; you can include callback functions for when data is added/updated/deleted from the Firebase.

```javascript
d3.select('svg').firebase(
    'https://yourfirebase.firebaseIO.com', 
    {
        createFunc : function(newData) {
            // callback when data is added, maybe we want to add a text element?
            return this.append('text').text(newData.val());
	},
        updateFunc : function(changedData) {
            // data was changed, let's change the text
            this.text(newData.val());
        }
    }
);
```

D3Fire will take care of binding to the `__data__` attribute of each selector, giving you a copy of the Firebase snapshot to use in later calls.

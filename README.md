# gulp-bower
Gulpfile with connection for jQuery, bootstrap sass, fontawesome with bower.

With this setup you will work with JavaScript and SASS/CSS in _build folder. 
Everythin will be saved in a assets folder in the root.

```<link href="assets/css/all.min.css" media="all" rel="stylesheet" />```

```
<script src="assets/js/vendor.min.js"></script>
<script src="assets/js/global.min.js"></script>
...
```

### Install
```$ cd _build```

```$ npm install && bower install```
Downloads all nessesary node packages and the following bower packages:
- jquery
- jquery-ui
- fontawesome
- bootstrap-sass-official

### Settings
All settings are made in ```config.json```

### Use
```$ cd _build```

```gulp```


var	fs 			= require('fs'),
	gulp 		= require('gulp'),
	bump        = require('gulp-bump'),
	sass 		= require('gulp-sass'),
	concat 		= require('gulp-concat'),
	uglify 		= require('gulp-uglify'),
	notify 		= require("gulp-notify"),
	rename 		= require('gulp-rename'),
	concatCss 	= require('gulp-concat-css'),
	jshint 		= require('gulp-jshint'),
	sourcemaps  = require('gulp-sourcemaps'),
	cleanCss 	= require('gulp-clean-css'),
	color 		= require('gulp-color'),
	gulpif 		= require('gulp-if');

var configJSON 	= JSON.parse(fs.readFileSync('config.json'));

/**
 * [sass]
 */
gulp.task('sass', function(){
	gulp.src(configJSON.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(concatCss('all.css'))
		.pipe(rename('all.min.css'))
		.pipe(cleanCss(
			{
				debug: true,
				compatibility: 'ie8'
			}, function(details) {
			console.log(details.name + ': ' + details.stats.originalSize);
			console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('../assets/css/'))
		.pipe(notify({message:'CSS Completed.'}));
	gulp.src('../versions.json')
		.pipe(bump({type: 'patch', key: 'css'}))
		.pipe(gulp.dest('../'));
});

/**
 * [js]
 */
var files 		= configJSON.js.watchFolders;
for(var file in files) {
	gulp.task(files[file], function() {
		var taskName 	= this.seq[0];
		js(taskName);
	});
};

var js = function(folder,isVendor) {
	var src = 'assets/js/'+folder+'/**/*.js';
	if(isVendor) {
		src = folder.folders;
		folder = folder.name;
	}
	gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(gulpif(!isVendor, jshint()))
		.pipe(gulpif(!isVendor, jshint.reporter('jshint-stylish')))
		.pipe(concat(folder+'.js'))
		.pipe(rename(folder+'.min.js'))
		.pipe(
			uglify().on('error', function(err) {
				return notify().write(err);
			})
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('../assets/js/'))
		.pipe(notify({ message: 'JS '+folder+' Completed' }))
	;

	gulp.src('../versions.json')
		.pipe(bump({type: 'patch', key: 'js'}))
		.pipe(gulp.dest('../'))
	;
};

gulp.task('watch', ['build'], function() {
	configJSON 	= JSON.parse(fs.readFileSync('config.json'));
	folders 	= configJSON.js.watchFolders;
	console.log(color('Watching JS folders: ', 'GREEN'));
	for(var folder in folders) {
		console.log("\tassets/js/"+folders[folder]);
		gulp.watch('assets/js/'+folders[folder]+'/**/*.js',[folders[folder]]);
	}

	console.log(color('Watching SASS folders: ', 'GREEN'));
	console.log("\tassets/sass");
	gulp.watch('assets/sass/**/*.scss',['sass']);
});

gulp.task('fonts', function() {
	configJSON 	= JSON.parse(fs.readFileSync('config.json'));
	folders 	= configJSON.fonts;
	console.log(color('Moving fonts for: ', 'GREEN'));
	for(var folder in folders) {
		console.log("\t"+folder);
		gulp.src(folders[folder].src)
		.pipe(gulp.dest(folders[folder].dst))
	}

});

gulp.task('build', ['sass', 'fonts'], function() {
	configJSON 	= JSON.parse(fs.readFileSync('config.json'));
	// Vendor
	res = {
		"name": "vendor",
		"folders": configJSON.js.vendor
	};
	js(res, true);

	// Watch folder
	folders 	= configJSON.js.watchFolders;
	for(folder in folders) {
		js(folders[folder], false);
	}
});

gulp.task('default', ['watch']);
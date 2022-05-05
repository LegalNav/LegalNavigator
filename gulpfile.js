// Dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var sass = require('gulp-sass')(require('sass'));;
var notify = require('gulp-notify');
var cssbeautify = require('gulp-cssbeautify');
var mmq = require('gulp-merge-media-queries');
// Extension Configurations
var jgzconfig = {
	extension: 'jgz'
};
var csgzconfig = {
	extension: 'csgz'
};
// File Paths
var paths = {
	destination: './wp-content/themes/legalnav2021/assets/',
	js: [
		'./wp-content/themes/legalnav2021/assets/source/js/global.js',
		'./wp-content/themes/legalnav2021/assets/source/js/court_case_lookup.js',
		'./wp-content/themes/legalnav2021/assets/source/js/locations.js',
		'./wp-content/themes/legalnav2021/assets/source/js/topics.js',
		'./wp-content/themes/legalnav2021/assets/source/js/related-topics.js',
		'./wp-content/themes/legalnav2021/assets/source/js/spotActions.js'
	],
	scss: [
		'./wp-content/themes/legalnav2021/assets/source/scss/gulp.scss',
		'./wp-content/themes/legalnav2021/assets/source/scss/const/*.scss'
	],
	watchScss: [
		'./wp-content/themes/legalnav2021/assets/source/scss/*.scss',
		'./wp-content/themes/legalnav2021/assets/source/scss/const/*.scss'
	]
};

function compileJS(cb) {
	gulp.src(paths.js)
		//.pipe(uglify())
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./wp-content/themes/legalnav2021/assets/js'))
		.pipe(notify({
			message: "Main JS processed"
		}));
		
	// Compile Curated Experience JS Seperately
	gulp.src(
			[
				'./wp-content/themes/legalnav2021/assets/source/js/caja_interpreter/tokens.js',
				'./wp-content/themes/legalnav2021/assets/source/js/caja_interpreter/lexer.js',
				'./wp-content/themes/legalnav2021/assets/source/js/caja_interpreter/astNodes.js',
				'./wp-content/themes/legalnav2021/assets/source/js/caja_interpreter/parser.js',
				'./wp-content/themes/legalnav2021/assets/source/js/caja_interpreter/interpreter.js',
				'./wp-content/themes/legalnav2021/assets/source/js/personal_plan_builder/planBuilder.js',
				'./wp-content/themes/legalnav2021/assets/source/js/curated_experience.js',
			]
		)
		.pipe(concat('curated_experience.js'))
		.pipe(gulp.dest('./wp-content/themes/legalnav2021/assets/js'))
		.pipe(notify({
			message: "Curated Experience JS processed"
		}));
	cb();
}

// File Path for Admin js
var paths_for_admin = {
	destination: './wp-content/themes/legalnav2021/assets/',
	js: [
		'./wp-content/themes/legalnav2021/assets/source/js/admin.js',
	]
};

function compileJS_for_admin(cb) {
	gulp.src(paths_for_admin.js)
		//.pipe(uglify())
		.pipe(concat('admin.js'))
		.pipe(gulp.dest('./wp-content/themes/legalnav2021/assets/js'))
		.pipe(notify({
			message: "Admin JS processed"
		}));
	cb();
}

function compileSCSS(cb) {
	gulp.src(paths.scss)
		.pipe(sass({
			outputStyle: 'compressed',
			sourceComments: true
		}).on('error', sass.logError))
		.pipe(concat('gulp.css'))
		// condense our media queries down
		.pipe(mmq())
		.pipe(cssbeautify())
		.pipe(gulp.dest('./wp-content/themes/legalnav2021/assets/css'))
		.pipe(notify({
			message: "SCSS processed"
		}));
	cb();
}

// Watchers
gulp.watch(paths.js, compileJS);
gulp.watch(paths.watchScss, compileSCSS);
exports.default = gulp.parallel(compileJS, compileJS_for_admin, compileSCSS);
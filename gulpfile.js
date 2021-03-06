const argv = require("argv");
const babel = require("gulp-babel");
const gulp = require("gulp");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const typescript = require("gulp-typescript");
const uglify = require("gulp-uglify");

const args = argv.option({name: "env", short: "e", type: "string"}).run();
const isDebug = args.options["env"] === "debug";
const destDirname = isDebug ? "debug" : "build"
const dest = `./${destDirname}`;
const tsconfig = () => typescript("tsconfig.json");

gulp.task("compile", () => {
    const src = gulp.src(["./src/**/*.ts", "!./src/**/*.d.ts"], { base: "./src" });
    if (isDebug) {
        return src.pipe(sourcemaps.init())
            .pipe(tsconfig())
            .pipe(sourcemaps.mapSources((sourcePath, file) => {
                const to = path.dirname(file.path);
                const buildToRoot = path.relative(to, __dirname);
                const rootToSource = path.relative(__dirname, to);
                const fileName = path.basename(sourcePath);
                return path.join(buildToRoot, rootToSource, fileName);
            }))
            .pipe(babel({
                presets: [
                    ["env", {
                        useBuiltIns: "usage"
                    }]
                ]
            }))
            .pipe(sourcemaps.write(""))
            .pipe(gulp.dest(dest));
    } else {
        return src.pipe(tsconfig())
            .pipe(babel({
                presets: [
                    ["env", {
                        useBuiltIns: "usage"
                    }]
                ]
            }))
            .pipe(uglify())
            .pipe(gulp.dest(dest));
    }
});

gulp.task("build", ["compile"]);

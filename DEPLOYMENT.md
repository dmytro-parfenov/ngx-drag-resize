# Deployment steps

 - Update `projects/ngx-drag-resize/CHANGELOG.md` according to the future version
 - Run `lib:version:major` | `lib:version:minor` | `lib:version:patch` depends on changes have done
 - Add version tag for the commit with new version. Example `0.0.1`
 - Run `docs:lib` to build docs site will be stored in `docs`
 - Add version tag for the commit with new docs site. Example `docs-0.0.1`
 - Run `build:lib:prod` to build library will be stored in `dist/ngx-drag-resize`
 - Go to `cd dist/ngx-drag-resize` and run `npm publish` for publish library to npm registry

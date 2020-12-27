# Deployment steps

- Run `lib:version:major` | `lib:version:minor` | `lib:version:patch` depends on changes have done
- Update `projects/ngx-drag-resize/CHANGELOG.md` according to the future version
- Add version tag for the commit with new version. Example `0.0.1`
- Run `docs:lib` to build docs site will be stored in `docs`
- Add version tag for the commit with new docs site. Example `docs-0.0.1`
- Add version tag for the appropriate commit with actual demo app. Example `demo-0.0.1`
- Push all commits and tags to the `master` branch
- Run `build:lib:prod` to build library will be stored in `dist/ngx-drag-resize`
- Go to `cd dist/ngx-drag-resize` and run `npm publish` for publish library to npm registry
- Run `build:demo:prod` to build demo app will be stored in `dist/ngx-drag-resize-demo`
- Run `deploy:demo:firebase` to deploy the demo on firebase project `ngx-drag-resize`

'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ngx-drag-resize documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/NgxDragResizeModule.html" data-type="entity-link">NgxDragResizeModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-NgxDragResizeModule-604d9f513448750faee317d781d4874e"' : 'data-target="#xs-directives-links-module-NgxDragResizeModule-604d9f513448750faee317d781d4874e"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-NgxDragResizeModule-604d9f513448750faee317d781d4874e"' :
                                        'id="xs-directives-links-module-NgxDragResizeModule-604d9f513448750faee317d781d4874e"' }>
                                        <li class="link">
                                            <a href="directives/NgxDragDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">NgxDragDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/NgxDragHandleDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">NgxDragHandleDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/NgxResizeDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">NgxResizeDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/NgxResizeHandleDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">NgxResizeHandleDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Boundary.html" data-type="entity-link">Boundary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Movement.html" data-type="entity-link">Movement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MovementBase.html" data-type="entity-link">MovementBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NgxDrag.html" data-type="entity-link">NgxDrag</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NgxResize.html" data-type="entity-link">NgxResize</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PositionBase.html" data-type="entity-link">PositionBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Scale.html" data-type="entity-link">Scale</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
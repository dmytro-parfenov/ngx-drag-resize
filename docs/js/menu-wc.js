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
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/NgxDragResizeModule.html" data-type="entity-link" >NgxDragResizeModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-NgxDragResizeModule-46e7109d9a7400dec529b73298f0c8de546c3ab96d637165fd71cb007bd836ac682463d80551bb2cb7e24314a6b54315fccf7d1e0d047a74ef2bbe85b35af867"' : 'data-bs-target="#xs-directives-links-module-NgxDragResizeModule-46e7109d9a7400dec529b73298f0c8de546c3ab96d637165fd71cb007bd836ac682463d80551bb2cb7e24314a6b54315fccf7d1e0d047a74ef2bbe85b35af867"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-NgxDragResizeModule-46e7109d9a7400dec529b73298f0c8de546c3ab96d637165fd71cb007bd836ac682463d80551bb2cb7e24314a6b54315fccf7d1e0d047a74ef2bbe85b35af867"' :
                                        'id="xs-directives-links-module-NgxDragResizeModule-46e7109d9a7400dec529b73298f0c8de546c3ab96d637165fd71cb007bd836ac682463d80551bb2cb7e24314a6b54315fccf7d1e0d047a74ef2bbe85b35af867"' }>
                                        <li class="link">
                                            <a href="directives/NgxDragDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgxDragDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/NgxDragHandleDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgxDragHandleDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/NgxResizeDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgxResizeDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/NgxResizeHandleDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgxResizeHandleDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Boundary.html" data-type="entity-link" >Boundary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Movement.html" data-type="entity-link" >Movement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MovementBase.html" data-type="entity-link" >MovementBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NgxDrag.html" data-type="entity-link" >NgxDrag</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NgxResize.html" data-type="entity-link" >NgxResize</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PositionBase.html" data-type="entity-link" >PositionBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Scale.html" data-type="entity-link" >Scale</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
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
                        </ul>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
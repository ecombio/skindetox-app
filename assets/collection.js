"use strict";
const options = {
    collectionsLoadMore: '.collections-load-more',
    blsLinkFilter: '.bls__link-filter',
    openFilter: '.filter-title .open-children-toggle',
    rangeSlider: '.price-range .range-slider',
    rangeSliderMin: '.range-slider-min',
    rangeSliderMax: '.range-slider-max',
    gridMode: '.grid-mode-show-type-products .grid-mode',
    viewMode: '.view-mode',
    sidebarClose: '.sidebar-close',
    collectionSidebar: '#CollectionSidebar',
    collectionFiltersForm: '#CollectionFiltersForm',
    btnFilter: '.collection-filter .btn-filter',
    section: '.section-collection-product',
    toolbarSorter: '.toolbar-sorter .select-selected',
    facetFiltersSort: '.facet-filters__sort li',
    overlay: '.bls__overlay',
    filterSortMb: '.toolbar-sorter-mb .facet-filters__label',
    dataSortMb: '.toolbar-sorter-mb__option',
    closeSortMb: '.close-select'
};

var BlsEventCollectionShopify = (function() {
    return {
        init: function() {
            this.setupEventListeners();
            this.eventLoadMore();
            this.ionRangeSlider();
            this.actionDesc();
        },

        actionDesc: function(){
            const viewMore = document.querySelector('[data-view-more]');
            if (viewMore) {
                viewMore.addEventListener('click', function(e) {
                    const target = e.currentTarget;
                    if (target.closest('.heading-description').classList.contains('show-full-desc')) {
                        target.closest('.heading-description').classList.remove('show-full-desc');
                        target.textContent = target.dataset.readMore
                    } else {
                        target.closest('.heading-description').classList.add('show-full-desc');
                        target.textContent = target.dataset.readLess
                    }
                });
            }
        },

        setupEventListeners: function() {
            document.querySelectorAll(options.btnFilter).forEach(btn => {
                btn.addEventListener("click", event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    if (document.querySelector(options.collectionSidebar).classList.contains('bls__opend-popup')) {
                        target.classList.remove('actived')
                        document.querySelector(options.collectionSidebar).classList.remove('bls__opend-popup');
                        document.querySelector(options.overlay).classList.add('d-none-overlay');
                        document.documentElement.classList.remove('hside_opened');
                        if (target.closest('.collection-filter').classList.contains('dropdonw_sidebar')) {
                            if (window.innerWidth >= 1024) {
                                slideAnime({
                                    target: target.closest('#productgridcontainer').querySelector('#CollectionSidebar'),
                                    animeType: 'slideToggle'
                                });
                            }
                        }
                        target.classList.remove('actived')
                    } else {
                        target.classList.add('actived')
                        document.querySelector(options.collectionSidebar).classList.add('bls__opend-popup');
                        if (!target.closest('.collection-filter').classList.contains('dropdonw_sidebar')) {
                            document.querySelector(options.overlay).classList.remove('d-none-overlay');
                            document.documentElement.classList.add('hside_opened');
                        } else {
                            if (window.innerWidth < 1024) {
                                document.querySelector(options.overlay).classList.remove('d-none-overlay');
                                document.documentElement.classList.add('hside_opened');
                            } else {
                                slideAnime({
                                    target: target.closest('#productgridcontainer').querySelector('#CollectionSidebar'),
                                    animeType: 'slideToggle'
                                });
                            }
                        }
                    }
                }, false);
            });

            document.querySelectorAll(options.openFilter).forEach(btn => {
                btn.addEventListener("click", event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    slideAnime({
                        target: target.closest('.filter-item').querySelector('.filter-content'),
                        animeType: 'slideToggle'
                    });
                    if (target.classList.contains('active')) {
                        target.classList.remove('active');
                    } else {
                        target.classList.add('active')
                    }
                }, false);
            });

            document.querySelectorAll(options.sidebarClose).forEach(btn => {
                btn.addEventListener("click", event => {
                    event.preventDefault();
                    document.querySelector(options.collectionSidebar).classList.remove('bls__opend-popup');
                    if (document.querySelector(options.btnFilter)) {
                        document.querySelector(options.btnFilter).classList.remove('actived');
                    }
                    document.querySelector(options.overlay).classList.add('d-none-overlay');
                    document.documentElement.classList.remove('hside_opened');
                }, false);
            });

            document.querySelectorAll(options.viewMode).forEach(view => {
                view.addEventListener("click", event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    const view_mode = target.getAttribute('data-view');
                    if (target.classList.contains('actived')) return;
                    var queryString = window.location.search;
                    queryString = this.removeParam('view', queryString);
                    if (view_mode == 'list') {
                        var searchParams = queryString.replace('?', '')+'&view=list';
                    } else {
                        var searchParams = queryString.replace('?', '')+'&view=grid';
                    }
                    const url = this.renderUrl(searchParams);
                    this.renderSectionFilter(url, searchParams);
                }, false);
            });

            document.querySelectorAll(options.gridMode).forEach(btn => {
                btn.addEventListener("click", event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    const view_mode = target.getAttribute('data-grid-mode');
                    if (target.classList.contains('actived')) return;
                    if (view_mode == 1) return;
                    for (var item of document.querySelectorAll(options.gridMode)) {
                        item.classList.remove('actived');
                    }
                    const container_switch = document.querySelector('.container-products-switch');
                    target.classList.add('actived');
                    const data_view_mode = container_switch.getAttribute('data-view-mode');
                    container_switch.classList.remove('grid-columns-'+data_view_mode);
                    container_switch.setAttribute('data-view-mode',view_mode);
                    container_switch.classList.add('grid-columns-'+view_mode);
                }, false);
            });

            document.querySelectorAll(options.blsLinkFilter).forEach(btn => {
                btn.addEventListener("click", event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    if (target.querySelector('.bls_tooltip')) {
                        target.querySelector('.bls_tooltip').classList.toggle('current-filter');
                    } else {
                        target.closest('li').classList.toggle('current-filter');
                    }
                    const url = target.getAttribute('href');
                    this.renderSectionFilter(url);
                }, false);
            });

            document.body.addEventListener('click', (evt) => {
                const target = evt.target;
                const btn_dropdonw_sidebar = document.querySelector('.collection-filter.dropdonw_sidebar .btn-filter'); 
                if (!target.closest('.select-custom') && target != document.querySelector('.toolbar-sorter .select-custom')) {
                    if (document.querySelector('.toolbar-sorter .select-custom')) {
                        document.querySelector('.toolbar-sorter .select-custom').classList.remove('actived');
                    }
                }
                if (!target.closest('#CollectionSidebar') && target != document.querySelector('#CollectionSidebar') && btn_dropdonw_sidebar && target != btn_dropdonw_sidebar) {
                    if (window.innerWidth >= 1024) {
                        btn_dropdonw_sidebar.classList.remove('actived')
                        document.querySelector(options.collectionSidebar).classList.remove('bls__opend-popup');
                        document.querySelector(options.overlay).classList.add('d-none-overlay');
                        document.documentElement.classList.remove('hside_opened');
                        slideAnime({
                            target: btn_dropdonw_sidebar.closest('#productgridcontainer').querySelector('#CollectionSidebar'),
                            animeType: 'slideUp'
                        });
                    }
                }
            });

            document.querySelectorAll(options.toolbarSorter).forEach(filterSort => {
                filterSort.addEventListener("click", event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    if (target.closest('.select-custom').classList.contains('actived')) {
                        target.closest('.select-custom').classList.remove('actived');
                    } else {
                        target.closest('.select-custom').classList.add('actived');
                    }
                }, false);
            });
            
            if (document.querySelector(options.filterSortMb)) {
                document.querySelector(options.filterSortMb).addEventListener('click' , event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    if (target.closest('.toolbar-sorter-mb').classList.contains('open-selected')) {
                        target.closest('.toolbar-sorter-mb').classList.remove('open-selected')
                    } else {
                        target.closest('.toolbar-sorter-mb').classList.add('open-selected')
                    }
                }, false);
            }
            
            if (document.querySelector(options.closeSortMb)) {
                document.querySelector(options.closeSortMb).addEventListener('click', event => {
                    event.preventDefault();
                    document.querySelector('.toolbar-sorter-mb').classList.remove('open-selected')
                })
            }

            document.querySelectorAll(options.facetFiltersSort).forEach(filterSort => {
                filterSort.addEventListener("click", event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    const value = target.getAttribute('value');
                    var queryString = window.location.search;
                    queryString = this.removeParam('sort_by', queryString);
                    var searchParams = queryString.replace('?', '')+'&sort_by='+value;
                    const url = this.renderUrl(searchParams);
                    this.renderSectionFilter(url, searchParams);
                }, false);
            });
        },

        ionRangeSlider: function() {
            const price_range = document.querySelector('.price-range');
            const maxRange = document.querySelector(options.rangeSliderMax);
            const minRange = document.querySelector(options.rangeSliderMin);
            const minPrice = document.querySelector('.min-price-range');
            const maxPrice = document.querySelector('.max-price-range');
            var minPriceRange = 0;
            var maxPriceRange = 0;
            if (!price_range) return;
            document.querySelector(options.rangeSliderMin).addEventListener("input", event => {
                event.preventDefault();
                const target = event.currentTarget;
                if (Number(maxRange.value) - Number(target.value) >= 1) {
                    minPrice.value = Number(target.value);
                    minPriceRange = Number(target.value) * 100;
                } else {
                    target.value = Number(maxRange.value) - 1;
                    minPriceRange = (Number(maxRange.value) - 1)*100;
                }
                const price_format = Shopify.formatMoney(minPriceRange, cartStrings.money_format);
                document.querySelector('.price-lable .min').innerHTML = price_format;
                target.closest(".price-range").style.setProperty('--range-from', minRange.value / Number(target.getAttribute('max')) * 100 + '%');
            }, false);
            document.querySelector(options.rangeSliderMax).addEventListener("input", event => {
                event.preventDefault();
                const target = event.currentTarget;
                if (target.value - minRange.value >= 1) {
                    maxPrice.value = target.value;
                    maxPriceRange = Number(target.value) * 100;
                } else {
                    target.value = Number(minRange.value) + Number(1);
                    maxPriceRange = (Number(minRange.value) + Number(1)) * 100;
                }
                const price_format = Shopify.formatMoney(maxPriceRange, cartStrings.money_format);
                document.querySelector('.price-lable .max').innerHTML = price_format;
                target.closest(".price-range").style.setProperty('--range-to', maxRange.value / Number(target.getAttribute('max')) * 100 + '%');
            }, false);
            document.querySelectorAll(options.rangeSlider).forEach(sliderRange => {
                sliderRange.addEventListener("change", event => {
                    event.preventDefault();
                    const target = event.currentTarget;
                    const formData = new FormData(document.querySelector(options.collectionFiltersForm));
                    const params = new URLSearchParams(formData).toString();
                    const nameMin = minPrice.getAttribute('name');
                    const nameMax = maxPrice.getAttribute('name');
                    var queryString = window.location.search;
                    queryString = this.removeParam(nameMin, queryString);
                    queryString = this.removeParam(nameMax, queryString);
                    var searchParams = queryString.replace('?', '')+'&'+params;
                    const url = this.renderUrl(searchParams);
                    this.renderSectionFilter(url, searchParams);
                }, false);
            });
        },

        removeParam: function(key, sourceURL) {
            var rtn = sourceURL.split("?")[0],
                param,
                params_arr = [],
                queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
            if (queryString !== "") {
                params_arr = queryString.split("&");
                for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                    param = params_arr[i].split("=")[0];
                    if (param === key) {
                        params_arr.splice(i, 1);
                    }
                }
                if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
            }
            return rtn;
        },

        renderUrl: function(searchParams) {
            const sectionId = document.querySelector(options.section).dataset.sectionId;
            const url = `${window.location.pathname}?section_id=${sectionId}&${searchParams}`;
            return url;
        },

        renderSectionFilter: function(url, searchParams) {
            this.toggleLoading(document.body, true);
            fetch(`${url}`)
                .then((response) => {
                    if (!response.ok) {
                    var error = new Error(response.status);
                    throw error;
                    }
                    return response.text();
                })
                .then(responseText => {
                    const newSection = new DOMParser().parseFromString(responseText, 'text/html').querySelector(options.section);
                    document.querySelector(options.section).replaceWith(newSection);
                    document.querySelector(options.overlay).classList.add('d-none-overlay');
                    document.documentElement.classList.remove('hside_opened');
                    this.toggleLoading(document.body, false);
                })
                .catch((error) => {
                    throw error;
                })
                .finally(() => {
                    BlsReloadSpr.init();
                    BlsEventCollectionShopify.init();
                    BlsColorSwatchesShopify.init();
                    BlsSubActionProduct.init();
                    setTimeout(function() {
                        BlsLazyloadImg.init();
                    }, 200);
                });
            this.updateUrl(url, searchParams);
        },

        eventLoadMore: function() {
            document.querySelectorAll(options.collectionsLoadMore).forEach(loadMore => {
                var _this = this;
                if (loadMore.classList.contains('infinit-scrolling')) {
                    var observer = new IntersectionObserver(function (entries) {
                        entries.forEach(entry => {
                            entries.forEach(entry => {
                                if (entry.intersectionRatio === 1){
                                    _this.loadMoreProducts(loadMore);
                                }
                            });
                        });
                    }, {threshold: 1.0});
                    observer.observe(loadMore);
                } else {
                    loadMore.addEventListener("click", event => {
                        event.preventDefault();
                        const target = event.currentTarget;
                        _this.loadMoreProducts(target);
                    }, false);
                }
            });
        },

        loadMoreProducts: function(target) {
            const loadMore_url = target.getAttribute('href');
            this.toggleLoading(target, true);
            fetch(`${loadMore_url}`)
                .then((response) => {
                    if (!response.ok) {
                    var error = new Error(response.status);
                    throw error;
                    }
                    return response.text();
                })
                .then(responseText => {
                    const productNodes = parser.parseFromString(responseText, 'text/html');
                    const productNodesHtml = productNodes.querySelectorAll('#bls__product-grid .bls__grid__item');
                    productNodesHtml.forEach(prodNode => document.getElementById("bls__product-grid").appendChild(prodNode));
                    const load_more = productNodes.querySelector('.collections-load-more');
                    document.querySelector(".load-more-amount").innerHTML = productNodes.querySelector('.load-more-amount').textContent;
                    document.querySelector(".load-more-percent").style.width = productNodes.querySelector('.load-more-percent').style.width;
                    if ( load_more ) {
                        target.setAttribute("href", load_more.getAttribute('href'));
                    } else {
                        target.remove();
                    }
                    this.toggleLoading(target, false);
                })
                .catch((error) => {
                    throw error;
                })
                .finally(() => {
                    BlsColorSwatchesShopify.init();
                    BlsSubActionProduct.init();
                    BlsReloadSpr.init();
                    setTimeout(function() {
                        BlsLazyloadImg.init();
                    }, 200);
                    
                });
        },

        toggleLoading: function(event, loading) {
            if (event) {
                if (loading) {
                  event.classList.add('start', 'loading');
                } else {
                  event.classList.add('finish');
                  setTimeout(function() {
                    event.classList.remove('start', 'loading', 'finish');
                  }, 500)
                }
            }
        },

        updateUrl: function(url, searchParams = false) {
            if (searchParams) {
                const urlUpdate = `${window.location.pathname}?${searchParams}`;
                window.history.pushState({url: urlUpdate}, '', urlUpdate);
            } else {
                window.history.pushState({url: url}, '', url);
            }
        }
    }
})();
BlsEventCollectionShopify.init();
jQuery(document).ready( function( $ ) {
    $.extend(jQuery.expr[':'], {
        search: function(el, index, meta) {
            return jQuery(el).text().toLowerCase().indexOf(meta[3].toLowerCase()) >= 0;
        }
    });

    var gats_parent_div = '.categorydiv';
    var gats_checkbox_el = '.categorychecklist li';

    var editor_type = 'Classic';
    if( typeof wp !== 'undefined' && typeof wp.blocks !== 'undefined' )
        editor_type = 'Gutenberg';

    if( editor_type == 'Classic' ){
        $('.categorydiv').each(function(){
            var parent_id = $(this).attr('id').replace('taxonomy-', '');
            var taxonomy_name = $(this).attr('id').replace('taxonomy-', '');
            var all_category_panel = $('#'+taxonomy_name+'-all');

            var search_el = '<div id="'+parent_id+'-search" class="gats_search_div">';
            search_el += '<input type="text" id="'+parent_id+'-search-field" class="gats_search_field" placeholder="Search" >';
            search_el += '</div>';

            all_category_panel.addClass('gats_activated');
            all_category_panel.prepend(search_el);
        });

    } else {
        gats_parent_div = '.guten_gats_div';
        gats_checkbox_el = '.editor-post-taxonomies__hierarchical-terms-choice';

        (function (hooks, i18n, element) {
            var __ = i18n.__
            var el = element.createElement;
            var GATS_NAME = gats_infos.GATS_NAME;

            //var magnets_data = cmg_global.magnets_data;
            //var CMG_NAME = cmg_infos.CMG_NAME;
            var first_init = true;

            function prevent_undefined(t_val, empty_val = '') {
                return (typeof t_val !== 'undefined' && t_val != '') ? t_val : empty_val;
            }

            function customizeProductTypeSelector( OriginalComponent ) {
                return function( props ) {
                    var attributes = props.attributes;

                    if ( props.slug === 'category' ) {
                        return el('div', {
                                class: 'guten_gats_div guten_gats_activated'
                            },
                            el('label', {
                                    className: 'gats_search_field_label'
                                }, __('Search', GATS_NAME),
                                el('input', {
                                    id: '',
                                    className: 'gats_search_field',
                                    type: 'search',
                                    placeholder: __('Type to search', GATS_NAME),
                                    keepPlaceholderOnFocus: true,
                                    onChange: function (gats_search) {
                                    }
                                }),
                            ),

                            el(OriginalComponent, props)
                        );
                    } else {
                        return el(
                            OriginalComponent,
                            props
                        );
                    }
                }
            };

            hooks.addFilter(
                'editor.PostTaxonomyType',
                'my-custom-plugin',
                customizeProductTypeSelector
            );
        })(
            window.wp.hooks,
            window.wp.i18n,
            window.wp.element,
        )
    }


    $('body').on('keyup', '.gats_search_field', function(e){
        e.preventDefault();

        var s = $(this).val();

        if ( $.trim(s) == "" ){
            $(this).parents(gats_parent_div).first().find(gats_checkbox_el).show();
        } else {
            $(this).parents(gats_parent_div).first().find(gats_checkbox_el).each(function(index, el){
                if( $(el).find('label').text().toLowerCase().indexOf( s.toLowerCase() ) >= 0 ){
                    $(el).show();
                } else {
                    $(el).hide();
                }
            });
        }
    });

    $('body').on('submit', '.gats_search_field', function(e){
        e.preventDefault();
        return false;
    });

});

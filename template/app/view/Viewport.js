/**
 * The main viewport, split in to a west and center region.
 * The North region should also be shown by default in the packaged
 * (non-live) version of the docs. TODO: close button on north region.
 */
Ext.define('Docs.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Docs.view.cls.Container',
        'Docs.view.index.Container',
        'Docs.view.tree.Tree',
        'Docs.view.ClassGrid',
        'Docs.Favorites',
        'Docs.History'
    ],

    id: 'viewport',
    layout: 'border',
    defaults: { xtype: 'container' },

    initComponent: function() {
        this.items = [

            {
                region:'west',
                width: 240,
                id: 'west-region-container',
                padding: '5 0 20 0',
                layout: 'vbox',
                defaults: {
                    xtype: 'container',
                    width: "100%"
                },
                items: [
                    {
                        xtype: 'button',
                        cls: 'logo',
                        height: 60,
                        margin: '0 0 10 10',
                        width: 220,
                        border: 0,
                        ui: 'hmm',
                        listeners: {
                            click: function() {
                                this.setPageTitle("");
                                Ext.getCmp('container').layout.setActiveItem(0);
                                Docs.History.push("");
                            },
                            scope: this
                        }
                    },
                    {
                        cls: 'search',
                        id: 'search-container',
                        margin: '0 0 0 5',
                        height: 40,
                        items: [
                            {
                                xtype: 'triggerfield',
                                triggerCls: 'reset',
                                emptyText: 'Search',
                                id: 'search-field',
                                enableKeyEvents: true,
                                hideTrigger: true,
                                onTriggerClick: function() {
                                    this.reset();
                                    this.focus();
                                    this.setHideTrigger(true);
                                    Ext.getCmp('search-dropdown').hide();
                                }
                            },
                            {
                                xtype: 'searchdropdown'
                            }
                        ]
                    },
                    {
                        id: 'nested-west-region-container',
                        flex: 1,
                        layout: 'border',
                        border: false,
                        items: [
                            {
                                id: 'nested-west-region-north',
                                xtype: 'tabpanel',
                                region: 'north',
                                height: 150,
                                padding: '2 5 0 0',
                                // margin: '0 10 4 0',
                                plain: true,
                                border: false,
                                bodyPadding: '8 15 8 25',
                                split: true,
                                listeners: {
                                    afterRender: function() {
                                        this.tabBar.insert(0, {width: 10, xtype: 'container'})
                                    }
                                },
                                items: [
                                    {
                                        xtype: 'classgrid',
                                        id: 'favorites-grid',
                                        title: 'Favorites',
                                        store: Ext.getStore('Favorites'),
                                        icons: Docs.icons,
                                        listeners: {
                                            closeclick: function(cls) {
                                                Docs.Favorites.remove(cls);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'classgrid',
                                        id: 'history-grid',
                                        title: 'History',
                                        store: Ext.getStore('History'),
                                        icons: Docs.icons,
                                        listeners: {
                                            closeclick: function(cls) {
                                                Docs.History.removeClass(cls);
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                region: 'center',
                                xtype: 'classtree',
                                padding: '10 10 0 10',
                                margin: '0 5 0 0',
                                root: Docs.classData
                            }
                        ]
                    }
                ]
            },
            {
                region: 'center',
                id: 'center-container',
                layout: 'fit',
                minWidth: 800,
                padding: '20 20 5 0',
                items: {
                    id: 'container',
                    xtype: 'container',
                    layout: 'card',
                    padding: '20',
                    cls: 'container',
                    items: [
                        {
                            autoScroll: true,
                            xtype: 'indexcontainer',
                            classData: Docs.overviewData
                        },
                        {
                            xtype: 'classcontainer'
                        },
                        {
                            autoScroll: true,
                            xtype: 'container',
                            id: 'guide'
                        }
                    ]
                }
            },
            {
                region: 'south',
                id: 'footer',
                contentEl: 'footer-content',
                height: 15
            }
        ];

        this.callParent(arguments);
    },

    /**
     * Sets the contents of `<title>` tag.
     * @param {String} text
     */
    setPageTitle: function(text) {
        text = Ext.util.Format.stripTags(text);
        var title = Ext.query("title")[0];
        if (!this.origTitle) {
            this.origTitle = title.innerHTML;
        }
        title.innerHTML = text ? (text + " - " + this.origTitle) : this.origTitle;
    }
});

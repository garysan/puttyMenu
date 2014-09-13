/**
 * PuttyMenu for GNOME Shell
 *
 * Copyright (c) 2014 Gary Sandi Vigabriel <gary.gsv@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Drive menu extension
const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const St = imports.gi.St;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;
const Main = imports.ui.main;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;


const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const PuttyMenu = new Lang.Class({
    Name: 'PuttyMenu.PuttyMenu',
    Extends: PanelMenu.Button,

    _init: function() {
        this.parent(0.0, _("putty"));

        let hbox = new St.BoxLayout({ style_class: 'panel-status-menu-box' });
        let icon = new St.Icon({ icon_name: 'putty',
                                 style_class: 'system-status-icon' });
        
        hbox.add_child(icon);
        hbox.add_child(new St.Label({ text: '\u25BE',
                                      y_expand: true,
                                      y_align: Clutter.ActorAlign.CENTER }));
        this.actor.add_child(hbox);
	     
        let userdir=String(GLib.get_home_dir());
        let puttycm='.putty/sessions/';
        let command='ls -1 '+userdir+'/'+puttycm; 
        
        try {
        	let vs = String(GLib.spawn_command_line_sync(command)[1]);
        	let res = vs.split("\n");
        	
        	for (i=0;i<res.length-1;i++)
        	{
        		let id = res[i];
        		
        		this.menu.addAction (id,function(event) {
        		Util.spawn([ 'putty', '-load', id ]);
			});
        	}
	}
	catch (err) {	
		Main.notifyError("Error en la lectura de archivos");		
	}

	this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
	this.menu.addAction(_("Abrir Putty"), function(event) {
	    Util.spawn([ 'putty' ]);
	});
	
	
    },     
});

function init() {
	
}


let _indicator;

function enable() {
    _indicator = new PuttyMenu;
    Main.panel.addToStatusArea('putty-menu', _indicator);
}

function disable() {
    _indicator.destroy();
}

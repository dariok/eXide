/*
 *  eXide - web-based XQuery IDE
 *  
 *  Copyright (C) 2011 Wolfgang Meier
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
eXide.namespace("eXide.edit.commands");

/**
 * Register editor commands to be called from keybindings.
 */
eXide.edit.commands = (function () {

	var useragent = require("ace/lib/useragent");
	var bindings = {};
    
	function bindKey(bindings) {
	    return {
	        win: bindings[0],
	        mac: bindings[1],
	        sender: "editor"
	    };
	}
	
    function createMap(editor) {
        var commands = editor.editor.commands;
        for (key in commands.commands)  {
            var command = commands.commands[key];
            var bind;
            if (command.bindKey) {
    			if (useragent.isMac)
				    bind = command.bindKey.mac;
				else
					bind = command.bindKey.win;
            }
            bindings[command.name] = bind;
        }
    }
    
	return {
		
		init: function (parent) {
            var commands = parent.editor.commands;
            $.ajax({
                url: "keybindings.js",
                dataType: 'json',
                async: false,
                success: function(bindings) {
                    commands.addCommand({
                        name: "gotoLine",
                        bindKey: bindKey(bindings.gotoLine),
                        exec: function(editor) {
                            parent.gotoLine();
                        }
                    });
                    commands.addCommand({
            			name: "fold",
        			    bindKey: bindKey(bindings.fold),
        			    exec: function(editor) {
        					editor.session.toggleFold(false);
        				},
        			    readOnly: true
        			});
        			commands.addCommand({
        				name: "unfold",
        			    bindKey: bindKey(bindings.unfold),
        			    exec: function(editor) { 
        					editor.session.toggleFold(true);
        				},
        			    readOnly: true
        			});
        		    commands.addCommand({
        		    	name: "saveDocument",
        		    	bindKey: bindKey(bindings.saveDocument),
        		    	exec: function (editor) {
        		    		eXide.app.saveDocument();
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "runQuery",
        		    	bindKey: bindKey(bindings.runQuery),
        		    	exec: function (editor) {
        		    		eXide.app.runQuery();
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "openDocument",
        		    	bindKey: bindKey(bindings.openDocument),
        		    	exec: function (editor) {
        		    		eXide.app.openDocument();
        		    	}
        		    });
                    commands.addCommand({
            	    	name: "newDocumentFromTemplate",
        		    	bindKey: bindKey(bindings.newDocumentFromTemplate),
        		    	exec: function (editor) {
        		    		eXide.app.newDocumentFromTemplate();
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "closeDocument",
        		    	bindKey: bindKey(bindings.closeDocument),
        		    	exec: function (editor) {
        		    		eXide.app.closeDocument();
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "autocomplete",
        		    	bindKey: bindKey(bindings.autocomplete),
        		    	exec: function(editor) {
        		    		parent.autocomplete();
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "nextTab",
        		    	bindKey: bindKey(bindings.nextTab),
        		    	exec: function(editor) {
        		    		parent.nextTab();
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "previousTab",
        		    	bindKey: bindKey(bindings.previousTab),
        		    	exec: function(editor) {
        		    		parent.previousTab();
        		    	}
        		    });
                    commands.addCommand({
                        name: "formatCode",
                        bindkey: bindKey(bindings.formatCode),
                        exec: function(editor) {
                            parent.exec("format");
                        }
                    });
        		    commands.addCommand({
        		    	name: "functionDoc",
        		    	bindKey: bindKey(bindings.functionDoc),
        		    	exec: function(editor) {
        		    		parent.exec("showFunctionDoc");
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "gotoDefinition",
        		    	bindKey: bindKey(bindings.gotoDefinition),
        		    	exec: function(editor) {
        		    		parent.exec("gotoDefinition");
        		    	}
        		    });
                    commands.addCommand({
            	    	name: "searchIncremental",
        		    	bindKey: bindKey(bindings.searchIncremental),
        		    	exec: function(editor) {
        		    		parent.quicksearch.start();
        		    	}
        		    });
                    commands.addCommand({
                    	name: "searchReplace",
        		    	bindKey: bindKey(bindings.searchReplace),
        		    	exec: function(editor) {
        		    		parent.search.open();
        		    	}
        		    });
                    commands.addCommand({
            	    	name: "findModule",
        		    	bindKey: bindKey(bindings.findModule),
        		    	exec: function(editor) {
                            var doc = parent.getActiveDocument();
        		    		eXide.find.Modules.select(doc.syntax);
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "indentOrParam",
        		    	bindKey: bindKey(bindings.indentOrParam),
        		    	exec: function(editor) {
        		    		// if there's active template code in the document, tab will
        		    		// cycle through the template's params. Otherwise, it calls indent.
        		    		var doc = parent.getActiveDocument();
        		    		if (!(doc.template && doc.template.nextParam())) {
        		    			editor.indent();
        		    		}
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "escape",
        		    	bindKey: bindKey(bindings.escape),
        		    	exec: function(editor) {
        		    		var doc = parent.getActiveDocument();
        		    		doc.template = null;
        		    		editor.clearSelection();
        		    	}
        		    });
        		    commands.addCommand({
        		    	name: "dbManager",
        		    	bindKey: bindKey(bindings.dbManager),
        		    	exec: function (editor) {
        		    		eXide.app.manage();
        		    	}
        		    });
                    commands.addCommand({
            	    	name: "toggleComment",
        		    	bindKey: bindKey(bindings.toggleComment),
        		    	exec: function (editor) {
        		    		editor.toggleCommentLines();
        		    	}
        		    });
                    commands.addCommand({
                        name: "synchronize",
                        bindKey: bindKey(bindings.synchronize),
                        exec: function(editor) {
                            eXide.app.synchronize();
                        }
                    });
                    commands.addCommand({
                        name: "preferences",
                        bindKey: bindKey(bindings.preferences),
                        exec: function(editor) {
                            eXide.app.showPreferences();
                        }
                    });
                    commands.addCommand({
                        name: "openApp",
                        bindKey: bindKey(bindings.openApp),
                        exec: function(editor) {
                            eXide.app.openApp();
                        }
                    });
                    commands.addCommand({
                        name: "quickfix",
                        bindKey: bindKey(bindings.quickfix),
                        exec: function(editor) {
                            parent.exec("quickFix");
                        }
                    });
                    commands.addCommand({
                        name: "expandSelection",
                        bindKey: bindKey(bindings.expandSelection),
                        exec: function(editor) {
                            parent.exec("expandSelection");
                        }
                    });
                    commands.addCommand({
                        name: "rename",
                        bindKey: bindKey(bindings.rename),
                        exec: function(editor) {
                            parent.exec("rename");
                        }
                    });
                    
    			    createMap(parent);
                }
            });
		},
		
		help: function (container, editor) {
			$(container).find("table").each(function () {
				this.innerHTML = "";
                var commands = editor.editor.commands;
                for (key in commands.commands)  {
                    var command = commands.commands[key];
    				var tr = document.createElement("tr");
					var td = document.createElement("td");
					td.appendChild(document.createTextNode(command.name));
					tr.appendChild(td);
					td = document.createElement("td");
                    if (command.bindKey) {
    					if (useragent.isMac)
    						td.appendChild(document.createTextNode(command.bindKey.mac));
    					else
    						td.appendChild(document.createTextNode(command.bindKey.win));
                    }
					tr.appendChild(td);
					this.appendChild(tr);
                }
			});
		},
        
        getShortcut: function(key) {
            return bindings[key];
        }
        
	};
}());